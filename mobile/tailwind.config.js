/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#033860',
        secondary: '#b2d2d1',
        success: '#4CAF50',
        error: '#F44336',
      },
    },
  },
  plugins: [],
}

