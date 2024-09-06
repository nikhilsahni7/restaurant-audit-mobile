import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "@rneui/themed";
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import { AuditForm } from "../screens/FormScreen";
import ThankYouScreen from "../screens/ThankYouScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HistoryScreen from "../screens/HistoryScreen";
import CustomHeader from "../components/CustomHeader";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AuditForm: undefined; // Changed from Form to AuditForm
  ThankYou: { pdfPath: string }; // Add pdfPath parameter
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  History: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline";
          } else if (route.name === "History") {
            iconName = focused ? "history" : "history";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.grey2,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: (props) => <CustomHeader {...props} title="Home" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: (props) => <CustomHeader {...props} title="Profile" />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          header: (props) => <CustomHeader {...props} title="History" />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="Auth">
    <Stack.Screen
      name="Auth"
      component={AuthScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Main"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AuditForm"
      component={AuditForm}
      options={{
        header: (props) => (
          <CustomHeader {...props} title="Audit Form" showBackButton />
        ),
      }}
    />
    <Stack.Screen
      name="ThankYou"
      component={ThankYouScreen}
      options={{
        header: (props) => (
          <CustomHeader {...props} title="Thank You" showBackButton />
        ),
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
