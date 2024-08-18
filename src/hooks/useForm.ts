import { useState, useEffect } from "react";
import { FormData } from "../types";

const dummyFormData: FormData = {
  title: "Restaurant Audit Form",
  questions: [
    {
      id: "1",
      type: "text",
      question: "Are all surfaces clean and sanitized?",
    },
    {
      id: "2",
      type: "mcq",
      question: "Is the refrigerator temperature correct?",
      options: ["Yes", "No", "N/A", "N/I"],
    },
    {
      id: "3",
      type: "text",
      question: "Are food storage areas organized and clean?",
    },
    {
      id: "4",
      type: "mcq",
      question: "Are all staff members wearing proper uniforms?",
      options: ["Yes", "No", "Partially"],
    },
    {
      id: "5",
      type: "text",
      question: "Is the kitchen equipment in good working condition?",
    },
    {
      id: "6",
      type: "mcq",
      question: "Are proper food handling procedures being followed?",
      options: ["Always", "Sometimes", "Rarely", "Never"],
    },
    {
      id: "7",
      type: "text",
      question: "Are there any signs of pest infestation?",
    },
    {
      id: "8",
      type: "mcq",
      question: "Is the waste management system effective?",
      options: ["Yes", "No", "Needs Improvement"],
    },
    {
      id: "9",
      type: "text",
      question: "Any additional comments or observations?",
    },
  ],
};

const useForm = (restaurantId: string) => {
  const [formData, setFormData] = useState<FormData>(dummyFormData);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(dummyFormData);
  }, [restaurantId]);

  const handleSubmit = async (navigation: any) => {
    try {
      console.log("Submitting answers for restaurant:", restaurantId);
      console.log("Answers:", answers);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAnswers({});

      navigation.navigate("ThankYou");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return { formData, answers, setAnswers, handleSubmit };
};

export default useForm;
