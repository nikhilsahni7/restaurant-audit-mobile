// src/screens/ProfileScreen.tsx
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Avatar, ListItem, Text, Button, useTheme } from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileScreen = () => {
  const { theme } = useTheme();

  const userInfo = {
    name: "Nikhil Sahni",
    email: "nikhil.sahni321@gmail.com",
    phone: "+91 8800244926",
    memberSince: "January 1, 2023",
    lastLogin: "August 17, 2024 10:30 AM",
    loginCount: 42,
  };

  const infoItems = [
    { key: "email", icon: "email", label: "Email" },
    { key: "phone", icon: "phone", label: "Phone" },
    { key: "memberSince", icon: "calendar", label: "Member Since" },
    { key: "lastLogin", icon: "clock", label: "Last Login" },
    { key: "loginCount", icon: "counter", label: "Login Count" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Avatar
          rounded
          size="xlarge"
          source={{
            uri: "https://avatars.githubusercontent.com/u/100983397?v=4",
          }}
          containerStyle={styles.avatar}
        />
        <Text h3 style={styles.name}>
          {userInfo.name}
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
              <ListItem.Subtitle style={{ color: theme.colors.grey3 }}>
                {userInfo[key as keyof typeof userInfo]}
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
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    marginBottom: 15,
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
