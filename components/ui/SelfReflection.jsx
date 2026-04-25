'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PostureIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12">
    <circle cx="12" cy="6" r="2.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 14l4-4 4 4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 19c1.5-1.5 3-1.5 5-1.5s3.5 0 5 1.5" />
  </svg>
);

const EyeIcon = () => (
  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12"
    animate={{ scaleY: [1, 0.1, 1] }}
    transition={{ duration: 5, repeat: Infinity, times: [0, 0.1, 0.2], ease: "easeInOut", repeatDelay: 4 }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </motion.svg>
);

const BreathingIcon = () => (
  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12">
    <motion.circle cx="12" cy="12" r="8"
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.circle cx="12" cy="12" r="4"
      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);

const SwirlIcon = () => (
  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12"
    animate={{ rotate: [0, 360] }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" strokeDasharray="4 4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a6 6 0 106 6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12l-2-2m2 2l-2 2" />
  </motion.svg>
);

const FloatingDotIcon = () => (
  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12"
    animate={{ y: [-4, 4, -4], opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  >
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </motion.svg>
);

const INSTRUCTIONS = [
  { text: "Find a comfortable sitting position.", Icon: PostureIcon },
  { text: "You may keep your eyes closed or open, whichever feels more comfortable.", Icon: EyeIcon },
  { text: "Focus your attention on your natural breathing.", Icon: BreathingIcon },
  { text: "Do not try to control or change your breath—just observe it as it is.", Icon: BreathingIcon },
  { text: "If your mind wanders, gently bring your attention back to your breathing.", Icon: SwirlIcon },
  { text: "There is no task to complete and nothing specific you need to think about. Simply relax and sit quietly until the time is over.", Icon: FloatingDotIcon }
];

const AUDIO_TRACKS = [
  "https://assets.imace.online/audio/self1.mp3",
  "https://assets.imace.online/audio/self2.mp3"
];

export default function SelfReflection() {
  const [started, setStarted] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (started) {
      const timer = setInterval(() => {
        setCurrentInstruction(prev => (prev < INSTRUCTIONS.length - 1 ? prev + 1 : prev));
      }, 7000); // Progress every 7 seconds
      return () => clearInterval(timer);
    }
  }, [started]);

  const handleStart = () => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleAudioEnded = () => {
    if (audioRef.current) {
      // Simple toggle to shuffle between the two tracks
      const currentSrc = audioRef.current.src;
      const nextSrc = currentSrc.includes('self1') ? AUDIO_TRACKS[1] : AUDIO_TRACKS[0];
      audioRef.current.src = nextSrc;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <audio
        ref={audioRef}
        src={AUDIO_TRACKS[0]}
        onEnded={handleAudioEnded}
      />

      {!started ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <svg className="w-16 h-16 mb-8 text-foreground/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h2 className="text-2xl font-body mb-4">Self-Reflection Manual</h2>
          <p className="text-foreground/70 mb-10 text-sm font-mono">
            Please put on your headphones for the best experience. The session will guide you through a relaxing reflection period.
          </p>
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
            className="px-10 py-4 rounded-full border border-border bg-foreground text-background font-mono text-sm uppercase tracking-widest hover:bg-foreground/90 transition-all duration-500"
          >
            Tap to Begin
          </motion.button>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl h-full relative">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)"
            }}
            className="absolute w-[60vh] h-[60vh] rounded-full border border-foreground/20 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.2, 0.05]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute w-[40vh] h-[40vh] rounded-full bg-foreground/5 blur-3xl pointer-events-none"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentInstruction}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="text-center z-10 px-4"
            >
              <div className="flex flex-col items-center gap-8">
                <div className="text-foreground/40">
                  {(() => {
                    const IconComponent = INSTRUCTIONS[currentInstruction].Icon;
                    return IconComponent ? <IconComponent /> : null;
                  })()}
                </div>
                <p className="text-xl md:text-2xl font-body leading-relaxed max-w-lg mx-auto text-foreground/90">
                  {INSTRUCTIONS[currentInstruction].text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
