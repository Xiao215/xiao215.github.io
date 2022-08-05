/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {},
    extend: {
      fontFamily: {
        raleway: ["Montserrat", "sans-serif"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        themeOne: {
          300: "#ffe8d6",
          600: "#ddbea9",
          900: "#cb997e",
        },
        themeTwo: {
          300: "#48cae4",
          600: "#0096c7",
          900: "#023e8a",
        },
      },
    },
  },
  plugins: [],
  important: "#root",
  corePlugins: {
    preflight: false,
  },
};
