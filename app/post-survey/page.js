'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { vaultFetch } from '@/lib/vault';
import GlassCard from '@/components/ui/GlassCard';
import SurveyForm from '@/components/ui/SurveyForm';

export default function PostSurveyPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [godspeed, setGodspeed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const u = await getCurrentUser();
      if (!u) {
        router.push('/');
        return;
      }
      if ((u.day_progress || 1) <= 14) {
        router.push('/dashboard');
        return;
      }
      setUser(u);
      const [mainRes, gRes] = await Promise.all([
        fetch('/study-materials/mind-experience-post.json'),
        fetch('/study-materials/godspeed-questions.json'),
      ]);
      setQuestions(await mainRes.json());
      setGodspeed(await gRes.json());
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      await vaultFetch('/api/survey/mind-study', {
        method: 'POST',
        body: JSON.stringify({
          participant_id: user.participant_id,
          day: 14,
          payload: payload.main,
          godspeed: payload.godspeed,
        }),
      });
      router.push('/dashboard');
    } catch (err) {
      alert('Submission failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!questions) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <GlassCard>
        <h1 className="font-mono text-3xl mb-2">Post‑Study Mind & Experience</h1>
        <p className="text-foreground/60 mb-6">
          Final assessment including the Godspeed questionnaire.
        </p>
        <SurveyForm
          questions={questions}
          extraSection={godspeed}
          onSubmit={handleSubmit}
          submitLabel="Submit Final Survey"
          consentRequired={true}
        />
      </GlassCard>
      <div className="flex justify-center mt-6">
        <img src="https://assets.imace.online/image/psysynap.svg" alt="PsyCoSys" className="h-6 opacity-60" />
      </div>
    </div>
  );
}
