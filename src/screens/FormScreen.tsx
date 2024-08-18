import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";
import { Text, Input, Button } from "@rneui/themed";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import useForm from "../hooks/useForm";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type FormScreenRouteProp = RouteProp<RootStackParamList, "Form">;
type FormScreenNavigationProp = StackNavigationProp<RootStackParamList, "Form">;

const FormScreen: React.FC = () => {
  const route = useRoute<FormScreenRouteProp>();
  const navigation = useNavigation<FormScreenNavigationProp>();
  const { restaurantId } = route.params;
  const { formData, answers, setAnswers, handleSubmit } = useForm(restaurantId);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "text":
        return (
          <Input
            placeholder="Enter your answer"
            value={answers[question.id] || ""}
            onChangeText={(text) =>
              setAnswers({ ...answers, [question.id]: text })
            }
            leftIcon={<Icon name="pencil" size={24} color="#007AFF" />}
          />
        );
      case "mcq":
        return (
          <View style={styles.mcqContainer}>
            {question.options.map((option: string) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.mcqOption,
                  answers[question.id] === option && styles.mcqOptionSelected,
                ]}
                onPress={() =>
                  setAnswers({ ...answers, [question.id]: option })
                }
              >
                <Icon
                  name={
                    answers[question.id] === option
                      ? "checkbox-marked-circle"
                      : "checkbox-blank-circle-outline"
                  }
                  size={24}
                  color={answers[question.id] === option ? "white" : "#007AFF"}
                  style={styles.mcqIcon}
                />
                <Text
                  style={[
                    styles.mcqOptionText,
                    answers[question.id] === option &&
                      styles.mcqOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {formData.questions.map((question, index) => (
          <Animated.View
            key={question.id}
            style={[
              styles.questionContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.questionText}>
              <Icon
                name="comment-question"
                size={24}
                color="#007AFF"
                style={styles.questionIcon}
              />
              {question.question}
            </Text>
            {renderQuestion(question)}
          </Animated.View>
        ))}
        <Button
          title="Submit"
          onPress={() => handleSubmit(navigation)}
          containerStyle={styles.submitButton}
          icon={
            <Icon
              name="send"
              size={24}
              color="white"
              style={styles.submitIcon}
            />
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 16,
  },
  questionContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  questionIcon: {
    marginRight: 8,
  },
  mcqContainer: {
    flexDirection: "column",
  },
  mcqOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  mcqOptionSelected: {
    backgroundColor: "#007AFF",
  },
  mcqIcon: {
    marginRight: 12,
  },
  mcqOptionText: {
    fontSize: 16,
    color: "#007AFF",
  },
  mcqOptionTextSelected: {
    color: "white",
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
  },
  submitIcon: {
    marginRight: 8,
  },
});

export default FormScreen;
