import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { Title } from "react-native-paper";

const ProfileScreen = () => {
  const userInfo = {
    name: "Nikhil Sahni",
    email: "nikhil.sahni321@gmail.com",
    phone: "+91 8800244926",
    memberSince: "January 1, 2023",
    lastLogin: "August 17, 2024 10:30 AM",
    loginCount: 42,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          rounded
          size="large"
          source={{
            uri: "https://avatars.githubusercontent.com/u/100983397?v=4",
          }}
        />
        <Title style={styles.name}>{userInfo.name}</Title>
      </View>
      <View style={styles.infoContainer}>
        {Object.entries(userInfo).map(([key, value]) => (
          <ListItem key={key} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </ListItem.Title>
              <ListItem.Subtitle>{value}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 24,
    marginTop: 10,
  },
  infoContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
  },
});

export default ProfileScreen;
