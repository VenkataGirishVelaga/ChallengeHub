import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";

import Screen from "@/components/Screen";
import TextField from "@/components/TextField";
import PrimaryButton from "@/components/PrimaryButton";
import AppText from "@/components/AppText";

import { createChallenge } from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

type Kind = "distance" | "checkin";

const DURATION_OPTIONS = [7, 30, 60, 100];

export default function CreateChallengeScreen() {
  const [kind, setKind] = useState<Kind>("distance");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // distance-type fields
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("km");

  // checkin-type fields
  const [durationDays, setDurationDays] = useState(30);

  async function handleCreate() {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in a title and description");
      return;
    }

    if (kind === "distance" && !target) {
      Alert.alert("Error", "Please set a target distance");
      return;
    }

    try {
      if (kind === "distance") {
        await createChallenge({
          title,
          description,
          type: "running",
          target: Number(target),
          unit,
          difficulty: "easy",
          xp_reward: 100,
          is_public: true,
        });
      } else {
        await createChallenge({
          title,
          description,
          type: "CHECKIN",
          target: durationDays,
          unit: "days",
          difficulty: "easy",
          xp_reward: 100,
          is_public: true,
        });
      }

      Alert.alert("Success", "Challenge Created!");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not create challenge");
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppText variant="title" style={styles.heading}>
          Create Challenge
        </AppText>

        <View style={styles.kindRow}>
          <Pressable
            style={[
              styles.kindButton,
              kind === "distance" && styles.kindButtonActive,
            ]}
            onPress={() => setKind("distance")}
          >
            <AppText
              style={
                kind === "distance"
                  ? styles.kindTextActive
                  : styles.kindText
              }
            >
              🏃 Distance
            </AppText>
          </Pressable>

          <Pressable
            style={[
              styles.kindButton,
              kind === "checkin" && styles.kindButtonActive,
            ]}
            onPress={() => setKind("checkin")}
          >
            <AppText
              style={
                kind === "checkin"
                  ? styles.kindTextActive
                  : styles.kindText
              }
            >
              🔥 Daily Check-in
            </AppText>
          </Pressable>
        </View>

        <AppText variant="caption" style={styles.kindHint}>
          {kind === "distance"
            ? "Progress is tracked automatically from your saved runs."
            : "Tap Check In once a day to build a streak — great for habits like meditation, reading, or pushups."}
        </AppText>

        <TextField
          label="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
        />

        {kind === "distance" ? (
          <>
            <TextField
              label="Target"
              value={target}
              keyboardType="numeric"
              onChangeText={setTarget}
            />

            <TextField
              label="Unit"
              value={unit}
              onChangeText={setUnit}
            />
          </>
        ) : (
          <>
            <AppText style={styles.durationLabel}>
              Duration
            </AppText>

            <View style={styles.durationRow}>
              {DURATION_OPTIONS.map((days) => (
                <Pressable
                  key={days}
                  style={[
                    styles.durationChip,
                    durationDays === days && styles.durationChipActive,
                  ]}
                  onPress={() => setDurationDays(days)}
                >
                  <AppText
                    style={
                      durationDays === days
                        ? styles.durationTextActive
                        : styles.durationText
                    }
                  >
                    {days} days
                  </AppText>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <PrimaryButton
          title="Create Challenge"
          onPress={handleCreate}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.lg,
  },

  heading: {
    marginBottom: SPACING.lg,
  },

  kindRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.sm,
  },

  kindButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },

  kindButtonActive: {
    backgroundColor: COLORS.primary,
  },

  kindText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  kindTextActive: {
    color: COLORS.white,
    fontWeight: "700",
  },

  kindHint: {
    marginBottom: SPACING.lg,
  },

  durationLabel: {
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },

  durationRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  durationChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  durationChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  durationText: {
    color: COLORS.text,
    fontWeight: "600",
  },

  durationTextActive: {
    color: COLORS.white,
    fontWeight: "700",
  },
});
