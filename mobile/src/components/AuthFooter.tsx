import { Pressable, StyleSheet, View } from "react-native";

import AppText from "./AppText";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

type AuthFooterProps = {
  text: string;
  actionText: string;
  onPress: () => void;
};

export default function AuthFooter({
  text,
  actionText,
  onPress,
}: AuthFooterProps) {
  return (
    <View style={styles.container}>
      <AppText>{text}</AppText>

      <Pressable onPress={onPress}>
        <AppText style={styles.action}>
          {actionText}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xl,
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.xs,
  },

  action: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});