import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ThankYouScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={100} color="green" />
      <Text h2 style={styles.title}>
        Thank You!
      </Text>
      <Text style={styles.subtitle}>
        Your form has been submitted successfully.
      </Text>
      <Button
        title="Edit Response"
        onPress={() => {
          /* Navigate to edit form */
        }}
        containerStyle={styles.buttonContainer}
        type="outline"
      />
      <Button
        title="Generate PDF"
        onPress={() => {
          /* Handle PDF generation */
        }}
        containerStyle={styles.buttonContainer}
        icon={<Icon name="file-pdf" size={20} color="white" />}
      />
      <Button
        title="Back to Home"
        onPress={() => navigation.navigate("Home")}
        containerStyle={styles.buttonContainer}
        type="clear"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    marginVertical: 16,
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
});

export default ThankYouScreen;
