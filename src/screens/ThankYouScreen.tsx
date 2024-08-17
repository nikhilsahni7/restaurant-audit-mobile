import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "@rneui/themed";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import CustomHeader from "../components/CustomHeader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type ThankYouScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ThankYou"
>;

type ThankYouScreenProps = {
  navigation: ThankYouScreenNavigationProp;
};

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Icon
          name="check-circle"
          size={100}
          color={theme.colors.success}
          style={styles.icon}
        />
        <Text h3 style={[styles.title, { color: theme.colors.primary }]}>
          Thank You!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.grey3 }]}>
          Your form has been submitted successfully.
        </Text>
        <Button
          title="Edit Response"
          icon={
            <Icon
              name="pencil"
              size={20}
              color={theme.colors.primary}
              style={styles.buttonIcon}
            />
          }
          onPress={() => {
            /* Navigate to edit form */
          }}
          containerStyle={styles.buttonContainer}
          type="outline"
        />
        <Button
          title="Generate PDF"
          icon={
            <Icon
              name="file-pdf-box"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
          }
          onPress={() => {
            /* Handle PDF generation */
          }}
          containerStyle={styles.buttonContainer}
        />
        <Button
          title="Back to Home"
          icon={
            <Icon
              name="home"
              size={20}
              color={theme.colors.primary}
              style={styles.buttonIcon}
            />
          }
          onPress={() => navigation.navigate("Main")}
          containerStyle={styles.buttonContainer}
          type="clear"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "80%",
    marginVertical: 8,
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default ThankYouScreen;
