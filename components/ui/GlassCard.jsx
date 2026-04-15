'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GlassCard({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("glass-card p-6 md:p-8", className)}
    >
      {children}
    </motion.div>
  );
}
