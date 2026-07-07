const { colors } = require("./src/theme/colors"); // Import colors

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 🟢 FIX: Yahan "./src/**/*.{js,jsx,ts,tsx}" add karna zaroori hai
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}" 
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors,
      
    },
  },
  plugins: [],
}