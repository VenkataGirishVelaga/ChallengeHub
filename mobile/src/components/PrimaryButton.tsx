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
  ...props
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, style]}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    minHeight: 52,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  text: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});