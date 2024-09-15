import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { Text, ListItem, Button } from "@rneui/themed";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import api, { getUserId } from "../utils/api";

type AuditHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AuditHistory"
>;

interface AuditForm {
  _id: string;
  userId: string;
  restaurantName: string;
  nameOfCompany: string;
  dateOfAudit: string;
  siteAddress: string;
}

const AuditHistoryScreen: React.FC = () => {
  const [auditForms, setAuditForms] = useState<AuditForm[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<AuditHistoryScreenNavigationProp>();

  const fetchAuditForms = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      if (!userId) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      const response = await api.get(`/user/user-audit-forms/${userId}`);
      if (response.data && response.data.templates) {
        setAuditForms(response.data.templates);
      } else {
        setAuditForms([]);
      }
    } catch (error) {
      console.error("Error fetching audit forms:", error);
      Alert.alert("Error", "Failed to fetch audit forms");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAuditForms();
    }, [fetchAuditForms])
  );

  const handleEditAudit = (formId: string) => {
    navigation.navigate("EditAuditForm", { formId });
  };

  const renderAuditItem = ({ item }: { item: AuditForm }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>CompanyName: {item.nameOfCompany}</ListItem.Title>

        <ListItem.Subtitle>ID: {item._id}</ListItem.Subtitle>
        <ListItem.Subtitle>SiteAddress: {item.siteAddress}</ListItem.Subtitle>
        <ListItem.Subtitle>
          Date: {new Date(item.dateOfAudit).toLocaleDateString()}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Button
        title="Edit"
        onPress={() => handleEditAudit(item._id)}
        type="clear"
      />
    </ListItem>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={auditForms}
        renderItem={renderAuditItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No audit forms found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
  },
});

export default AuditHistoryScreen;
