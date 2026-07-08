import { View, StyleSheet } from "react-native";

import Screen from "@/components/Screen";
import AuthHeader from "@/components/AuthHeader";
import TextField from "@/components/TextField";
import PrimaryButton from "@/components/PrimaryButton";

import { SPACING } from "@/constants/spacing";

export default function ForgotPasswordScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <AuthHeader
          title="Forgot Password"
          subtitle="We'll send you a reset link."
        />

        <TextField
          label="Email"
          placeholder="Enter your email"
        />

        <PrimaryButton
          title="Send Reset Link"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
});