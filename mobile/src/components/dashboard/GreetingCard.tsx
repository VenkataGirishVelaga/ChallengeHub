import { StyleSheet, View } from "react-native";

import AppText from "@/components/AppText";
import { SPACING } from "@/constants/spacing";

type GreetingCardProps = {
  name: string;
};

export default function GreetingCard({
  name,
}: GreetingCardProps) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <View style={styles.container}>
      <AppText variant="caption">
        {greeting} 👋
      </AppText>

      <AppText variant="title">
        {name}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
});