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
          300: "#b7b7a4",
          600: "#a5a58d",
          900: "#6b705c",
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
