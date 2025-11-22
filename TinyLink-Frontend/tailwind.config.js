/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        purple: {
          glow: '#a855f7',
          dark: '#6b21a8',
        },
        pink: {
          glow: '#ec4899',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-pink-purple': 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
        'gradient-radial': 'radial-gradient(circle at center, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.2), transparent)',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'glow-lg': '0 0 40px rgba(168, 85, 247, 0.4)',
      },
    },
  },
  plugins: [],
}

