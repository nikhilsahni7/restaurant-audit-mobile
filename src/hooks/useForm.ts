import { useState, useEffect } from "react";
import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  question: string;
  compliance: "Y" | "N" | "";
  evidenceAndComments: string;
  image: string;
}

export const useAuditForm = () => {
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
      const response = await api.get("/admin/audit-templates");
      setQuestions(
        response.data[0].sections.map((section: { question: string }) => ({
          question: section.question,
          compliance: "",
          evidenceAndComments: "",
          image: "",
        }))
      );
    } catch (err) {
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: keyof AuditFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateQuestion = (
    index: number,
    key: keyof Question,
    value: string
  ) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index] = { ...newQuestions[index], [key]: value };
      return newQuestions;
    });
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User not authenticated");

      const response = await api.post("/user/audit-form/", {
        userId,
        ...formData,
        sections: questions,
      });

      return response.data;
    } catch (err) {
      setError("Failed to submit form");
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
