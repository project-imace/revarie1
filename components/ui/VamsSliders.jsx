'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function VamsSliders({ questions, onSubmit, submitLabel = 'Continue', isLoading = false }) {
  const [values, setValues] = useState(() => {
    const initial = {};
    questions.forEach(q => { initial[q.id] = 50; });
    return initial;
  });

  const handleChange = (id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {questions.map((q) => (
        <div key={q.id} className="space-y-1 md:space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-mono text-sm text-foreground/80">{q.label}</label>
            <span className="font-mono text-xs text-foreground/50">{values[q.id]}</span>
          </div>
          <input
            type="range"
            min={q.min || 0}
            max={q.max || 100}
            value={values[q.id]}
            onChange={(e) => handleChange(q.id, parseInt(e.target.value))}
            className="w-full h-4 touch-none bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-[10px] font-mono text-foreground/40">
            <span>Not at all</span>
            <span>Extremely</span>
          </div>
        </div>
      ))}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={isLoading ? {} : { scale: 1.01 }}
        whileTap={isLoading ? {} : { scale: 0.99 }}
        className={`w-full py-3 mt-4 bg-foreground text-background font-mono rounded-lg hover:bg-foreground/90 transition ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Processing...' : submitLabel}
      </motion.button>
    </form>
  );
}
