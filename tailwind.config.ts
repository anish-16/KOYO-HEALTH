import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#06191F',
        'ink-soft': '#0D2A31',
        forest: '#0C3B34',
        teal: { DEFAULT: '#0F7A6C', deep: '#0A5A50', soft: '#DCEFE9', mist: '#EFF7F4' },
        gold: { DEFAULT: '#BF9B4F', soft: '#F2E8D3', deep: '#8E6F28' },
        paper: '#FBFAF7',
        sand: '#F2EEE4',
        line: '#E2E6E1',
        muted: '#5D6D6F',
        clay: '#AC4F2A',
        mauve: '#6E5A7E',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(6,25,31,0.04), 0 8px 24px -12px rgba(6,25,31,0.14)',
        lift: '0 2px 4px rgba(6,25,31,0.05), 0 24px 48px -24px rgba(6,25,31,0.28)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      maxWidth: { shell: '1280px' },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '80%,100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 42s linear infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 1.8s infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22,1,0.36,1) infinite',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(6,25,31,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,25,31,0.045) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
