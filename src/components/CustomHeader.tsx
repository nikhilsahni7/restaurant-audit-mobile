// src/components/CustomHeader.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Header, Text } from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const CustomHeader = ({ scene, previous }: any) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const title =
    scene?.descriptor?.options?.headerTitle ??
    scene?.descriptor?.options?.title ??
    scene?.route?.name ??
    "Restaurant Audit App";

  return (
    <Header
      backgroundColor={theme.colors.background}
      containerStyle={styles.headerContainer}
      leftComponent={
        previous ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        ) : undefined
      }
      centerComponent={
        <View style={styles.titleContainer}>
          <Text h4 style={[styles.title, { color: theme.colors.primary }]}>
            {title}
          </Text>
        </View>
      }
      rightComponent={
        <TouchableOpacity onPress={() => navigation.navigate("Auth" as never)}>
          <Icon name="logout" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 0,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
});

export default CustomHeader;
