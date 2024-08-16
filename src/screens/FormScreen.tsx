import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, TextInput, RadioButton } from "react-native-paper";
import useForm from "../hooks/useForm";
import { Question } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Form: { formId: string };
  ThankYou: undefined;
};

type FormScreenProps = {
  route: RouteProp<RootStackParamList, "Form">;
  navigation: StackNavigationProp<RootStackParamList, "Form">;
};

const FormScreen: React.FC<FormScreenProps> = ({ route, navigation }) => {
  const { formId } = route.params;
  const { formData, answers, setAnswers, handleSubmit } = useForm(formId);

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "text":
        return (
          <TextInput
            label={question.question}
            value={answers[question.id] || ""}
            onChangeText={(text) =>
              setAnswers({ ...answers, [question.id]: text })
            }
            style={styles.input}
            mode="outlined"
          />
        );
      case "mcq":
        return (
          <View>
            <Text style={styles.questionText}>{question.question}</Text>
            <RadioButton.Group
              onValueChange={(value) =>
                setAnswers({ ...answers, [question.id]: value })
              }
              value={answers[question.id]}
            >
              {question.options?.map((option) => (
                <RadioButton.Item key={option} label={option} value={option} />
              ))}
            </RadioButton.Group>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {formData.questions.map((question) => (
        <View key={question.id}>{renderQuestion(question)}</View>
      ))}
      <Button mode="contained" onPress={() => handleSubmit(navigation)}>
        Submit
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default FormScreen;
