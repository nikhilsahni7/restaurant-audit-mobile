import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Input } from "react-native-elements";
import { Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from "@react-navigation/stack";

type AuthScreenProps = {
  navigation: StackNavigationProp<any, "Auth">;
};

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    // backend logic later
    navigation.replace("Main");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Title style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Title>
      {isSignUp && (
        <>
          <Input
            placeholder="Name"
            leftIcon={<Icon name="account" size={24} color="gray" />}
            onChangeText={setName}
            value={name}
          />
          <Input
            placeholder="Phone"
            leftIcon={<Icon name="phone" size={24} color="gray" />}
            onChangeText={setPhone}
            value={phone}
            keyboardType="phone-pad"
          />
        </>
      )}
      <Input
        placeholder="Email"
        leftIcon={<Icon name="email" size={24} color="gray" />}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <Input
        placeholder="Password"
        leftIcon={<Icon name="lock" size={24} color="gray" />}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button
        title={isSignUp ? "Sign Up" : "Sign In"}
        onPress={handleSubmit}
        containerStyle={styles.buttonContainer}
        raised
      />
      <Button
        title={
          isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"
        }
        type="clear"
        onPress={() => setIsSignUp(!isSignUp)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 16,
  },
});

export default AuthScreen;
