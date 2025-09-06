/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./**/*.{html,js}', '!./node_modules/**/*'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#16243F',
          hover: '#223559',
        },
        secondary: {
          DEFAULT: '#FFFAF4',
          hover: '#FFF1E0',
        },
        tertiary: '#FFCF98',
        error: '#B65657',
        success: '#457F4E',
      },
    },
  },
  plugins: [],
};
