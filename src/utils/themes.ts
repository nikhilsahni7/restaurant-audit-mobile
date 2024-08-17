import { createTheme } from "@rneui/themed";

export const theme = createTheme({
  lightColors: {
    primary: "#6200EE",
    secondary: "#03DAC6",
    background: "#FFFFFF",

    error: "#B00020",
    success: "#4CAF50",
    warning: "#FFC107",
  },
  darkColors: {
    primary: "#BB86FC",
    secondary: "#03DAC6",
    background: "#121212",

    error: "#CF6679",
    success: "#4CAF50",
    warning: "#FFC107",
  },
  mode: "light",
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  components: {
    Button: {
      raised: true,
      buttonStyle: {
        borderRadius: 8,
        paddingVertical: 12,
      },
      containerStyle: {
        marginVertical: 8,
      },
    },
    Input: {
      inputContainerStyle: {
        borderBottomWidth: 0,
        backgroundColor: "#F0F0F5",
        borderRadius: 8,
        paddingHorizontal: 12,
      },
      inputStyle: {
        fontSize: 16,
      },
      leftIconContainerStyle: {
        marginRight: 12,
      },
    },
    Card: {
      containerStyle: {
        borderRadius: 12,
        elevation: 3,
      },
    },
  },
});
