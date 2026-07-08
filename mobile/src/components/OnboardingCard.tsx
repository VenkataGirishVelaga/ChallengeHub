import { StyleSheet, View } from "react-native";

import AppText from "@/components/AppText";

import { SPACING } from "@/constants/spacing";

type OnboardingCardProps = {
  emoji: string;
  title: string;
  description: string;
};

export default function OnboardingCard({
  emoji,
  title,
  description,
}: OnboardingCardProps) {
  return (
    <View style={styles.container}>
      <AppText style={styles.emoji}>{emoji}</AppText>

      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>

      <AppText style={styles.description}>
        {description}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },

  emoji: {
    fontSize: 90,
    marginBottom: SPACING.xl,
  },

  title: {
    textAlign: "center",
    marginBottom: SPACING.md,
  },

  description: {
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 300,
  },
});