// src/screens/FormScreen.tsx
import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { Button, Text, Input, CheckBox } from "@rneui/themed";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import useForm from "../hooks/useForm";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type FormScreenRouteProp = RouteProp<RootStackParamList, "Form">;
type FormScreenNavigationProp = StackNavigationProp<RootStackParamList, "Form">;

type FormScreenProps = {
  route: FormScreenRouteProp;
  navigation: FormScreenNavigationProp;
};

const FormScreen: React.FC<FormScreenProps> = ({ route, navigation }) => {
  const { formId } = route.params;
  const { formData, answers, setAnswers, handleSubmit } = useForm(formId);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const renderQuestion = (
    question: (typeof formData.questions)[0],
    index: number
  ) => {
    const inputAnimation = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(inputAnimation, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, []);

    switch (question.type) {
      case "text":
        return (
          <Animated.View
            style={{
              opacity: inputAnimation,
              transform: [
                {
                  translateY: inputAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            }}
          >
            <Input
              label={question.question}
              value={answers[question.id] as string}
              onChangeText={(text) =>
                setAnswers({ ...answers, [question.id]: text })
              }
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.inputField}
              labelStyle={styles.inputLabel}
              leftIcon={<Icon name="pencil" size={24} color="#6200ee" />}
            />
          </Animated.View>
        );
      case "mcq":
        return (
          <Animated.View
            style={{
              opacity: inputAnimation,
              transform: [
                {
                  translateY: inputAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            }}
          >
            <Text style={styles.questionText}>{question.question}</Text>
            {question.options?.map((option) => (
              <CheckBox
                key={option}
                title={option}
                checked={answers[question.id] === option}
                onPress={() =>
                  setAnswers({ ...answers, [question.id]: option })
                }
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
                checkedColor="#6200ee"
                uncheckedColor="#6200ee"
              />
            ))}
          </Animated.View>
        );
      default:
        return null;
    }
  };

  const handleFormSubmit = () => {
    const unansweredQuestions = formData.questions.filter(
      (q) => !answers[q.id]
    );
    if (unansweredQuestions.length > 0) {
      Alert.alert(
        "Incomplete Form",
        "Please answer all questions before submitting."
      );
      return;
    }
    handleSubmit(navigation);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {formData.questions.map((q, index) => (
          <View key={q.id} style={styles.questionContainer}>
            {renderQuestion(q, index)}
          </View>
        ))}
        <Button
          title="Submit"
          onPress={handleFormSubmit}
          containerStyle={styles.submitButton}
          buttonStyle={styles.submitButtonStyle}
          titleStyle={styles.submitButtonText}
          icon={<Icon name="check" size={24} color="white" />}
        />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 24,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  inputField: {
    borderBottomColor: "#6200ee",
    borderBottomWidth: 2,
  },
  inputLabel: {
    color: "#6200ee",
    fontWeight: "bold",
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginVertical: 8,
  },
  checkboxText: {
    fontWeight: "normal",
    fontSize: 16,
  },
  submitButton: {
    marginTop: 24,
  },
  submitButtonStyle: {
    backgroundColor: "#6200ee",
    borderRadius: 8,
    paddingVertical: 12,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  questionText: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200ee",
  },
});

export default FormScreen;
