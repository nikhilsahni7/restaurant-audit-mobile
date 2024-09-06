import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ListItem, Text, Button, useTheme } from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  memberSince: string;
  lastLogin: string;
  loginCount: number;
}

const ProfileScreen = () => {
  const { theme } = useTheme();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const response = await api.get(`/user/user-details/${userId}`);
      setUserInfo({
        name: response.data.name,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
        memberSince: new Date(response.data.memberSince).toLocaleDateString(),
        lastLogin: new Date(response.data.lastLogin).toLocaleString(),
        loginCount: response.data.loginCount,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      Alert.alert("Error", "Failed to load user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const infoItems = [
    { key: "name", icon: "account", label: "Name" },
    { key: "email", icon: "email", label: "Email" },
    { key: "phoneNumber", icon: "phone", label: "Phone" },
    { key: "memberSince", icon: "calendar", label: "Member Since" },
    { key: "lastLogin", icon: "clock", label: "Last Login" },
    { key: "loginCount", icon: "counter", label: "Login Count" },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text
          h3
          style={{
            color: theme.colors.primary,
            marginBottom: 20,
            fontWeight: "bold",
            fontStyle: "italic",
            fontFamily: "roboto",
          }}
        >
          Profile Information
        </Text>
      </View>
      <View style={styles.infoContainer}>
        {infoItems.map(({ key, icon, label }) => (
          <ListItem key={key} bottomDivider>
            <Icon name={icon} size={24} color={theme.colors.primary} />
            <ListItem.Content>
              <ListItem.Title
                style={{ color: theme.colors.grey1, fontWeight: "bold" }}
              >
                {label}
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: theme.colors.secondary }}>
                {userInfo ? userInfo[key as keyof UserInfo] : ""}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
      <Button
        title="Edit Profile"
        icon={
          <Icon
            name="account-edit"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
        }
        containerStyle={styles.buttonContainer}
        buttonStyle={{ backgroundColor: theme.colors.primary }}
        onPress={() => {
          // We'll implement this later
          Alert.alert("Edit Profile", "This feature will be implemented soon.");
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  name: {
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonContainer: {
    margin: 20,
  },
});

export default ProfileScreen;
