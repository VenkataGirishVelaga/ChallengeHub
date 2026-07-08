import React from "react";
import { StyleSheet } from "react-native";

import AppText from "./AppText";
import { SPACING } from "@/constants/spacing";

export default function Logo() {
  return <AppText style={styles.logo}>🎯</AppText>;
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 88,
    marginBottom: SPACING.lg,
  },
});