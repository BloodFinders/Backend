/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1240px',
      },
    },
    extend: {
      colors: {
        blood: {
          light: '#ff4d6d',
          DEFAULT: '#ef233c',
          dark: '#d90429',
          glow: 'rgba(239, 35, 60, 0.15)',
          glowStrong: 'rgba(239, 35, 60, 0.4)',
        },
        navy: {
          light: '#1a1d29',
          DEFAULT: '#12141c',
          dark: '#0b0c10',
          darker: '#07080b',
        },
        gold: {
          DEFAULT: '#ffb703',
          light: 'rgba(255, 183, 3, 0.15)',
        }
      },
      fontFamily: {
        title: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        }
      }
    },
  },
  plugins: [],
}
