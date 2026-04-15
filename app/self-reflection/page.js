'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';

export default function SelfReflectionPage() {
  const [text, setText] = useState('');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <GlassCard>
        <h1 className="font-mono text-2xl mb-4">Self‑Reflection Manual</h1>
        <p className="text-foreground/60 mb-4">
          Use this space for unstructured reflection during your session.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 bg-muted border border-border rounded-lg p-4 text-foreground resize-none focus:outline-none focus:border-accent"
          placeholder="Begin typing…"
        />
        <button
          onClick={() => alert('Reflection saved locally.')}
          className="mt-4 px-6 py-2 bg-foreground text-background font-mono rounded-lg"
        >
          Save Reflection
        </button>
      </GlassCard>
    </div>
  );
}
