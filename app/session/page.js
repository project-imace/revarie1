'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { vaultFetch } from '@/lib/vault';
import { STUDY_CONFIG } from '@/study.config';
import VamsSliders from '@/components/ui/VamsSliders';
import TimerOverlay from '@/components/ui/TimerOverlay';
import GlassCard from '@/components/ui/GlassCard';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SelfReflection from '@/components/ui/SelfReflection';

export default function SessionPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [phase, setPhase] = useState('pre-vams');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extraTime, setExtraTime] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [dismissalReason, setDismissalReason] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser();
      if (!u || !u.has_onboarded) {
        router.push('/');
      } else {
        setUser(u);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const startSession = async (vams) => {
    const payload = {
      participant_id: user.participant_id,
      day_number: user.day_progress,
      q1: vams.happy,
      q2: vams.sad,
      q3: vams.calm,
      q4: vams.tense,
      q5: vams.energetic,
      q6: vams.sleepy,
    };
    const res = await vaultFetch('/api/session/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setSessionId(res.session_id);
    setPhase('session');
  };

  const handleSessionComplete = (extra, wasDismissed, reason) => {
    setExtraTime(extra);
    setDismissed(wasDismissed);
    setDismissalReason(reason || '');
    setPhase('post-vams');
  };

  const endSession = async (vams) => {
    const payload = {
      session_id: sessionId,
      participant_id: user.participant_id,
      extra_time_seconds: extraTime,
      dismissed,
      dismissal_reason: dismissalReason,
      q1: vams?.happy ?? 50,
      q2: vams?.sad ?? 50,
      q3: vams?.calm ?? 50,
      q4: vams?.tense ?? 50,
      q5: vams?.energetic ?? 50,
      q6: vams?.sleepy ?? 50,
    };
    await vaultFetch('/api/session/end', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    router.push(`/dashboard`);
  };

  if (loading) {
    return <LoadingScreen isVisible={true} />;
  }

  if (!user) return null;

  if (phase === 'session') {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <TimerOverlay
          mandatorySeconds={STUDY_CONFIG.mandatoryChatMinutes * 60}
          maxExtraSeconds={STUDY_CONFIG.maxExtraMinutes * 60}
          onComplete={handleSessionComplete}
        >
          {user.study_group === 'A' && (
            <iframe
              src="https://revarie.imace.online/lm-v1/samara"
              className="w-full h-[100dvh] border-0 rounded-xl overflow-hidden"
            />
          )}
          {user.study_group === 'B' && (
            <iframe
              src="https://revarie.imace.online/lm-v1/artery"
              className="w-full h-[100dvh] border-0 rounded-xl overflow-hidden"
            />
          )}
          {user.study_group === 'C' && (
            <div className="w-full h-[100dvh] border-0 rounded-xl overflow-hidden">
              <SelfReflection />
            </div>
          )}
        </TimerOverlay>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <GlassCard>
        {phase === 'pre-vams' && (
          <>
            <h2 className="font-mono text-2xl mb-2">Pre‑Interaction Mood</h2>
            <VamsSliders
              questions={STUDY_CONFIG.vamsQuestions}
              onSubmit={startSession}
              submitLabel="Begin Session"
            />
          </>
        )}
        {phase === 'post-vams' && (
          <>
            <h2 className="font-mono text-2xl mb-2">Post‑Interaction Mood</h2>
            <VamsSliders
              questions={STUDY_CONFIG.vamsQuestions}
              onSubmit={endSession}
              submitLabel="Complete Session"
            />
          </>
        )}
      </GlassCard>
    </div>
  );
}
