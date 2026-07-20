import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import AppText from "./AppText";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export default function TextField({
  label,
  error,
  leftIcon,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>

      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          error && styles.inputError,
        ]}
      >
        {leftIcon}

        <TextInput
          {...props}
          style={styles.input}
          placeholderTextColor={COLORS.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
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
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
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
    fontWeight: "600",
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
