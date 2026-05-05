'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { vaultFetch } from '@/lib/vault';
import GlassCard from '@/components/ui/GlassCard';
import SurveyForm from '@/components/ui/SurveyForm';
import LoadingScreen from '@/components/ui/LoadingScreen';

import mindExperiencePre from '@/public/study-materials/mind-experience-pre.json';

export default function PreSurveyPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const u = await getCurrentUser();
      if (!u) {
        router.push('/');
        return;
      }
      if (u.has_onboarded) {
        router.push(`/dashboard`);
        return;
      }
      setUser(u);
      setQuestions(mindExperiencePre);
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
          day: 1,
          payload: payload.main,
        }),
      });
      router.push(`/dashboard`);
    } catch (err) {
      alert('Submission failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen isVisible={true} />;
  }

  if (!questions) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <GlassCard>
        <h1 className="font-mono text-3xl mb-2">Pre‑Study Mind & Experience</h1>
        <p className="text-foreground/60 mb-6">
          This baseline questionnaire helps us understand your initial perceptions and emotional state.
        </p>
        <SurveyForm
          questions={questions}
          onSubmit={handleSubmit}
          submitLabel="Submit Baseline Survey"
          consentRequired={true}
        />
      </GlassCard>
      <div className="flex justify-center mt-6">
        <img src="https://assets.imace.online/image/psysynap.svg" alt="PsyCoSys" className="h-20 opacity-60" />
      </div>
    </div>
  );
}
