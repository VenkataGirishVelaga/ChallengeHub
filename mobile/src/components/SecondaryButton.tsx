import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";

import AppText from "./AppText";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

interface SecondaryButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function SecondaryButton({
  title,
  ...props
}: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.button}
      {...props}
    >
      <AppText style={styles.text}>{title}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: SPACING.md,
    alignItems: "center",
  },

  text: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});