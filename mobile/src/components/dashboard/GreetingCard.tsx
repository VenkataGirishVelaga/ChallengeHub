import { StyleSheet, View } from "react-native";

import AppText from "@/components/AppText";
import { SPACING } from "@/constants/spacing";
import { COLORS } from "@/constants/colors";

type GreetingCardProps = {
  name: string;
};

export default function GreetingCard({ name }: GreetingCardProps) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <View style={styles.container}>
      <AppText variant="label" color={COLORS.primary}>
        {greeting} 👋
      </AppText>

      <AppText variant="title">{name}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
});
