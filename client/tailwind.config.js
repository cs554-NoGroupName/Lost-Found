/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "479px" },
      // => @media (max-width: 639px) { ... }
    },
    colors: {
      logoBlue: "#367272",
      lightWhite: "#e6e6e6",
      logoLightBlue: "#6AA6A6",
      logoLighterBlue: "#95B1B0",
      logoDarkBlue: "#324B4B",
    },
    extend: {},
  },
  plugins: [],
};
