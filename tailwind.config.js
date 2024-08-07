/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      boxShadow: {
        'b': '0 0 20px 1px rgba(0,0,0,0.1)',
        '3xl': '0 0 40px 3px rgba(0,0,0,0.1)',
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

