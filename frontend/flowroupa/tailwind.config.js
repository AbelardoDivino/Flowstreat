/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: '#F7F6F2',
        tinta: '#15192A',
        fluxo: '#2A3EF5',
        selo: '#E8A716',
        linha: '#C9C6BC',
        poeira: '#5B6270',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        body: ['Archivo', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '3px',
        tag: '2px',
      },
    },
  },
  plugins: [],
};
