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
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

type EditAuditFormRouteProp = RouteProp<RootStackParamList, "EditAuditForm">;
type EditAuditFormNavigationProp = StackNavigationProp<
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
  isExpanded: boolean;
}

const API_BASE_URL = "https://restaurant-audit-app-backend-1.onrender.com/api";

const EditAuditFormScreen: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<AuditFormData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute<EditAuditFormRouteProp>();
  const navigation = useNavigation<EditAuditFormNavigationProp>();
  const { formId } = route.params;

  useEffect(() => {
    fetchAuditFormData();
  }, []);

  const fetchAuditFormData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/audit-form/${formId}`
      );
      const data = response.data;
      setFormData({
        nameOfCompany: data.nameOfCompany,
        fssaiLicenseNo: data.fssaiLicenseNo,
        companyRepresentatives: data.companyRepresentatives,
        siteAddress: data.siteAddress,
        state: data.state,
        pinCode: data.pinCode,
        phoneNo: data.phoneNo,
        email: data.email,
        website: data.website,
        auditTeam: data.auditTeam,
        dateOfAudit: data.dateOfAudit,
        auditType: data.auditType,
        auditCriteria: data.auditCriteria,
        typeOfAudit: data.typeOfAudit,
        scope: data.scope,
        manpower: data.manpower,
      });
      setQuestions(
        data.sections.map((section: any, index: number) => ({
          id: `question-${index}`,
          question: section.question,
          compliance: section.compliance || "",
          evidenceAndComments: section.evidenceAndComments || "",
          image: section.image || "",
          isExpanded: false,
        }))
      );
    } catch (error) {
      console.error("Error fetching audit form data:", error);
      Alert.alert("Error", "Failed to fetch audit form data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback(
    (key: keyof AuditFormData, value: any) => {
      setFormData((prev) => (prev ? { ...prev, [key]: value } : null));
    },
    []
  );

  const updateQuestion = useCallback(
    (id: string, key: keyof Question, value: any) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
      );
    },
    []
  );

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

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setLoading(true);

      const formattedData = {
        ...formData,
        sections: questions.map((question) => ({
          question: question.question,
          compliance: question.compliance || "N/A",
          evidenceAndComments: question.evidenceAndComments || "",
          image: question.image || "",
        })),
      };

      const response = await axios.put(
        `${API_BASE_URL}/user/audit-forms/${formId}`,
        formattedData
      );

      if (response.data && response.data.pdfPath) {
        navigation.navigate("ThankYou", { pdfPath: response.data.pdfPath });
      } else {
        throw new Error("PDF path not received from server");
      }
    } catch (error) {
      console.error("Error updating audit form:", error);
      Alert.alert("Error", "Failed to update audit form");
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = useCallback(
    () => (
      <>
        <Input
          label="Name of Company"
          value={formData?.nameOfCompany}
          onChangeText={(value) => handleInputChange("nameOfCompany", value)}
        />
        <Input
          label="FSSAI License No"
          value={formData?.fssaiLicenseNo}
          onChangeText={(value) => handleInputChange("fssaiLicenseNo", value)}
        />
        {formData?.companyRepresentatives.map((rep, idx) => (
          <Input
            key={`rep-${idx}`}
            label={`Company Representative ${idx + 1}`}
            value={rep}
            onChangeText={(value) => {
              const newReps = [...formData.companyRepresentatives];
              newReps[idx] = value;
              handleInputChange("companyRepresentatives", newReps);
            }}
          />
        ))}
        <Input
          label="Site Address"
          value={formData?.siteAddress}
          onChangeText={(value) => handleInputChange("siteAddress", value)}
        />
        <Input
          label="State"
          value={formData?.state}
          onChangeText={(value) => handleInputChange("state", value)}
        />
        <Input
          label="Pin Code"
          value={formData?.pinCode}
          onChangeText={(value) => handleInputChange("pinCode", value)}
        />
        <Input
          label="Phone No"
          value={formData?.phoneNo}
          onChangeText={(value) => handleInputChange("phoneNo", value)}
        />
        <Input
          label="Email"
          value={formData?.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        <Input
          label="Website"
          value={formData?.website}
          onChangeText={(value) => handleInputChange("website", value)}
        />
        {formData?.auditTeam.map((member, idx) => (
          <Input
            key={`team-${idx}`}
            label={`Audit Team Member ${idx + 1}`}
            value={member}
            onChangeText={(value) => {
              const newTeam = [...formData.auditTeam];
              newTeam[idx] = value;
              handleInputChange("auditTeam", newTeam);
            }}
          />
        ))}
        <Input
          label="Date of Audit"
          value={formData?.dateOfAudit}
          onChangeText={(value) => handleInputChange("dateOfAudit", value)}
        />
        <Input
          label="Audit Type"
          value={formData?.auditType}
          onChangeText={(value) => handleInputChange("auditType", value)}
        />
        <Input
          label="Audit Criteria"
          value={formData?.auditCriteria}
          onChangeText={(value) => handleInputChange("auditCriteria", value)}
        />
        <Input
          label="Type of Audit"
          value={formData?.typeOfAudit}
          onChangeText={(value) => handleInputChange("typeOfAudit", value)}
        />
        <Input
          label="Scope"
          value={formData?.scope}
          onChangeText={(value) => handleInputChange("scope", value)}
        />
        <Input
          label="Male Manpower"
          value={formData?.manpower.male.toString()}
          onChangeText={(value) =>
            handleInputChange("manpower", {
              ...formData?.manpower,
              male: parseInt(value) || 0,
            })
          }
          keyboardType="numeric"
        />
        <Input
          label="Female Manpower"
          value={formData?.manpower.female.toString()}
          onChangeText={(value) =>
            handleInputChange("manpower", {
              ...formData?.manpower,
              female: parseInt(value) || 0,
            })
          }
          keyboardType="numeric"
        />
      </>
    ),
    [formData, handleInputChange]
  );

  const renderQuestion = useCallback(
    ({ item }: { item: Question }) => {
      const complianceOptions = ["Y", "N", "NI", "N/A"];

      return (
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
                    onPress={() =>
                      updateQuestion(item.id, "compliance", option)
                    }
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
      );
    },
    [toggleQuestion, updateQuestion, handleImagePick]
  );

  const renderItem = useCallback(
    ({ item }: { item: Question | { key: string } }) => {
      if ("key" in item) {
        if (item.key === "form-fields") {
          return renderFormFields();
        } else if (item.key === "submit-button") {
          return (
            <Button
              title="Update Audit Form"
              onPress={handleSubmit}
              loading={loading}
              containerStyle={styles.submitButton}
            />
          );
        }
      } else {
        return renderQuestion({ item });
      }
      return null;
    },
    [renderFormFields, handleSubmit, loading, renderQuestion]
  );

  const memoizedData = useMemo(() => {
    if (!formData) return [];
    return [{ key: "form-fields" }, ...questions, { key: "submit-button" }];
  }, [formData, questions]);

  if (loading && !formData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!formData) {
    return (
      <View style={styles.centered}>
        <Text>No form data available</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={memoizedData}
      renderItem={renderItem}
      keyExtractor={(item, index) => {
        if ("key" in item) return item.key;
        return (item as Question).id || `item-${index}`;
      }}
      ListHeaderComponent={
        <Text h4 style={styles.title}>
          Edit Audit Form
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  imageButton: {
    width: "48%",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
});

export default EditAuditFormScreen;
