/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {},
    extend: {
      translate: ["group-hover", "hover"],
      fontFamily: {
        raleway: ["Montserrat", "sans-serif"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        red: {
          light: "#ff8a8e",
          default: "#ff595e",
          dark: "#e53e41",
        },
        blue: {
          light: "#5ae3ff",
          default: "#00bbf9",
          dark: "#0077b6",
        },
        green: {
          light: "#9be6a8",
          default: "#4caf50",
          dark: "#388e3c",
        },
        yellow: {
          light: "#ffeb3b",
          default: "#fbc02d",
          dark: "#f9a825",
        },
        gray: {
          light: "#f5f5f5",
          default: "#e0e0e0",
          darker: "#bdbdbd",
          dark: "#757575",
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
