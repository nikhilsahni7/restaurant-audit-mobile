import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { Input, Button, Text, useTheme, CheckBox } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

type AuditFormScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ThankYou"
>;

interface AuditFormData {
  nameOfCompany: string;
  fssaiLicenseNo: string;
  companyRepresentatives: string[];
  siteAddress: string;
  state: string;
  pinCode: string;
  phoneNo: string;
  email: string;
  website: string;
  auditTeam: string[];
  dateOfAudit: string;
  auditType: string;
  auditCriteria: string;
  typeOfAudit: string;
  scope: string;
  manpower: {
    male: number;
    female: number;
  };
}

interface Question {
  id: string;
  question: string;
  compliance: "Y" | "N" | "NI" | "N/A" | "";
  evidenceAndComments: string;
  image: string;
  key?: string;
  isExpanded?: boolean;
}

const API_BASE_URL = "https://restaurant-audit-app-backend-1.onrender.com/api";

const useAuditForm = () => {
  const [formData, setFormData] = useState<AuditFormData>({
    nameOfCompany: "",
    fssaiLicenseNo: "",
    companyRepresentatives: ["", ""],
    siteAddress: "",
    state: "",
    pinCode: "",
    phoneNo: "",
    email: "",
    website: "",
    auditTeam: ["", ""],
    dateOfAudit: new Date().toISOString(),
    auditType: "",
    auditCriteria: "",
    typeOfAudit: "",
    scope: "",
    manpower: {
      male: 0,
      female: 0,
    },
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/audit-templates`);
      setQuestions(
        response.data[0].sections.map(
          (section: { question: string }, index: number) => ({
            id: `question-${index}`,
            question: section.question,
            compliance: "",
            evidenceAndComments: "",
            image: "",
            isExpanded: false,
          })
        )
      );
    } catch (err) {
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = useCallback((key: keyof AuditFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateQuestion = useCallback(
    (id: string, key: keyof Question, value: any) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
      );
    },
    []
  );

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return "";
    }
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User not authenticated");

      const formattedData = {
        userId,
        nameOfCompany: formData.nameOfCompany,
        fssaiLicenseNo: formData.fssaiLicenseNo,
        companyRepresentatives: formData.companyRepresentatives.filter(Boolean),
        siteAddress: formData.siteAddress,
        state: formData.state,
        pinCode: formData.pinCode,
        phoneNo: formData.phoneNo,
        email: formData.email,
        website: formData.website,
        auditTeam: formData.auditTeam.filter(Boolean),
        dateOfAudit: new Date(formData.dateOfAudit).toISOString(),
        auditType: formData.auditType,
        auditCriteria: formData.auditCriteria,
        typeOfAudit: formData.typeOfAudit,
        scope: formData.scope,
        manpower: {
          male: parseInt(formData.manpower.male.toString()) || 0,
          female: parseInt(formData.manpower.female.toString()) || 0,
        },
        sections: await Promise.all(
          questions.map(async (q) => ({
            question: q.question,
            compliance: q.compliance || "N/A",
            evidenceAndComments: q.evidenceAndComments || "",
            image: q.image ? await convertImageToBase64(q.image) : "",
          }))
        ),
      };

      console.log("Submitting data:", JSON.stringify(formattedData, null, 2));

      const response = await axios.post(
        `${API_BASE_URL}/user/audit-form`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.data && response.data.pdfPath) {
        return response.data;
      } else {
        throw new Error("PDF path not received from server");
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    questions,
    loading,
    error,
    updateFormData,
    updateQuestion,
    submitForm,
  };
};

export const AuditForm: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<AuditFormScreenNavigationProp>();
  const {
    formData,
    questions,
    loading,
    error,
    updateFormData,
    updateQuestion,
    submitForm,
  } = useAuditForm();

  const handleSubmit = async () => {
    try {
      console.log("Submitting form...");
      const result = await submitForm();
      if (result && result.pdfPath) {
        console.log(
          "Form submitted successfully. Navigating to ThankYou screen."
        );
        navigation.navigate("ThankYou", { pdfPath: result.pdfPath });
      } else {
        console.error("PDF path not received from server");
        throw new Error("PDF path not received from server");
      }
    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      Alert.alert(
        "Submission Error",
        `Failed to submit the form. Error details: ${err.message}. Please check the console for more information and try again or contact support.`
      );
    }
  };

  const complianceOptions = ["Y", "N", "NI", "N/A"];

  const toggleQuestion = useCallback(
    (id: string) => {
      updateQuestion(id, "isExpanded", (prev: boolean) => !prev);
    },
    [updateQuestion]
  );
  const handleImagePick = useCallback(
    async (id: string, source: "library" | "camera") => {
      let permissionResult;
      if (source === "camera") {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (permissionResult.granted === false) {
        Alert.alert(`Permission to access ${source} is required!`);
        return;
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        updateQuestion(id, "image", result.assets[0].uri);
      }
    },
    [updateQuestion]
  );

  const renderQuestion = useCallback(
    ({ item }: { item: Question }) => (
      <View style={styles.questionContainer}>
        <TouchableOpacity onPress={() => toggleQuestion(item.id)}>
          <Text style={styles.questionText}>{item.question}</Text>
        </TouchableOpacity>
        {item.isExpanded && (
          <>
            <Text style={styles.complianceLabel}>Compliance:</Text>
            <View style={styles.radioButtonContainer}>
              {complianceOptions.map((option) => (
                <CheckBox
                  key={option}
                  title={option}
                  checked={item.compliance === option}
                  onPress={() => updateQuestion(item.id, "compliance", option)}
                  containerStyle={styles.radioButton}
                />
              ))}
            </View>
            <Input
              placeholder="Evidence and Comments"
              value={item.evidenceAndComments}
              onChangeText={(value) =>
                updateQuestion(item.id, "evidenceAndComments", value)
              }
              multiline
            />
            <View style={styles.imageButtonsContainer}>
              <Button
                title="Choose from Gallery"
                onPress={() => handleImagePick(item.id, "library")}
                type="outline"
                containerStyle={styles.imageButton}
              />
              <Button
                title="Take Photo"
                onPress={() => handleImagePick(item.id, "camera")}
                type="outline"
                containerStyle={styles.imageButton}
              />
            </View>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
          </>
        )}
      </View>
    ),
    [updateQuestion, toggleQuestion, handleImagePick]
  );

  const memoizedQuestions = useMemo(() => questions, [questions]);

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text h3 style={styles.title}>
        Audit Form
      </Text>
      <FlatList
        data={[
          { key: "form-fields" },
          ...memoizedQuestions,
          { key: "submit-button" },
        ]}
        renderItem={({ item }) => {
          if ((item as { key: string }).key === "form-fields") {
            return (
              <>
                <Input
                  placeholder="Name of Company"
                  value={formData.nameOfCompany}
                  onChangeText={(value) =>
                    updateFormData("nameOfCompany", value)
                  }
                />
                <Input
                  placeholder="FSSAI License No"
                  value={formData.fssaiLicenseNo}
                  onChangeText={(value) =>
                    updateFormData("fssaiLicenseNo", value)
                  }
                />
                <Input
                  placeholder="Company Representative 1"
                  value={formData.companyRepresentatives[0]}
                  onChangeText={(value) =>
                    updateFormData("companyRepresentatives", [
                      value,
                      formData.companyRepresentatives[1],
                    ])
                  }
                />
                <Input
                  placeholder="Company Representative 2"
                  value={formData.companyRepresentatives[1]}
                  onChangeText={(value) =>
                    updateFormData("companyRepresentatives", [
                      formData.companyRepresentatives[0],
                      value,
                    ])
                  }
                />
                <Input
                  placeholder="Site Address"
                  value={formData.siteAddress}
                  onChangeText={(value) => updateFormData("siteAddress", value)}
                />
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(value) => updateFormData("state", value)}
                />
                <Input
                  placeholder="Pin Code"
                  value={formData.pinCode}
                  onChangeText={(value) => updateFormData("pinCode", value)}
                />
                <Input
                  placeholder="Phone No"
                  value={formData.phoneNo}
                  onChangeText={(value) => updateFormData("phoneNo", value)}
                />
                <Input
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(value) => updateFormData("email", value)}
                />
                <Input
                  placeholder="Website"
                  value={formData.website}
                  onChangeText={(value) => updateFormData("website", value)}
                />
                <Input
                  placeholder="Audit Team Member 1"
                  value={formData.auditTeam[0]}
                  onChangeText={(value) =>
                    updateFormData("auditTeam", [value, formData.auditTeam[1]])
                  }
                />
                <Input
                  placeholder="Audit Team Member 2"
                  value={formData.auditTeam[1]}
                  onChangeText={(value) =>
                    updateFormData("auditTeam", [formData.auditTeam[0], value])
                  }
                />
                <Input
                  placeholder="Audit Type"
                  value={formData.auditType}
                  onChangeText={(value) => updateFormData("auditType", value)}
                />
                <Input
                  placeholder="Audit Criteria"
                  value={formData.auditCriteria}
                  onChangeText={(value) =>
                    updateFormData("auditCriteria", value)
                  }
                />
                <Input
                  placeholder="Type of Audit"
                  value={formData.typeOfAudit}
                  onChangeText={(value) => updateFormData("typeOfAudit", value)}
                />
                <Input
                  placeholder="Scope"
                  value={formData.scope}
                  onChangeText={(value) => updateFormData("scope", value)}
                />
                <Input
                  placeholder="Male Manpower"
                  value={formData.manpower.male.toString()}
                  onChangeText={(value) =>
                    updateFormData("manpower", {
                      ...formData.manpower,
                      male: parseInt(value) || 0,
                    })
                  }
                  keyboardType="numeric"
                />
                <Input
                  placeholder="Female Manpower"
                  value={formData.manpower.female.toString()}
                  onChangeText={(value) =>
                    updateFormData("manpower", {
                      ...formData.manpower,
                      female: parseInt(value) || 0,
                    })
                  }
                  keyboardType="numeric"
                />
              </>
            );
          } else if ((item as { key: string }).key === "submit-button") {
            return (
              <Button
                title="Submit Audit"
                onPress={handleSubmit}
                loading={loading}
                containerStyle={styles.submitButton}
              />
            );
          } else {
            return renderQuestion({ item: item as Question });
          }
        }}
        keyExtractor={(item) =>
          (item as { key?: string }).key || (item as Question).id
        }
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={21}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  complianceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  radioButton: {
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  imageButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default AuditForm;
