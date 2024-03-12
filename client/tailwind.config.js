/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        sm: '526px',
        md: '768px',
      },
    },
  },
  plugins: [],
}