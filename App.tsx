import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider, ThemeProvider } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";
import { paperTheme } from "./src/utils/themes";
import ErrorBoundary from "./src/components/ErrorBoundary";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider theme={paperTheme}>
              <AppNavigator />
            </ThemeProvider>
          </PaperProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
