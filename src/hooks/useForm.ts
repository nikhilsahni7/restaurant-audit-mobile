import { useState, useEffect } from "react";
import { FormData } from "../types";

const dummyFormData: FormData = {
  title: "Kitchen Cleanliness Audit",
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
      options: ["Yes", "No", "N/A"],
    },
    { id: "3", type: "text", question: "Any additional comments?" },
  ],
};

const useForm = (formId: string) => {
  const [formData, setFormData] = useState<FormData>(dummyFormData);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(dummyFormData);
  }, [formId]);

  const handleSubmit = (navigation: any) => {
    // Form submission logic will be added later here from the backend
    console.log("Form submitted:", answers);
    navigation.navigate("ThankYou", { formId });
  };

  return { formData, answers, setAnswers, handleSubmit };
};

export default useForm;
