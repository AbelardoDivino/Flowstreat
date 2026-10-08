/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: '#F5F3EC',
        tinta: '#16130D',
        fluxo: '#2A3EF5',
        selo: '#E8A716',
        linha: '#D8D3C4',
        poeira: '#5C5A54',
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
