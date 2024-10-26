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
        sans: ['PlusJakartaSans-Regular', 'sans-serif'],
        bold: ['PlusJakartaSans-Bold', 'sans-serif'],
        extrabold: ['PlusJakartaSans-ExtraBold', 'sans-serif'],
        light: ['PlusJakartaSans-Light', 'sans-serif'],
        medium: ['PlusJakartaSans-Medium', 'sans-serif'],
        semibold: ['PlusJakartaSans-SemiBold', 'sans-serif'],
        extralight: ['PlusJakartaSans-ExtraLight', 'sans-serif'],

        // Seção para fontes itálicas
        plusJakartaSansItalic: ['PlusJakartaSans-Italic', 'sans-serif'],
        plusJakartaSansExtraBoldItalic: ['PlusJakartaSans-ExtraBoldItalic', 'sans-serif'],
        plusJakartaSansLightItalic: ['PlusJakartaSans-LightItalic', 'sans-serif'],
        plusJakartaSansMediumItalic: ['PlusJakartaSans-MediumItalic', 'sans-serif'],
        plusJakartaSansSemiBoldItalic: ['PlusJakartaSans-SemiBoldItalic', 'sans-serif'],
        plusJakartaSansBoldItalic: ['PlusJakartaSans-BoldItalic', 'sans-serif'],
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
