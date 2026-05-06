'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimerOverlay({ mandatorySeconds, maxExtraSeconds, onComplete, initialSeconds = 0, children }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSeconds);
  const [isMaximized, setIsMaximized] = useState(true);
  const intervalRef = useRef(null);
  const hasCalledOnComplete = useRef(false);

  const totalMax = mandatorySeconds + maxExtraSeconds;

  useEffect(() => {
    if (elapsedSeconds >= totalMax && !hasCalledOnComplete.current) {
      hasCalledOnComplete.current = true;
      onComplete(maxExtraSeconds, false, 'timer_expired');
      return;
    }

    if (elapsedSeconds < totalMax) {
      let hideTimeout = null;

      const showTimerInterval = setInterval(() => {
        setIsMaximized(true);
        hideTimeout = setTimeout(() => setIsMaximized(false), 5000);
      }, 30000); // show for 5 seconds every 30 seconds

      intervalRef.current = setInterval(() => {
        if (document.hidden) return;
        
        setElapsedSeconds(prev => {
          const next = prev + 1;
          if (next >= totalMax && !hasCalledOnComplete.current) {
            clearInterval(intervalRef.current);
            hasCalledOnComplete.current = true;
            onComplete(maxExtraSeconds, false, 'timer_expired');
          }
          return next;
        });
      }, 1000);

      // Initial timeout to hide the timer after first 5 seconds
      const initialHide = setTimeout(() => setIsMaximized(false), 5000);

      return () => {
        clearInterval(intervalRef.current);
        clearInterval(showTimerInterval);
        clearTimeout(initialHide);
        if (hideTimeout) clearTimeout(hideTimeout);
      };
    }
  }, [totalMax, onComplete, maxExtraSeconds, elapsedSeconds]);

  const handleEnd = (reason = null) => {
    clearInterval(intervalRef.current);
    const extraTime = Math.max(0, elapsedSeconds - mandatorySeconds);
    hasCalledOnComplete.current = true;
    onComplete(extraTime, false, reason || 'user_ended');
  };

  const remaining = totalMax - elapsedSeconds;
  const mins = Math.floor(Math.max(0, remaining) / 60).toString().padStart(2, '0');
  const secs = (Math.max(0, remaining) % 60).toString().padStart(2, '0');

  return (
    <div className="relative w-full h-full">
      {children}
      <div className="absolute top-4 right-4 z-40 pointer-events-none flex flex-col items-end gap-2">
        <div className="pointer-events-auto group">
          <AnimatePresence>
            <motion.div
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-black/70 backdrop-blur-sm text-foreground text-sm px-4 py-1.5 rounded-full border border-border flex items-center gap-3 overflow-hidden"
            >
              <motion.div layout className="flex items-center gap-2 whitespace-nowrap">
                <AnimatePresence>
                  {isMaximized && (
                    <motion.span
                      layout
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                    >
                      Time remaining:
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.span layout className="font-mono">{mins}:{secs}</motion.span>
              </motion.div>
              <motion.button layout onClick={() => handleEnd('user_ended')} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition whitespace-nowrap">End Session</motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
