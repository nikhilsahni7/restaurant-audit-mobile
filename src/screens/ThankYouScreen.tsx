import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Button, Text, useTheme } from "@rneui/themed";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

type ThankYouScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ThankYou"
>;

type ThankYouScreenRouteProp = RouteProp<RootStackParamList, "ThankYou">;

type ThankYouScreenProps = {
  navigation: ThankYouScreenNavigationProp;
  route: ThankYouScreenRouteProp;
};

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({
  navigation,
  route,
}) => {
  const { theme } = useTheme();
  const { pdfPath } = route.params;
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const fileName = pdfPath.split("/").pop() || "audit_report.pdf";
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const downloadResult = await FileSystem.downloadAsync(pdfPath, fileUri);
      if (downloadResult.status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          console.log("Sharing is not available on this platform");
        }
      } else {
        console.error("Failed to download PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Icon
          name="check-circle-outline"
          size={100}
          color={theme.colors.success}
          style={styles.icon}
        />
        <Text h2 style={[styles.title, { color: theme.colors.primary }]}>
          Thank You!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.grey0 }]}>
          Your audit form has been submitted successfully.
        </Text>
        <Button
          title="Download PDF Report"
          icon={
            <Icon
              name="file-pdf-box"
              size={24}
              color={theme.colors.white}
              style={styles.buttonIcon}
            />
          }
          onPress={handleDownloadPDF}
          loading={downloading}
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
