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
          '50%': { transform: `scale(${1.05})` },
        },
      },
      transitionDuration: {
        0: '0ms',
        1250: '1250ms',
        1500: '1500ms',
        2000: '2000ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
