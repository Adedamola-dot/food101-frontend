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
          red: '#D32F2F', // Updated to match the new logo red
          dark: '#1A1A1A',
          gold: '#FFB800', // The yellow from the "101" and steam
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
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-delayed-2': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 7s ease-in-out infinite',
        'float-delayed-2': 'float-delayed-2 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}