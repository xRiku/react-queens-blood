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
      },
      animation: {
        slideIn: 'slideIn 1s ease forwards',
      },
    },
    dropShadow: {
      glow: [
        '0 0px 20px rgba(250, 204, 21, 0.35)',
        '0 0px 65px rgba(250, 204, 21, 0.2)',
      ],
    },
    boxShadow: {
      'join-room-button': '0 5px 0 rgb(17 24 39)',
    }
  },
  plugins: [],
}
