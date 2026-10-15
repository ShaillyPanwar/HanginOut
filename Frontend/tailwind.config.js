/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316', // Vibrant Orange / Hangout Coral
          600: '#ea580c',
          700: '#c2410c',
        },
        surface: {
          dark: '#0f172a', // Slate 900
          card: '#1e293b', // Slate 800
          border: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
