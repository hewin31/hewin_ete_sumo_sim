/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'none': '0',
        'sm': '1px',
        DEFAULT: '2px',
        'md': '4px',
        'lg': '4px',
        'xl': '4px',
        '2xl': '4px',
        '3xl': '4px',
        'full': '9999px',
      },
      colors: {
        'primary': '#1B365D', // Navy Blue
        'primary-light': '#2A4B7C',
        'primary-dark': '#0D1B2E',
        'secondary': '#64748B', // Slate
        'secondary-light': '#94A3B8',
        'secondary-dark': '#475569',
        'accent': '#0284C7', // Sky Blue
        'accent-light': '#38BDF8',
        'accent-dark': '#0369A1',
        'traffic-green': '#166534',
        'traffic-yellow': '#854D0E',
        'traffic-orange': '#9A3412',
        'traffic-red': '#991B1B',
        'traffic-purple': '#6B21A8',
        'traffic-black': '#1E293B',
        'traffic-blue': '#1E40AF',
        background: '#F8FAFC',
        text: '#0F172A',
        border: '#E2E8F0',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'none': 'none',
      }
    },
  },
  plugins: [],
}
