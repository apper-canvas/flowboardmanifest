/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F2FF',
          100: '#E6E9FF',
          500: '#5B6CFF',
          600: '#4C5EE6',
          700: '#3D4FCC'
        },
        secondary: {
          50: '#F2F3FF',
          500: '#8B92FF',
          600: '#7C83E6'
        },
        accent: {
          50: '#FFF0F5',
          500: '#FF6B9D',
          600: '#E6608A'
        },
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
        surface: '#FFFFFF',
        background: '#F5F7FA',
        border: '#E5E7EB'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-elevated': '0 4px 16px rgba(0, 0, 0, 0.15)',
        drag: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }
    },
  },
  plugins: [],
}