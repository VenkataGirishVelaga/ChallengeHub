import { StyleSheet, View, Pressable, Alert } from "react-native";
import { router } from "expo-router";

import Screen from "@/components/Screen";
import AppText from "@/components/AppText";
import { removeToken } from "@/services/authStorage";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { RADIUS } from "@/constants/radius";

export default function ProfileScreen() {
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await removeToken();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.card}>
          <AppText variant="title">
            👤 Profile
          </AppText>

          <AppText style={styles.subtitle}>
            Welcome to ChallengeHub
          </AppText>

          <Pressable
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <AppText style={styles.logoutText}>
              Logout
            </AppText>
          </Pressable>
        </View>
      </View>
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

  card: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
  },

  subtitle: {
    marginTop: SPACING.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },

  logoutButton: {
    width: "100%",
    backgroundColor: COLORS.error,
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    alignItems: "center",
  },

  logoutText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
});