module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        breathe: `breathe ${3}s ease-in-out infinite`,
        float: `float ${3}s ease-in-out infinite`,
        twist: `twist ${3}s ease-in-out infinite`,
        'twist-fast': `twist ${1.5}s ease-in-out infinite`,
        'spin-twist': `spin-twist ${3}s ease-in-out infinite`,
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: `scale(${1})` },
          '50%': { transform: `scale(${1.05})` },
        },
        float: {
          '0%, 100%': { transform: `translateY(${0}%)` },
          '50%': { transform: `translateY(${-10}%)` },
        },
        twist: {
          '0%, 100%': { transform: `scaleX(${1})` },
          '50%': { transform: `scaleX(${-1})` },
        },
        'spin-twist': {
          '0%, 100%': { transform: `rotate(0deg) scaleX(${1})` },
          '50%': { transform: `rotate(360deg) scaleX(${-1})` },
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
