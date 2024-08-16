import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { FAB } from "react-native-paper";
import FormCard from "../components/FormCard";

const dummyForms = [
  {
    id: "1",
    title: "Kitchen Cleanliness",
    description: "Check kitchen hygiene standards",
  },
  {
    id: "2",
    title: "Food Safety",
    description: "Ensure food safety protocols are followed",
  },
  {
    id: "3",
    title: "Customer Service",
    description: "Evaluate staff performance and customer satisfaction",
  },
];

const HomeScreen = ({ navigation }: any) => {
  const renderFormItem = ({ item }: any) => (
    <FormCard
      title={item.title}
      description={item.description}
      onPress={() => navigation.navigate("Form", { formId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyForms}
        renderItem={renderFormItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          /* Handle creating a new form */
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  listContent: {
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
