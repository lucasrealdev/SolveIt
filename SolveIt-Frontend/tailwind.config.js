/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      screens: {
        'tablet': '1400px',
        'web': '1250px',
        'mobile': '770px',
      },
      fontFamily: {
        sans: ['montserrat', 'sans-serif'],
        'montserrat-bold': ['montserrat-bold', 'sans-serif'],
        'montserrat-black': ['montserrat-black', 'sans-serif'], 
        'montserrat-extraBold': ['montserrat-extraBold', 'sans-serif'], 
        'montserrat-medium': ['montserrat-medium', 'sans-serif'], 
        'montserrat-thin': ['montserrat-thin', 'sans-serif'], 
        'montserrat-semiBold': ['montserrat-semiBold', 'sans-serif'], 
      },
      colors: {
        textoCinza: '#888888',
        destaqueAzul: '#0172B1',
        destaqueAzulEscuro: '#001646',
        destaqueVerde: '#01B198',
        textoCinzaEscuro: '#475569',
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
