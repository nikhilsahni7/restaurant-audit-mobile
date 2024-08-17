import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { ListItem, Text, useTheme } from "@rneui/themed";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import CustomHeader from "../components/CustomHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type HistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Main"
>;

type HistoryScreenProps = {
  navigation: HistoryScreenNavigationProp;
};

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const historyData = [
    {
      id: "1",
      formName: "Kitchen Cleanliness",
      date: "2024-08-15",
      version: 1,
    },
    { id: "2", formName: "Food Safety", date: "2024-08-14", version: 2 },
    { id: "3", formName: "Customer Service", date: "2024-08-13", version: 1 },
    {
      id: "4",
      formName: "Equipment Maintenance",
      date: "2024-08-12",
      version: 3,
    },
    { id: "5", formName: "Staff Performance", date: "2024-08-11", version: 1 },
  ];

  const renderHistoryItem = ({ item }: { item: (typeof historyData)[0] }) => (
    <ListItem
      bottomDivider
      onPress={() => navigation.navigate("Form", { formId: item.id })}
      containerStyle={styles.listItemContainer}
    >
      <Icon name="clipboard-text" size={24} color={theme.colors.primary} />
      <ListItem.Content>
        <ListItem.Title style={{ color: theme.colors.black }}>
          {item.formName}
        </ListItem.Title>
        <ListItem.Subtitle style={{ color: theme.colors.grey3 }}>
          Date: {item.date}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Text style={{ color: theme.colors.grey3 }}>Version {item.version}</Text>
      <ListItem.Chevron color={theme.colors.primary} />
    </ListItem>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.grey3 }]}>
            No history available
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  listItemContainer: {
    borderRadius: 8,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
});

export default HistoryScreen;
