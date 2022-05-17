module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'scribble': 'scribble 0.45s linear infinite',
      },
      keyframes: {
        scribble: {
          '0%, 100%': {
            transform: 'rotate(-5deg)',
            transformOrigin: 'bottom left'
          },
          '50%': {
            transform: 'rotate(5deg)',
            transformOrigin: 'bottom left'
          }
        },
      }
    },
  },
  plugins: [
    require('tailwindcss-opentype')
  ],
}
