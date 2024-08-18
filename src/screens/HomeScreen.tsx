import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text } from "@rneui/themed";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Main">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const taskCount = 5;
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
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.taskContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Icon
          name="clipboard-list"
          size={48}
          color="#007AFF"
          style={styles.icon}
        />
        <Text style={styles.taskText}>{taskCount} tasks assigned</Text>
      </Animated.View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("RestaurantList")}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  taskContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: "center",
  },
  icon: {
    marginBottom: 16,
  },
  taskText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#007AFF",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default HomeScreen;
