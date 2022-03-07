module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        breathe: `breathe ${3}s ease-in-out infinite`,
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: `scale(${1})` },
          '50%': { transform: `scale(${1.03})` },
        },
      },
    },
  },
  plugins: [],
}
