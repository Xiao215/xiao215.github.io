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
        flash: "flash-frame 1.5s infinite",
        fall1: "fall1-frame 22s infinite linear",
        fall2: "fall2-frame 15s infinite linear",
        fall3: "fall3-frame 23s infinite linear",
        fall4: "fall4-frame 16s infinite linear",
        fall5: "fall5-frame 19s infinite linear",
        fall6: "fall6-frame 13s infinite linear",
        fall7: "fall7-frame 17s infinite linear",
      },
      keyframes: {
        "flash-frame": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".6" },
        },
        "fall1-frame": {
          "0%": {
            transform: "rotate(0deg)",
            top: "0",
            left: "0",
            opacity: "1",
          },
          "25%": {
            opacity: "0.3",
            transform: "rotate(-270deg)",
          },
          "50%": {
            opacity: "0.7",
            transform: "rotate(-540deg)",
          },
          "75%": {
            opacity: "0.3",
            transform: "rotate(-810deg)",
          },
          "100%": {
            transform: "rotate(-1080deg)",
            top: "100%",
            left: "100%",
            opacity: "0.3",
          },
        },
        "fall2-frame": {
          "0%": {
            transform: "rotate(0deg)",
            top: "10%",
            left: "-10%",
            opacity: "0.3",
          },
          "25%": {
            opacity: "0.9",
            transform: "rotate(-270deg)",
          },
          "50%": {
            opacity: "0.4",
            transform: "rotate(-540deg)",
          },
          "75%": {
            opacity: "1",
            transform: "rotate(-810deg)",
          },
          "100%": {
            transform: "rotate(-1080deg)",
            top: "90%",
            left: "110%",
            opacity: "0.3",
          },
        },
        "fall3-frame": {
          "0%": {
            transform: "rotate(0deg)",
            top: "-36%",
            left: "-25%",
            opacity: "1",
          },
          "25%": {
            opacity: "0.3",
            transform: "rotate(-270deg)",
          },
          "50%": {
            opacity: "0.7",
            transform: "rotate(-540deg)",
          },
          "75%": {
            opacity: "0.3",
            transform: "rotate(-810deg)",
          },
          "100%": {
            transform: "rotate(-1080deg)",
            top: "118%",
            left: "134%",
            opacity: "0.3",
          },
        },
        "fall4-frame": {
          "0%": {
            transform: "rotate(0deg)",
            top: "-13%",
            left: "-10%",
            opacity: "1",
          },
          "25%": {
            opacity: "0.9",
            transform: "rotate(-270deg)",
          },
          "50%": {
            opacity: "0.4",
            transform: "rotate(-540deg)",
          },
          "75%": {
            opacity: "1",
            transform: "rotate(-810deg)",
          },
          "100%": {
            transform: "rotate(-1080deg)",
            top: "129%",
            left: "148%",
            opacity: "0.3",
          },
        },
        "fall5-frame": {
          "0%": {
            transform: "rotate(0deg)",
            top: "-7%",
            left: "-24%",
            opacity: "1",
          },
          "25%": {
            opacity: "0.8",
            transform: "rotate(-270deg)",
          },
          "50%": {
            opacity: "0.5",
            transform: "rotate(-540deg)",
          },
          "75%": {
            opacity: "0.8",
            transform: "rotate(-810deg)",
          },
          "100%": {
            transform: "rotate(-1080deg)",
            top: "104%",
            left: "101%",
            opacity: "0.3",
          },
        },
        "fall6-frame": {
          "0%": {
            transform: "rotate(0deg)",
            top: "-36%",
            left: "-21%",
            opacity: "1",
          },
          "25%": {
            opacity: "0.8",
            transform: "rotate(-270deg)",
          },
          "50%": {
            opacity: "0.5",
            transform: "rotate(-540deg)",
          },
          "75%": {
            opacity: "0.8",
            transform: "rotate(-810deg)",
          },
          "100%": {
            transform: "rotate(-1080deg)",
            top: "131%",
            left: "119%",
            opacity: "0.3",
          },
        },
        "fall7-frame": {
          "0%": {
            transform: "rotate(0deg)",
            top: "-48%",
            left: "-9%",
            opacity: "1",
          },
          "25%": {
            opacity: "0.8",
            transform: "rotate(-270deg)",
          },
          "50%": {
            opacity: "0.5",
            transform: "rotate(-540deg)",
          },
          "75%": {
            opacity: "0.8",
            transform: "rotate(-810deg)",
          },
          "100%": {
            transform: "rotate(-1080deg)",
            top: "135%",
            left: "111%",
            opacity: "0.3",
          },
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
