import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text, useTheme } from "@rneui/themed";
import { RootStackParamList } from "../navigation/AppNavigator";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Main">;

const { width, height } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LottieView
          source={require("./../../assets/audit-animation.json")}
          autoPlay
          loop={false}
          style={styles.animation}
        />
        <Text h2 style={[styles.title, { color: theme.colors.primary }]}>
          Audit form
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>
          Ensure quality and compliance with our easy-to-use audit form
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate("AuditForm")}
        >
          <Icon
            name="clipboard-check-outline"
            size={24}
            color={theme.colors.white}
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonText, { color: theme.colors.white }]}>
            Start Audit
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: width * 0.9,
    alignItems: "center",
  },
  animation: {
    width: width * 0.7,
    height: width * 0.7,
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
