import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      // Whisper primary palette (Nordic sage green)
      primary: {
        DEFAULT: '#3D4F46',
        50: '#F0F4F2',
        100: '#E0E8E4',
        200: '#C1D1C9',
        300: '#8FA89A',
        400: '#6B8B7A',
        500: '#3D4F46',
        600: '#2D3B34',
        700: '#1E2822',
      },
      // Surface colors
      surface: {
        DEFAULT: '#FFFFFF',
        warm: '#FAFAF9',
        cool: '#F8F9FA',
      },
      // Text hierarchy
      ink: {
        DEFAULT: '#1A1A2E',
        soft: '#4A4A5A',
        muted: '#94A3B8',
        faint: '#C8CCD0',
      },
      // Accent colors
      accent: {
        DEFAULT: '#7B93A8',
        warm: '#C4A882',
        coral: '#C9918A',
        lavender: '#A899C9',
      },
    },
    fontFamily: {
      sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      display: ['Outfit', 'sans-serif'],
    },
    animation: {
      'fade-in': 'fadeIn 0.6s ease-out forwards',
      'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      'float': 'float 6s ease-in-out infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { opacity: '0', transform: 'translateY(20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      slideInLeft: {
        '0%': { opacity: '0', transform: 'translateX(-20px)' },
        '100%': { opacity: '1', transform: 'translateX(0)' },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
    },
  },
  shortcuts: {
    'text-display': 'font-display font-light tracking-wide',
    'text-body': 'font-sans font-normal tracking-normal',
    'btn-ghost': 'px-6 py-2.5 rounded-xl font-light text-sm tracking-wider text-ink transition-all duration-300 hover:bg-black/3',
    'btn-primary': 'px-6 py-2.5 rounded-xl font-light text-sm tracking-wider bg-primary text-white transition-all duration-300 hover:bg-primary-400',
  },
})
