// src/components/FormCard.tsx
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Text, useTheme } from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface FormCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

const FormCard: React.FC<FormCardProps> = ({ title, description, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.touchable}
      activeOpacity={0.7}
    >
      <Card
        containerStyle={[
          styles.card,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              {title}
            </Text>
            <Text style={[styles.description, { color: theme.colors.grey3 }]}>
              {description}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={theme.colors.primary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 0,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});

export default FormCard;
