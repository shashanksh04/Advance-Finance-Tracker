/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#3b82f6',
        success: '#22c55e',
        danger: '#ef4444',
        sidebar: '#0f172a',
      }
    },
  },
  plugins: [],
}
