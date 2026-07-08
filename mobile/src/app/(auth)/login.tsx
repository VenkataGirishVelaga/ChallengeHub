import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AuthLayout from "@/components/AuthLayout";
import AppText from "@/components/AppText";
import AuthFooter from "@/components/AuthFooter";
import AuthHeader from "@/components/AuthHeader";
import PasswordField from "@/components/PasswordField";
import PrimaryButton from "@/components/PrimaryButton";
import TextField from "@/components/TextField";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import {
  validateEmail,
  validatePassword,
} from "@/utils/validators";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (emailValidation || passwordValidation) {
      return;
    }

    try {
      setLoading(true);

      // TODO:
      // FastAPI Login API

      console.log({
        email,
        password,
      });

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Back Button */}

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={26}
          color={COLORS.text}
        />
      </Pressable>

      {/* Header */}

      <AuthHeader
        title="Welcome Back 👋"
        subtitle="Sign in to continue your ChallengeHub journey."
      />

      {/* Email */}

      <TextField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={emailError}
        leftIcon={
          <Ionicons
            name="mail-outline"
            size={20}
            color={COLORS.textSecondary}
            style={{ marginRight: 10 }}
          />
        }
      />

      {/* Password */}

      <PasswordField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={passwordError}
      />

      {/* Forgot Password */}

      <Pressable
        style={styles.forgotPassword}
        onPress={() =>
          router.push("/(auth)/forgot-password")
        }
      >
        <AppText style={styles.forgotText}>
          Forgot Password?
        </AppText>
      </Pressable>

      {/* Login */}

      <PrimaryButton
        title={
          loading
            ? "Signing In..."
            : "Sign In"
        }
        onPress={handleLogin}
      />

      {/* Divider */}

      <View style={styles.divider}>
        <View style={styles.line} />

        <AppText
          variant="caption"
          style={styles.orText}
        >
          OR
        </AppText>

        <View style={styles.line} />
      </View>

      {/* Google */}

      <Pressable style={styles.googleButton}>
        <Ionicons
          name="logo-google"
          size={20}
          color="#DB4437"
          style={styles.googleIcon}
        />

        <AppText style={styles.googleText}>
          Continue with Google
        </AppText>
      </Pressable>

      {/* Footer */}

      <AuthFooter
        text="New to ChallengeHub?"
        actionText="Create Account"
        onPress={() =>
          router.push("/(auth)/register")
        }
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    marginBottom: SPACING.xl,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: SPACING.lg,
  },

  forgotText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.xl,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  orText: {
    marginHorizontal: SPACING.md,
  },

  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 16,

    paddingVertical: 16,
  },

  googleIcon: {
    marginRight: 10,
  },

  googleText: {
    fontWeight: "600",
  },
});