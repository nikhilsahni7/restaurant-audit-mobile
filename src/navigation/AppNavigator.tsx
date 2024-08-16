import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Appbar } from "react-native-paper";
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import FormScreen from "../screens/FormScreen";
import ThankYouScreen from "../screens/ThankYouScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HistoryScreen from "../screens/HistoryScreen";

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Form: { formId: string };
  ThankYou: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  History: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const CustomHeader = () => (
  <Appbar.Header>
    <Appbar.Content title="Restaurant Audit App" />
  </Appbar.Header>
);

const MainTabs: React.FC = () => (
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
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ header: () => <CustomHeader /> }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ header: () => <CustomHeader /> }}
    />
    <Tab.Screen
      name="History"
      component={HistoryScreen}
      options={{ header: () => <CustomHeader /> }}
    />
  </Tab.Navigator>
);

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
      name="Form"
      component={FormScreen}
      options={{ header: () => <CustomHeader /> }}
    />
    <Stack.Screen
      name="ThankYou"
      component={ThankYouScreen}
      options={{ header: () => <CustomHeader /> }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
