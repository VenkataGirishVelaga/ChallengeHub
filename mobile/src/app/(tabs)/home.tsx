import { View, StyleSheet } from "react-native";

import Screen from "@/components/Screen";
import AppText from "@/components/AppText";

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <AppText variant="title">
          Home
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