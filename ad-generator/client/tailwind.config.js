/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#4f46e5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}
