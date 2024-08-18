/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   'sans': ['', 'sans-serif'], 
      // },
      colors: {
        primary: {
          light: '#F585B3', 
          DEFAULT: '#F65F9E', 
          dark: '#C44C7E', 
        },
      },
      boxShadow: {
        'left': '4px 0 18px rgba(0, 0, 0, 0.2)',
        'down': '0 4px 18px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

