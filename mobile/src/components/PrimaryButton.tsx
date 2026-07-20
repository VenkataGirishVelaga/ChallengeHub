import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function PrimaryButton({
  title,
  style,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    minHeight: 54,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",

    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  buttonDisabled: {
    backgroundColor: COLORS.surfaceAlt,
    shadowOpacity: 0,
    elevation: 0,
  },

  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
