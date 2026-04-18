'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { setAuthCookie } from '@/lib/auth';
import { vaultFetch } from '@/lib/vault';
import GlassCard from '@/components/ui/GlassCard';

export default function LandingPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const identifier = formData.email || formData.whatsapp;
    if (!identifier) {
      setError('Please provide either email or WhatsApp number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await vaultFetch(`/api/auth/verify?id=${encodeURIComponent(identifier)}`);
      if (user.is_disqualified) {
        setError('Your participation has been discontinued due to inactivity.');
        setLoading(false);
        return;
      }
      await setAuthCookie(user.participant_id);
      router.push(`/dashboard`);
    } catch (err) {
      setError('We could not find you. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <Image src="https://assets.imace.online/image/psysynap.svg" alt="PsyCoSys Synapsys" width={800} height={120} className="mx-auto h-30 w-auto" />
        <p className="font-mono text-sm text-foreground/60 mt-4">Exploring psycho-cognitive frontiers of Brains, Minds and Machines</p>
      </motion.div>

      <GlassCard className="max-w-md mx-auto">
        <h2 className="font-mono text-xl mb-2">PsyCoSys Synapsys</h2>
        <p className="text-foreground/70 text-sm mb-6">The empirical study layer of the Revarie program.</p>
        <p className="text-foreground/80 mb-4 text-sm">Revarie LM v1 is currently only accessible via the PsyCoSys Synapsys program. If you have already registered, login below.</p>
        
        <button onClick={() => setShowLogin(!showLogin)} className="w-full py-3 border border-border rounded-lg font-mono text-sm hover:bg-foreground/5 transition mb-4">
          {showLogin ? 'Hide Login' : '[ Login to Participate ]'}
        </button>

        <AnimatePresence>
          {showLogin && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={handleLogin} className="space-y-4 overflow-hidden">
              <input type="text" placeholder="Name (optional)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:border-accent" />
              <input type="text" placeholder="WhatsApp (without country code)" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:border-accent" />
              <input type="email" placeholder="Email ID" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:border-accent" />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-foreground text-background font-mono py-3 rounded-lg hover:bg-foreground/90 transition disabled:opacity-50">{loading ? 'Verifying...' : 'Continue →'}</button>
            </motion.form>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Full descriptions from PDF */}
      <div className="mt-12 space-y-4">
        <details className="group">
          <summary className="cursor-pointer list-none font-mono text-lg py-2 border-b border-border flex justify-between items-center">
            <span>Overview</span>
            <span className="group-open:rotate-180 transition">▼</span>
          </summary>
          <div className="mt-4 text-foreground/70 space-y-3">
            <p>PsyCoSys Synapsys is the empirical research layer of the Revarie framework, designed to measure the psychological and cognitive effects of sustained interaction between humans and artificial systems. It adopts a longitudinal, psychometric approach to evaluate how artificial agents influence affect, perception, and cognitive behavior over time.</p>
          </div>
        </details>
        <details className="group">
          <summary className="cursor-pointer list-none font-mono text-lg py-2 border-b border-border flex justify-between items-center">
            <span>Study Design</span>
            <span className="group-open:rotate-180 transition">▼</span>
          </summary>
          <div className="mt-4 text-foreground/70 space-y-3">
            <p>The study follows a 14‑day structured protocol consisting of pre‑study and post‑study assessments alongside daily interaction sessions. Participants are assigned to controlled groups involving interaction with different AI configurations or self‑reflection baselines, enabling comparative analysis of AI‑induced effects.</p>
            <p>Psychometric instruments—including VAMS, PANAS, WHO‑5, TIAS, MMP35 and Godspeed Questionnaires—are used to quantify mood, affect, perceived agency, and relational dynamics across repeated sessions.</p>
          </div>
        </details>
        <details className="group">
          <summary className="cursor-pointer list-none font-mono text-lg py-2 border-b border-border flex justify-between items-center">
            <span>Scientific Role</span>
            <span className="group-open:rotate-180 transition">▼</span>
          </summary>
          <div className="mt-4 text-foreground/70 space-y-3">
            <p>PsyCoSys shifts AI evaluation from performance metrics to <strong>interaction‑based psychological measurement</strong>. It captures how artificial systems influence:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>emotional states</li>
              <li>cognitive interpretation</li>
              <li>trust and agency attribution</li>
              <li>dependency formation</li>
            </ul>
            <p>This provides empirical grounding for understanding AI as a participant in human cognitive systems.</p>
          </div>
        </details>
        <details className="group">
          <summary className="cursor-pointer list-none font-mono text-lg py-2 border-b border-border flex justify-between items-center">
            <span>Theoretical Contribution</span>
            <span className="group-open:rotate-180 transition">▼</span>
          </summary>
          <div className="mt-4 text-foreground/70 space-y-3">
            <p>The study contributes to the development of <strong>computational psychology</strong>, where cognitive and affective processes are analyzed as measurable system dynamics. It also supports early steps toward an <strong>axiomatisation of psychology</strong>, by identifying patterns that may generalize across human and artificial cognitive interactions.</p>
          </div>
        </details>
        <details className="group">
          <summary className="cursor-pointer list-none font-mono text-lg py-2 border-b border-border flex justify-between items-center">
            <span>Relevance</span>
            <span className="group-open:rotate-180 transition">▼</span>
          </summary>
          <div className="mt-4 text-foreground/70 space-y-3">
            <p>PsyCoSys operationalizes the concept of the Artificial Other by empirically examining how humans integrate artificial systems into their cognitive frameworks. It directly addresses key challenges in AI safety, including interpretability, alignment, and anthropomorphic misattribution.</p>
          </div>
        </details>
        <details className="group">
          <summary className="cursor-pointer list-none font-mono text-lg py-2 border-b border-border flex justify-between items-center">
            <span>Objective</span>
            <span className="group-open:rotate-180 transition">▼</span>
          </summary>
          <div className="mt-4 text-foreground/70 space-y-3">
            <p>The study aims to generate measurable, generalizable insights into the nature of cognition as an interactional phenomenon, supporting Project IMACE's broader goal of understanding cognition as a structured and universal system rather than a purely human attribute.</p>
          </div>
        </details>
      </div>
    </div>
  );
}
