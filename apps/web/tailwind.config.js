/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '50%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        hourglass: {
          '0%, 45%': { transform: 'rotate(0deg)' },
          '50%, 95%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        sandTop: {
          '0%': { opacity: '1' },
          '45%': { opacity: '0' },
          '50%': { opacity: '1' },
          '95%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        sandBottom: {
          '0%': { opacity: '0' },
          '45%': { opacity: '1' },
          '50%': { opacity: '0' },
          '95%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        slideIn: 'slideIn 1s ease forwards',
        hourglass: 'hourglass 2s ease-in-out infinite',
        'sand-top': 'sandTop 2s ease-in-out infinite',
        'sand-bottom': 'sandBottom 2s ease-in-out infinite',
      },
    },
    fontFamily: {
      title: ['Canterbury Regular'],
    },
    dropShadow: {
      glow: [
        '0 0px 20px rgba(250, 204, 21, 0.35)',
        '0 0px 65px rgba(250, 204, 21, 0.2)',
      ],
    },
    boxShadow: {
      'join-room-button': '0 5px 0 rgb(17 24 39)',
    },
  },
  plugins: [],
}
