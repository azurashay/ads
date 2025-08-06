/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          0: '#FFFFFF',
          1: '#F4F7FB',
          2: '#D9E2EC',
          5: '#334E68',
          6: '#102A43',
        },
        primary: '#00A0FF',
      },
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 