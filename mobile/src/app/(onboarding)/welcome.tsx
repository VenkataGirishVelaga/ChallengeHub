import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import Screen from "@/components/Screen";
import Logo from "@/components/Logo";
import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";

import { SPACING } from "@/constants/spacing";

export default function WelcomeScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          <Logo />

          <AppText variant="title">
            ChallengeHub
          </AppText>

          <AppText style={styles.tagline}>
            Challenge Yourself.
          </AppText>

          <AppText style={styles.tagline}>
            Every Day.
          </AppText>

          <AppText style={styles.description}>
            Build better habits, complete exciting challenges,
            and compete with your friends.
          </AppText>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Get Started"
            onPress={() => router.push("/(onboarding)/onboarding")}
          />

          <SecondaryButton
            title="Sign In"
            onPress={() => router.push("/(auth)/login")}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: SPACING.lg,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  tagline: {
    marginTop: SPACING.sm,
  },

  description: {
    marginTop: SPACING.lg,
    textAlign: "center",
    maxWidth: 300,
  },

  actions: {
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
});