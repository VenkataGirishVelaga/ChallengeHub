import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";

import Screen from "@/components/Screen";
import AppText from "@/components/AppText";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function SplashScreen() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      false
    );

    const timer = setTimeout(() => {
      router.replace("/(onboarding)/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Screen>
      <Animated.View style={[styles.container, animatedStyle]}>
        <AppText style={styles.logo}>🎯</AppText>

        <AppText variant="title">ChallengeHub</AppText>

        <AppText style={styles.tagline}>
          Challenge Yourself.
        </AppText>

        <AppText style={styles.tagline}>
          Every Day.
        </AppText>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },

  logo: {
    fontSize: 82,
    marginBottom: SPACING.lg,
  },

  tagline: {
    marginTop: SPACING.sm,
    color: COLORS.textSecondary,
  },
});