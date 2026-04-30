'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimerOverlay({ mandatorySeconds, maxExtraSeconds, onComplete, initialSeconds = 0, children }) {
  const [phase, setPhase] = useState(() => {
    if (initialSeconds >= mandatorySeconds + maxExtraSeconds) return 'completed';
    if (initialSeconds >= mandatorySeconds) return 'prompt';
    return 'mandatory';
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSeconds);
  const [isMaximized, setIsMaximized] = useState(true);
  const intervalRef = useRef(null);
  const hasCalledOnComplete = useRef(false);

  const totalMandatory = mandatorySeconds;
  const totalMax = mandatorySeconds + maxExtraSeconds;

  useEffect(() => {
    if (phase === 'completed' && !hasCalledOnComplete.current) {
      hasCalledOnComplete.current = true;
      onComplete(maxExtraSeconds, false, 'timer_expired');
      return;
    }

    if (phase === 'mandatory' || phase === 'extra') {
      let hideTimeout = null;

      const showTimerInterval = setInterval(() => {
        setIsMaximized(true);
        hideTimeout = setTimeout(() => setIsMaximized(false), 5000);
      }, 30000); // show for 5 seconds every 30 seconds

      intervalRef.current = setInterval(() => {
        if (document.hidden) return;
        
        setElapsedSeconds(prev => {
          const next = prev + 1;
          if (phase === 'mandatory' && next >= totalMandatory) {
            setPhase('prompt');
            clearInterval(intervalRef.current);
          }
          if (phase === 'extra' && next >= totalMax) {
            setPhase('completed');
            clearInterval(intervalRef.current);
            hasCalledOnComplete.current = true;
            onComplete(maxExtraSeconds, false, null);
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
  }, [phase, totalMandatory, totalMax, onComplete, maxExtraSeconds]);

  const handleContinue = () => {
    setPhase('extra');
    setIsMaximized(true); // Show timer briefly when entering extra phase
  };
  const handleEnd = (reason = null) => {
    clearInterval(intervalRef.current);
    const extraTime = Math.max(0, elapsedSeconds - totalMandatory);
    hasCalledOnComplete.current = true;
    onComplete(extraTime, false, reason || 'user_ended');
  };

  const remainingExtra = totalMax - elapsedSeconds;
  const mins = Math.floor(remainingExtra / 60).toString().padStart(2, '0');
  const secs = (remainingExtra % 60).toString().padStart(2, '0');

  const remainingMandatory = totalMandatory - elapsedSeconds;
  const manMins = Math.floor(Math.max(0, remainingMandatory) / 60).toString().padStart(2, '0');
  const manSecs = (Math.max(0, remainingMandatory) % 60).toString().padStart(2, '0');

  return (
    <div className="relative w-full h-full">
      {children}
      <div className="absolute top-4 right-4 z-40 pointer-events-none flex flex-col items-end gap-2">
        <div className="pointer-events-auto group">
          <AnimatePresence>
            {phase === 'mandatory' && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-black/70 backdrop-blur-sm text-foreground/80 text-xs px-4 py-1.5 rounded-full border border-border flex items-center gap-3 overflow-hidden"
              >
                <motion.span layout className="font-mono whitespace-nowrap">
                  {manMins}:{manSecs}
                </motion.span>
                <AnimatePresence>
                  {isMaximized && (
                    <motion.span
                      layout
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap"
                    >
                      Session in progress. Cannot terminate until 10 minutes.
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {phase === 'prompt' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-black/90 backdrop-blur-md border border-border rounded-2xl px-6 py-4 shadow-2xl">
              <p className="text-foreground font-body text-sm mb-4">Minimum time reached.</p>
              <div className="flex gap-3">
                <button onClick={() => handleEnd('user_ended_early')} className="px-4 py-2 bg-muted text-foreground text-sm rounded-lg hover:bg-muted/80 transition">End Session</button>
                <button onClick={handleContinue} className="px-4 py-2 bg-accent text-background text-sm rounded-lg hover:bg-accent/80 transition">Continue (up to 10 min)</button>
              </div>
            </motion.div>
          )}
          <AnimatePresence>
            {phase === 'extra' && (
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
                        Extra time:
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <motion.span layout className="font-mono">{mins}:{secs}</motion.span>
                </motion.div>
                <motion.button layout onClick={() => handleEnd('user_ended_extra')} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition whitespace-nowrap">End Now</motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
