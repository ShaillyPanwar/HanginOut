/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Reference design primary: Electric Royal Cobalt Blue
        cobalt: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#4f46e5',
          600: '#2b59ff', // Primary electric blue from reference
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        // Legacy brand token alias redirected to reference electric blue
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#2b59ff', // Primary Electric Blue
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Deep Obsidian & Midnight surfaces from reference
        obsidian: {
          950: '#08090e', // Deepest background
          900: '#0b0c12', // Primary app background
          850: '#0f111a',
          800: '#131625', // Surface card
          750: '#171a2e',
          700: '#1c2038', // Elevated card / border
        },
        surface: {
          dark: '#0b0c12',
          card: '#131625',
          elevated: '#171a2e',
          border: 'rgba(59, 130, 246, 0.18)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(43, 89, 255, 0.4)',
        'glow-blue-lg': '0 0 50px -10px rgba(43, 89, 255, 0.35)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-glow': 'radial-gradient(circle at 50% 0%, rgba(43, 89, 255, 0.25) 0%, rgba(11, 12, 18, 0) 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(28, 32, 56, 0.6) 0%, rgba(19, 22, 37, 0.8) 100%)',
      }
    },
  },
  plugins: [],
}
