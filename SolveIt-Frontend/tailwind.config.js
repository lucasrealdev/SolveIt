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
        textStandard: '#c5d0e2',
        backgroundStandard: '#030507',
        primaryStandard: '#4dc0fe',
        secondaryStandard: '#3a9ed6',
        accentStandard: '#4dfee4',

        textStandardDark: '#1d283a',
        backgroundStandardDark: '#f8fafc',
        primaryStandardDark: '#0174b2',
        secondaryStandardDark: '#298dc7',
        accentStandardDark: '#01b297',

        textSecondary: '#475569',

        backgroundStandardLight: '#fff',
        borderStandard: '#CBD5E1',
        borderStandardLight: '#E2E8F0',
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
