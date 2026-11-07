/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#0A1628',
        primary: '#2563EB',
        compliant: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        highrisk: '#F97316',
        critical: '#9F1239',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
