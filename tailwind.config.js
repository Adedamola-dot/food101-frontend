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
          red: '#FF4747',
          dark: '#1A1A1A',
          gold: '#FFB800',
          cream: '#FDFBF7',
        },
        text: {
          dark: '#1A1A1A',
          muted: '#6B7280',
        },
        status: {
          pending: '#F59E0B', // Amber
          preparing: '#3B82F6', // Blue
          delivery: '#8B5CF6', // Purple
          delivered: '#10B981', // Emerald
          rejected: '#EF4444', // Red
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}