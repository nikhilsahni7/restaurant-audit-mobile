import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button, Input, Text, useTheme } from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from "@react-navigation/stack";
import { register, login } from "../utils/api";

type AuthScreenProps = {
  navigation: StackNavigationProp<any, "Auth">;
};

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        await register({ name, email, phoneNumber: phone, password });
      } else {
        await login({ email, password });
      }
      navigation.replace("Main");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text h1 style={[styles.title, { color: theme.colors.primary }]}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Text>
        {isSignUp && (
          <>
            <Input
              placeholder="Name"
              leftIcon={
                <Icon name="account" size={24} color={theme.colors.primary} />
              }
              onChangeText={setName}
              value={name}
              inputStyle={styles.input}
            />
            <Input
              placeholder="Phone"
              leftIcon={
                <Icon name="phone" size={24} color={theme.colors.primary} />
              }
              onChangeText={setPhone}
              value={phone}
              keyboardType="phone-pad"
              inputStyle={styles.input}
            />
          </>
        )}
        <Input
          placeholder="Email"
          leftIcon={
            <Icon name="email" size={24} color={theme.colors.primary} />
          }
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          inputStyle={styles.input}
        />
        <Input
          placeholder="Password"
          leftIcon={<Icon name="lock" size={24} color={theme.colors.primary} />}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          inputStyle={styles.input}
        />
        <Button
          title={isSignUp ? "Sign Up" : "Sign In"}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          containerStyle={styles.buttonContainer}
          buttonStyle={{ backgroundColor: theme.colors.primary }}
        />
        <TouchableOpacity
          onPress={() => setIsSignUp(!isSignUp)}
          style={styles.switchAuthMode}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.switchAuthText, { color: theme.colors.primary }]}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginVertical: 16,
    borderRadius: 8,
  },
  switchAuthMode: {
    padding: 10,
  },
  switchAuthText: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default AuthScreen;
