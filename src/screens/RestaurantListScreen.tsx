import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text } from "@rneui/themed";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type RestaurantListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RestaurantList"
>;

const RestaurantListScreen: React.FC = () => {
  const navigation = useNavigation<RestaurantListScreenNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const restaurants = [
    { id: "1", name: "Restaurant A", icon: "silverware-fork-knife" },
    { id: "2", name: "Restaurant B", icon: "food" },
    { id: "3", name: "Restaurant C", icon: "pizza" },
    { id: "4", name: "Restaurant D", icon: "hamburger" },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderRestaurantItem = ({
    item,
    index,
  }: {
    item: (typeof restaurants)[0];
    index: number;
  }) => (
    <Animated.View
      style={[
        styles.restaurantContainer,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50 * (index + 1), 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.restaurantButton}
        onPress={() => navigation.navigate("Form", { restaurantId: item.id })}
      >
        <Icon
          name={item.icon}
          size={32}
          color="#007AFF"
          style={styles.restaurantIcon}
        />
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Icon name="chevron-right" size={24} color="#007AFF" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  restaurantContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  restaurantIcon: {
    marginRight: 16,
  },
  restaurantName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default RestaurantListScreen;
