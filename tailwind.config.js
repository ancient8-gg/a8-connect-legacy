module.exports = {
  content: ["./src/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#60D58F",
        white: "#ffffff",
        gray: "#a6a6a6",
        red: "#ff0000",
        metamask: "#ff8900",
        gray1: "#afafaf",
        gray2: "#787878",
        "gray-primary": "#101214",
        success: "#c5fde4",
        yellow: "#fbfdc5",
      },
    },
    letterSpacing: {
      tightest: "-.075em",
      tighter: "-.05em",
      tight: "-.025em",
      normal: "0",
      wide: ".025em",
      wider: ".05em",
      widest: ".25em",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1300px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
