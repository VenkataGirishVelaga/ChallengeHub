import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import Screen from "@/components/Screen";
import AuthHeader from "@/components/AuthHeader";
import TextField from "@/components/TextField";
import PasswordField from "@/components/PasswordField";
import PrimaryButton from "@/components/PrimaryButton";
import AuthFooter from "@/components/AuthFooter";

import { register } from "@/services/auth";

import { SPACING } from "@/constants/spacing";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long."
      );
      return;
    }
    try {
      setLoading(true);

      await register(name, email, password);

      Alert.alert(
        "Success",
        "Account created successfully!",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error?.response?.data?.detail ??
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <AuthHeader
          title="Create Account 🚀"
          subtitle="Join ChallengeHub and start your journey."
        />

        <TextField
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <TextField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
        />

        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <PrimaryButton
          title={loading ? "Creating Account..." : "Create Account"}
          onPress={handleRegister}
        />

        <AuthFooter
          text="Already have an account?"
          actionText="Login"
          onPress={() => router.replace("/(auth)/login")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 80,
  },
});