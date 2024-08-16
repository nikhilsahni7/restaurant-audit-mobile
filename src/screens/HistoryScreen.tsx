import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { ListItem, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const dummyHistory = [
  { id: "1", formName: "Kitchen Cleanliness", date: "2024-08-15", version: 1 },
  { id: "2", formName: "Food Safety", date: "2024-08-14", version: 2 },
  { id: "3", formName: "Customer Service", date: "2024-08-13", version: 1 },
];

const HistoryScreen = ({ navigation }: any) => {
  const renderHistoryItem = ({ item }: any) => (
    <ListItem
      bottomDivider
      onPress={() =>
        navigation.navigate("Form", { formId: item.id, isEditing: true })
      }
    >
      <Icon name="clipboard-text" size={24} color="#2089dc" />
      <ListItem.Content>
        <ListItem.Title>{item.formName}</ListItem.Title>
        <ListItem.Subtitle>Date: {item.date}</ListItem.Subtitle>
      </ListItem.Content>
      <Text>Version {item.version}</Text>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No history available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
});

export default HistoryScreen;
