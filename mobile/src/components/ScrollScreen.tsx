import React from "react";
import {
  ScrollView,
  StyleSheet,
  ScrollViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";

type ScrollScreenProps = ScrollViewProps & {
  children: React.ReactNode;
};

export default function ScrollScreen({
  children,
  contentContainerStyle,
  ...props
}: ScrollScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        {...props}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          contentContainerStyle,
        ]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    paddingBottom: 120,
  },
});