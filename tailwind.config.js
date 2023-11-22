import Cookies from "js-cookie";
let primaryColor = Cookies.get("primary_color");
let secondaryColor = Cookies.get("secondary_color");
let bgColor = Cookies.get("background_color");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { 100: "#132144", 70: "#7F8698", 30: "#BCC0C9" },
        gray: { 30: "#F3F3FA", 70: "#9C9898", 90: "#494949" },
        accent: "#00B0F0",
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        bgColor: bgColor
      },
      fontFamily: {
        // primary: ["var(--font-montserrat)"],
        primary: ["var(--font-openSans)"],
        secondary: ["var(--font-sora)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
