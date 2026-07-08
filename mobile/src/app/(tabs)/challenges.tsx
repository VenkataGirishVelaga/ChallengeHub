import { View, StyleSheet } from "react-native";

import Screen from "@/components/Screen";
import AppText from "@/components/AppText";

export default function ChallengesScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <AppText variant="title">
          Challenges
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