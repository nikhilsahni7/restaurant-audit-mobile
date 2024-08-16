import { MD3Theme, DefaultTheme } from "react-native-paper";

export const paperTheme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2b89dc",
    secondary: "#f1c40f",

    background: "#f2f2f2",

    surface: "#ffffff",
    error: "#ff0000",
  },
};
