/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      translate: ["group-hover", "hover"],
      animation: {
        flash: "flash-frame 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "flash-frame": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".6" },
        },
      },
      translate: ["group-hover", "hover"],
      colors: {
        atomorange: "#d19a66", // 土橙黄
        atomgray: "#ABB2BF", // 灰白
        atomcyan: "#56B6C2", // 青蓝
        atomyellow: "#d19a66", // 土黄
        atomred: "#E06C75", // 浅粉红
        atompurple: {
          DEFAULT: "#C678DD",
          light: "#D3A4E3",
          dark: "#61297F",
        }, // 浅紫
        atomblue: "#61AFEF", // 蓝
        atomgreen: "#98C379", // 抹茶绿
        atomblack: "#282C34",
      },
    },
  },
  variants: {
    extend: {
      animation: ["hover"],
    },
  },
  plugins: [],
};
