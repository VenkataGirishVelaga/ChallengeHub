import { StyleSheet, View } from "react-native";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

type PaginationProps = {
  total: number;
  current: number;
};

export default function Pagination({
  total,
  current,
}: PaginationProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            current === index && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: SPACING.lg,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#475569",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
});