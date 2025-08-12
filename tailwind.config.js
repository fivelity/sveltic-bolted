/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'tomorrow': ['Tomorrow', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      colors: {
        'glass': {
          'bg': 'rgba(255, 255, 255, 0.1)',
          'border': 'rgba(255, 255, 255, 0.2)',
          'hover': 'rgba(255, 255, 255, 0.15)'
        }
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}