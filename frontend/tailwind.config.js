/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        secondary: '#4F46E5',
        accent: '#14B8A6',
        background: '#F8FAFC',
        text: '#334155',
        border: '#E2E8F0',
        traffic: {
          green: '#22C55E',
          yellow: '#EAB308',
          orange: '#F97316',
          red: '#EF4444',
          purple: '#A855F7',
          black: '#0F172A',
          blue: '#3B82F6',
        }
      },
    },
  },
  plugins: [],
}
