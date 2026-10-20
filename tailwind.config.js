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
          pending: '#F59E0B',
          preparing: '#3B82F6',
          delivery: '#8B5CF6',
          delivered: '#10B981',
          rejected: '#EF4444',
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
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}