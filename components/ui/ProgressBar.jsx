'use client';

import { motion } from 'framer-motion';

export default function ProgressBar({ value, max = 14 }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-mono text-foreground/60 mb-1">
        <span>Daily Sessions Completed</span>
        <span>{value} / {max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-accent rounded-full shadow-[0_0_10px_#4ade80]"
        />
      </div>
    </div>
  );
}
