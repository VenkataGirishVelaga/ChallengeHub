import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppText from "./AppText";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
};

export default function PasswordField({
  label,
  value,
  onChangeText,
  error,
}: PasswordFieldProps) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>

      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          secureTextEntry={hidden}
          onChangeText={onChangeText}
          placeholder="Enter your password"
          placeholderTextColor={COLORS.textSecondary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        <Pressable onPress={() => setHidden(!hidden)}>
          <Ionicons
            name={hidden ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={COLORS.textSecondary}
          />
        </Pressable>
      </View>

      {error ? (
        <AppText style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },

  label: {
    marginBottom: SPACING.sm,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },

  focused: {
    borderColor: COLORS.primary,
  },

  input: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: 16,
    fontSize: 16,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  error: {
    marginTop: 4,
    color: COLORS.error,
    fontSize: 12,
  },
});