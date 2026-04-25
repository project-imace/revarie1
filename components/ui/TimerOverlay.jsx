'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimerOverlay({ mandatorySeconds, maxExtraSeconds, onComplete, children }) {
  const [phase, setPhase] = useState('mandatory');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTimer, setShowTimer] = useState(true);
  const intervalRef = useRef(null);

  const totalMandatory = mandatorySeconds;
  const totalMax = mandatorySeconds + maxExtraSeconds;

  useEffect(() => {
    if (phase === 'mandatory' || phase === 'extra') {
      let hideTimeout = null;

      const showTimerInterval = setInterval(() => {
        setShowTimer(true);
        hideTimeout = setTimeout(() => setShowTimer(false), 5000);
      }, 30000); // show for 5 seconds every 30 seconds

      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;
          if (phase === 'mandatory' && next >= totalMandatory) {
            setPhase('prompt');
            clearInterval(intervalRef.current);
          }
          if (phase === 'extra' && next >= totalMax) {
            setPhase('completed');
            clearInterval(intervalRef.current);
            onComplete(maxExtraSeconds, false, null);
          }
          return next;
        });
      }, 1000);

      // Initial timeout to hide the timer after first 5 seconds
      const initialHide = setTimeout(() => setShowTimer(false), 5000);

      return () => {
        clearInterval(intervalRef.current);
        clearInterval(showTimerInterval);
        clearTimeout(initialHide);
        if (hideTimeout) clearTimeout(hideTimeout);
      };
    }
  }, [phase, totalMandatory, totalMax, onComplete]);

  const handleContinue = () => {
    setPhase('extra');
    setShowTimer(true); // Show timer briefly when entering extra phase
  };
  const handleEnd = (reason = null) => {
    clearInterval(intervalRef.current);
    const extraTime = Math.max(0, elapsedSeconds - totalMandatory);
    onComplete(extraTime, true, reason || 'user_ended');
  };

  const remainingExtra = totalMax - elapsedSeconds;
  const mins = Math.floor(remainingExtra / 60).toString().padStart(2, '0');
  const secs = (remainingExtra % 60).toString().padStart(2, '0');

  return (
    <div className="relative w-full h-full">
      {children}
      <div className="absolute top-4 right-4 z-40 pointer-events-none flex flex-col items-end gap-2">
        <div className="pointer-events-auto group">
          <AnimatePresence>
            {phase === 'mandatory' && showTimer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-black/70 backdrop-blur-sm text-foreground/80 text-xs px-4 py-1.5 rounded-full border border-border"
              >
                Session in progress. Cannot terminate until 10 minutes.
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
            {phase === 'extra' && showTimer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-black/70 backdrop-blur-sm text-foreground text-sm px-4 py-1.5 rounded-full border border-border flex items-center gap-3"
              >
                <span>Extra time: {mins}:{secs}</span>
                <button onClick={() => handleEnd('user_ended_extra')} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition">End Now</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
