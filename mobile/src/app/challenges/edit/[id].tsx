import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import Screen from "@/components/Screen";
import TextField from "@/components/TextField";
import PrimaryButton from "@/components/PrimaryButton";
import AppText from "@/components/AppText";

import { updateChallenge } from "@/services/challenges";

import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/radius";
import { SPACING } from "@/constants/spacing";

export default function EditChallengeScreen() {
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    target: string;
    unit: string;
    isCheckin: string;
  }>();

  const challengeId = Number(params.id);
  const isCheckin = params.isCheckin === "true";

  const [title, setTitle] = useState(params.title ?? "");
  const [description, setDescription] = useState(params.description ?? "");
  const [target, setTarget] = useState(params.target ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in a title and description");
      return;
    }

    if (!target) {
      Alert.alert(
        "Error",
        isCheckin
          ? "Please set a target number of days"
          : "Please set a target"
      );
      return;
    }

    setSaving(true);

    try {
      await updateChallenge(challengeId, {
        title,
        description,
        target: Number(target),
      });

      Alert.alert("Saved", "Challenge updated.");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.detail || "Couldn't update that challenge."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText variant="title" style={styles.heading}>
          Edit Challenge
        </AppText>

        <AppText variant="caption" style={styles.hint}>
          The activity type and unit can't be changed once a challenge
          exists — only title, description, and target.
        </AppText>

        <TextField label="Title" value={title} onChangeText={setTitle} />

        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextField
          label={isCheckin ? "Target (days)" : `Target (${params.unit})`}
          value={target}
          onChangeText={setTarget}
          keyboardType="numeric"
        />

        <View style={styles.actions}>
          <PrimaryButton
            title={saving ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },

  heading: {
    marginBottom: SPACING.sm,
  },

  hint: {
    marginBottom: SPACING.lg,
    color: COLORS.textSecondary,
  },

  actions: {
    marginTop: SPACING.lg,
  },
});
