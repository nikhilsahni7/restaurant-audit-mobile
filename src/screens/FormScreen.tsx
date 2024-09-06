import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Input, Button, Text, useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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
  compliance: "Y" | "N" | "NI" | "N/A";
  evidenceAndComments: string;
  image: string;
  key?: string;
}

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
      const response = await axios.get(
        "https://restaurant-audit-app-backend-1.onrender.com/api/admin/audit-templates"
      );
      setQuestions(
        response.data[0].sections.map(
          (section: { question: string }, index: number) => ({
            id: `question-${index}`,
            question: section.question,
            compliance: "",
            evidenceAndComments: "",
            image: "",
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
    (id: string, key: keyof Question, value: string) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
      );
    },
    []
  );

  const submitForm = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User not authenticated");

      const formattedData = {
        userId,
        ...formData,
        companyRepresentatives: [
          formData.companyRepresentatives[0] || "",
          formData.companyRepresentatives[1] || "",
        ],
        auditTeam: [formData.auditTeam[0] || "", formData.auditTeam[1] || ""],
        dateOfAudit: new Date(formData.dateOfAudit).toISOString(),
        manpower: {
          male: parseInt(formData.manpower.male.toString()) || 0,
          female: parseInt(formData.manpower.female.toString()) || 0,
        },
        sections: questions.map((q) => ({
          question: q.question,
          compliance: q.compliance || "N/A", // Ensure a valid enum value
          evidenceAndComments: q.evidenceAndComments || "",
          image: q.image || "",
        })),
      };

      console.log("Submitting data:", JSON.stringify(formattedData, null, 2));

      const response = await axios.post(
        "https://restaurant-audit-app-backend-1.onrender.com/api/user/audit-form/",
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
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        throw new Error(`Failed to submit form: ${errorMessage}`);
      } else {
        throw new Error(`Unexpected error: ${err.message}`);
      }
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
      const result = await submitForm();
      if (result && result.pdfPath) {
        navigation.navigate("ThankYou", { pdfPath: result.pdfPath });
      } else {
        throw new Error("PDF path not received from server");
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      Alert.alert(
        "Submission Error",
        `Failed to submit the form. ${err.message}. Please try again or contact support.`
      );
    }
  };

  const renderQuestion = useCallback(
    ({ item }: { item: Question }) => (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{item.question}</Text>
        <Input
          placeholder="Compliance (Y/N/NI/N/A)"
          value={item.compliance}
          onChangeText={(value) => {
            const validValues = ["Y", "N", "NI", "N/A"];
            updateQuestion(
              item.id,
              "compliance",
              validValues.includes(value) ? value : "N/A"
            );
          }}
        />
        <Input
          placeholder="Evidence and Comments"
          value={item.evidenceAndComments}
          onChangeText={(value) =>
            updateQuestion(item.id, "evidenceAndComments", value)
          }
          multiline
        />
      </View>
    ),
    [updateQuestion]
  );

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
          ...questions.map((q) => ({ ...q, key: q.id })),
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
        keyExtractor={(item) => item.key}
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
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
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
});
