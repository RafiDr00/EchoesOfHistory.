/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", 'Georgia', 'serif'],
        mono:  ["'Space Mono'", "'Courier New'", 'monospace'],
      },
      colors: {
        void:  '#000000',
        deep:  '#05040a',
        surface: '#0c0b14',
        gold:  '#ffd080',
        'gold-dim': '#c8903a',
        ink:   '#f5e8c8',
      },
    },
  },
  plugins: [],
}
