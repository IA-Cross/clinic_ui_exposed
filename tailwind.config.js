/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Paleta de marca Verboonen (Guía de color)
        "primary": "#60468E",
        "secondary": "#75B8C0",
        "accent": "#477D89",
        "background-light": "#F0EFF0",
        "background-dark": "#1d1530",
      },
      fontFamily: {
        "display": ["Montserrat", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
