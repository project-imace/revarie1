'use client';

import { motion } from 'framer-motion';

export function LikertQuestion({ options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt, i) => (
        <motion.button
          type="button"
          key={i}
          onClick={() => onChange(i)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          animate={{
            boxShadow: value === i ? '0 0 15px rgba(255,255,255,0.4)' : 'none'
          }}
          className={`w-full text-left px-6 py-4 rounded-xl border transition-colors duration-300 ${value === i ? 'bg-foreground border-foreground text-background font-medium' : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'}`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  );
}

export function Likert7Question({ value, onChange, minLabel, maxLabel }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
      <div className="flex justify-between w-full">
        {[0, 1, 2, 3, 4, 5, 6].map(num => (
          <motion.button
            type="button"
            key={num}
            onClick={() => onChange(num)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: value === num ? '0 0 15px rgba(255,255,255,0.4)' : 'none'
            }}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full border text-lg font-mono transition-colors duration-300 ${value === num ? 'bg-foreground border-foreground text-background font-bold' : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'}`}
          >
            {num + 1}
          </motion.button>
        ))}
      </div>
      <div className="flex justify-between text-xs font-mono text-foreground/60 mt-2 px-1">
        <span>{minLabel || "Strongly Disagree"}</span>
        <span>{maxLabel || "Strongly Agree"}</span>
      </div>
    </div>
  );
}

export function Likert5Question({ text, value, onChange }) {
  const leftLabel = text.split('—')[0]?.trim() || text.split('-')[0]?.trim();
  const rightLabel = text.split('—')[1]?.trim() || text.split('-')[1]?.trim();

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto py-2">
      <div className="flex justify-between text-sm md:text-base font-body text-foreground px-2">
        <span className="text-left w-1/3">{leftLabel}</span>
        <span className="text-right w-1/3">{rightLabel}</span>
      </div>
      <div className="flex justify-between w-full px-4">
        {[1, 2, 3, 4, 5].map(num => (
          <motion.button
            type="button"
            key={num}
            onClick={() => onChange(num)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: value === num ? '0 0 15px rgba(255,255,255,0.4)' : 'none'
            }}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border text-base font-mono transition-colors duration-300 ${value === num ? 'bg-foreground border-foreground text-background font-bold' : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'}`}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
