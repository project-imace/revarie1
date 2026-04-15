/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        body: ['"Inclusive Sans"', 'sans-serif'],
      },
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        muted: '#0a0a0a',
        border: 'rgba(255, 255, 255, 0.1)',
        accent: '#4ade80',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #4ade80' },
          '50%': { boxShadow: '0 0 20px #4ade80' },
        },
      },
    },
  },
  plugins: [],
};
