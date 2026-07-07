import { View, StyleSheet } from "react-native";

import Screen from "@/components/Screen";
import AppText from "@/components/AppText";

export default function OnboardingScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <AppText variant="title">
          Onboarding Screen
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});