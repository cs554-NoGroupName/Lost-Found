/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      "2xl": { max: "1800px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1535px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1279px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "1023px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },
    colors: {
      logoBlue: "#1c2536",
      lightWhite: "#e6e6e6",
      logoLightBlue: "#6AA6A6",
      logoLighterBlue: "#95B1B0",
      logoDarkBlue: "#324B4B",
      logoBlue2: "#324b4b",
      new: "#4A5569",
      second: "#2E3643",
      third: "#111A2B",
      four: "#070F1D",
      yellow: "#ff9717",
    },
    extend: {},
  },
  plugins: [],
};
