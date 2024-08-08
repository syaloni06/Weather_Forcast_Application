/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./index.js"],
  theme: {
    extend: {
      boxShadow: {
        'b': '0 0 20px 1px rgba(0,0,0,0.1)',
        '3xl': '0 0 40px 3px rgba(0,0,0,0.1)',
      },
      keyframes: {
        moveLeftRight: {
          '0%': { transform: 'translateX(-20px)' }, // Start from the left
          '50%': { transform: 'translateX(20px)' }, // Move to the right
          '100%': { transform: 'translateX(-20px)' }, // Move back to the left
        },
        moveLR: {
          '0%': { transform: 'translateX(-10px)' }, // Start from the left
          '50%': { transform: 'translateX(10px)' }, // Move to the right
          '100%': { transform: 'translateX(-10px)' }, // Move back to the left
        },
      },
      animation: {
        moveLeftRight: 'moveLeftRight 6s infinite linear',
        moveLR: 'moveLR 6s infinite linear',
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['hover'],
    },
  },
  plugins: [],
}

