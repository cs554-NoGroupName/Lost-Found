import { createTheme } from "@mui/material";
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 300,
      md: 639,
      lg: 1023,
      xl: 1279,
    },
  },
  palette: {
    primary: {
      light: "#6AA6A6",
      main: "#1c2536",
      dark: "#324B4B",
      contrastText: "#ffffff"
    },
    secondary: {
      light: "#95B1B0",
      main: "#6AA6A6",
      dark: "#1c2536",
      contrastText: "#e6e6e6"
    },
    custom: {
      light: "#4A5569",
      main: "#2E3643",
      dark: "#111A2B",
      darker: "#070F1D",
      contrastText: "#faf6eb"
    },
    contrastThreshold: 5,
    tonalOffset: 0.2,
  },
})
export default theme;