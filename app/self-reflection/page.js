'use client';

import { useState, useEffect, useRef } from 'react';

const AUDIO_URLS = [
  'https://assets.imace.online/audio/self1.mp3',
  'https://assets.imace.online/audio/self2.mp3'
];

export default function SelfReflectionPage() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
  const [audioIndex, setAudioIndex] = useState(0);
  const audioRef = useRef(null);

  // Audio shuffle initialization
  useEffect(() => {
    // We delay the setAudioIndex to avoid the synchronous state update warning during mount,
    // though for a simple initial random index, another option is lazy initialization in useState.
    const timer = setTimeout(() => {
      const shuffled = Math.random() > 0.5 ? 1 : 0;
      setAudioIndex(shuffled);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleBegin = () => {
    setSessionStarted(true);

    // Play audio
    const audio = new Audio(AUDIO_URLS[audioIndex]);
    audio.loop = false;
    audio.play().catch(e => console.error("Audio playback failed:", e));

    let currentIndex = audioIndex;
    audio.addEventListener('ended', () => {
      // Play the other audio when one finishes
      currentIndex = (currentIndex + 1) % 2;
      setAudioIndex(currentIndex);
      audio.src = AUDIO_URLS[currentIndex];
      audio.play().catch(e => console.error("Audio playback failed:", e));
    });

    audioRef.current = audio;
  };

  useEffect(() => {
    if (!sessionStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStarted]);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!sessionStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full flex flex-col items-center justify-center space-y-12 animate-fade-in text-center">
          <div className="space-y-4">
            <svg className="w-16 h-16 mx-auto text-foreground opacity-80 animate-breathe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
              <circle cx="12" cy="12" r="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="text-3xl font-mono tracking-widest uppercase">Self-Reflection</h1>
            <p className="text-foreground/70 font-mono text-sm tracking-widest uppercase">Please put on headphones</p>
          </div>

          <button
            onClick={handleBegin}
            className="group relative px-8 py-4 font-mono text-sm tracking-widest uppercase overflow-hidden border border-border rounded-full hover:border-foreground transition-colors duration-500 cursor-pointer"
          >
            <span className="relative z-10">Begin Session</span>
            <div className="absolute inset-0 bg-foreground/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-12 animate-fade-in relative overflow-hidden">
      {/* Background ambient animation elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-slow-drift pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-slow-drift pointer-events-none" style={{ animationDelay: '5s' }}></div>

      {/* Timer Header */}
      <div className="w-full max-w-4xl flex justify-center items-center mb-16 md:mb-24 z-10">
         <div className="font-mono text-4xl md:text-5xl tracking-widest text-foreground opacity-90 animate-pulse-slow">
           {formatTime(timeLeft)}
         </div>
      </div>

      {/* Instructions */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 z-10 pb-24">

        {/* Item 1 */}
        <div className="flex flex-col items-center text-center space-y-6 p-6 rounded-2xl bg-muted/20 backdrop-blur-sm border border-border/50 hover:border-border transition-colors duration-500">
          <svg className="w-12 h-12 text-foreground opacity-70 animate-breathe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" strokeDasharray="4 4" className="animate-spin-slow" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          <p className="font-body text-sm md:text-base leading-relaxed text-foreground/80">
            Find a comfortable sitting position.
          </p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-center text-center space-y-6 p-6 rounded-2xl bg-muted/20 backdrop-blur-sm border border-border/50 hover:border-border transition-colors duration-500">
          <svg className="w-12 h-12 text-foreground opacity-70 animate-breathe" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z" />
          </svg>
          <p className="font-body text-sm md:text-base leading-relaxed text-foreground/80">
            You may keep your eyes closed or open, whichever feels more comfortable.
          </p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-center text-center space-y-6 p-6 rounded-2xl bg-muted/20 backdrop-blur-sm border border-border/50 hover:border-border transition-colors duration-500">
          <svg className="w-12 h-12 text-foreground opacity-70 animate-ripple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <p className="font-body text-sm md:text-base leading-relaxed text-foreground/80">
            Focus your attention on your natural breathing.
          </p>
        </div>

        {/* Item 4 */}
        <div className="flex flex-col items-center text-center space-y-6 p-6 rounded-2xl bg-muted/20 backdrop-blur-sm border border-border/50 hover:border-border transition-colors duration-500">
          <svg className="w-12 h-12 text-foreground opacity-70 animate-wave" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c3-3 6-3 9 0s6 3 9 0" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 17c3-3 6-3 9 0s6 3 9 0" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7c3-3 6-3 9 0s6 3 9 0" />
          </svg>
          <p className="font-body text-sm md:text-base leading-relaxed text-foreground/80">
            Do not try to control or change your breath—just observe it as it is.
          </p>
        </div>

        {/* Item 5 */}
        <div className="flex flex-col items-center text-center space-y-6 p-6 rounded-2xl bg-muted/20 backdrop-blur-sm border border-border/50 hover:border-border transition-colors duration-500">
          <svg className="w-12 h-12 text-foreground opacity-70 animate-breathe" style={{ animationDelay: '2s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7" />
          </svg>
          <p className="font-body text-sm md:text-base leading-relaxed text-foreground/80">
            If your mind wanders, gently bring your attention back to your breathing.
          </p>
        </div>

        {/* Item 6 */}
        <div className="flex flex-col items-center text-center space-y-6 p-6 rounded-2xl bg-muted/20 backdrop-blur-sm border border-border/50 hover:border-border transition-colors duration-500 md:col-span-2 lg:col-span-1">
          <svg className="w-12 h-12 text-foreground opacity-70 animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-body text-sm md:text-base leading-relaxed text-foreground/80">
            There is no task to complete and nothing specific you need to think about. Simply relax and sit quietly until the time is over.
          </p>
        </div>

      </div>

      {timeLeft <= 0 && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md animate-fade-in">
          <p className="font-mono text-xl tracking-widest text-foreground uppercase mb-8">Session Complete</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 font-mono text-sm tracking-widest uppercase border border-border rounded-full hover:border-foreground transition-colors duration-500 cursor-pointer"
          >
            Return
          </button>
        </div>
      )}
    </div>
  );
}
