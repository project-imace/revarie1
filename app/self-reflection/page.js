'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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

const instructions = [
  { text: "Find a comfortable sitting position.", icon: PostureIcon },
  { text: "Keep your eyes closed or open—whichever feels natural.", icon: EyeIcon },
  { text: "Focus on your natural breathing. Observe, do not control.", icon: BreathingIcon },
  { text: "If your mind wanders, gently return to your breath.", icon: SwirlIcon },
  { text: "Relax. There is no task. Just be.", icon: FloatingDotIcon },
];

export default function SelfReflectionPage() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const audioRef = useRef(null);

  const startReflection = () => {
    const urls = [
      'https://assets.imace.online/audio/self1.mp3',
      'https://assets.imace.online/audio/self2.mp3'
    ];
    const audioUrl = urls[Math.floor(Math.random() * urls.length)];
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;

    // Ignore expected catch from autoplay policies if the user interaction wasn't trusted,
    // though since it's an onclick it should be.
    audioRef.current.play().catch(() => {});
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = ((600 - timeLeft) / 600) * 100;

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] text-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center"
        >
          <p className="font-sans font-light text-xl md:text-2xl mb-12 opacity-70 tracking-wide px-6">
            Please put on your headphones for the best experience.
          </p>
          <button
            onClick={startReflection}
            className="px-8 py-4 rounded-full bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-xl text-black/80 font-sans font-medium tracking-widest uppercase text-sm hover:bg-white/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-500 transform hover:-translate-y-0.5"
          >
            Begin Reflection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] text-black relative font-sans overflow-x-hidden selection:bg-black/10">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-black/5 w-full z-50">
        <motion.div
          className="h-full bg-black/30"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 1 }}
        />
      </div>

      {/* Timer */}
      <div className="fixed top-8 right-8 z-50">
        <div className="px-5 py-2.5 rounded-full bg-white/40 border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl text-xs font-mono tracking-[0.2em] text-black/60">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Core Content */}
      <div className="max-w-2xl mx-auto pt-48 pb-64 px-6 flex flex-col gap-64">
        {instructions.map((item, index) => (
          <InstructionSection key={index} text={item.text} Icon={item.icon} />
        ))}
      </div>
    </div>
  );
}

function InstructionSection({ text, Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, margin: "-20%" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center space-y-10 min-h-[50vh]"
    >
      <div className="text-black/40">
        <Icon />
      </div>
      <h2 className="text-2xl md:text-4xl font-light tracking-wide leading-relaxed text-black/80 max-w-lg mx-auto">
        {text}
      </h2>
    </motion.div>
  );
}
