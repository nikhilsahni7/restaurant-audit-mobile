import React from "react";
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import FormCard from "../components/FormCard";
import { RootStackParamList } from "../navigation/AppNavigator";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Main">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const forms = [
    {
      id: "1",
      title: "Kitchen Cleanliness",
      description: "Weekly kitchen audit",
    },
    { id: "2", title: "Food Safety", description: "Daily food safety check" },
    {
      id: "3",
      title: "Customer Service",
      description: "Monthly customer service review",
    },
    {
      id: "4",
      title: "Equipment Maintenance",
      description: "Quarterly equipment check",
    },
    {
      id: "5",
      title: "Staff Performance",
      description: "Bi-weekly staff evaluation",
    },
  ];

  const renderItem = ({ item }: { item: (typeof forms)[0] }) => (
    <FormCard
      title={item.title}
      description={item.description}
      onPress={() => navigation.navigate("Form", { formId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={forms}
        renderItem={renderItem}
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
});

export default HomeScreen;
