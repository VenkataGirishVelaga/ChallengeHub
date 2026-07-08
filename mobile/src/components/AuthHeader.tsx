import { StyleSheet, View } from "react-native";

import AppText from "./AppText";

import { SPACING } from "@/constants/spacing";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <AppText variant="title">
        {title}
      </AppText>

      <AppText style={styles.subtitle}>
        {subtitle}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },

  subtitle: {
    marginTop: SPACING.sm,
  },
});