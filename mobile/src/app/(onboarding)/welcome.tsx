import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { router } from "expo-router";

import Screen from "@/components/Screen";
import Logo from "@/components/Logo";
import AppText from "@/components/AppText";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";

import { SPACING } from "@/constants/spacing";

export default function WelcomeScreen() {
  useEffect(() => {}, []);

  return (
    <Screen>
      <View style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(800)}
          style={styles.content}
        >
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
            Build habits.
            Complete challenges.
            Compete with friends.
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(700)}
          style={styles.actions}
        >
          <PrimaryButton
            title="Get Started"
            onPress={() =>
              router.push("/(onboarding)/onboarding")
            }
          />

          <SecondaryButton
            title="Sign In"
            onPress={() =>
              router.push("/(auth)/login")
            }
          />
        </Animated.View>
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
    marginTop: SPACING.xs,
  },

  description: {
    marginTop: SPACING.lg,
    textAlign: "center",
    maxWidth: 260,
  },

  actions: {
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
});