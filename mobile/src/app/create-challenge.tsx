import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import Screen from "@/components/Screen";
import TextField from "@/components/TextField";
import PrimaryButton from "@/components/PrimaryButton";
import AppText from "@/components/AppText";

import { createChallenge } from "@/services/challenge";

import { SPACING } from "@/constants/spacing";

export default function CreateChallengeScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [type, setType] =
    useState("running");
  const [target, setTarget] =
    useState("");
  const [unit, setUnit] =
    useState("km");

  async function handleCreate() {
    if (
      !title ||
      !description ||
      !target
    ) {
      Alert.alert(
        "Error",
        "Please fill all fields"
      );
      return;
    }

    try {
      await createChallenge({
        title,
        description,
        type,
        target: Number(target),
        unit,
        difficulty: "easy",
        xp_reward: 100,
        is_public: true,
      });

      Alert.alert(
        "Success",
        "Challenge Created!"
      );

      router.back();
    } catch (e) {
      Alert.alert(
        "Error",
        "Could not create challenge"
      );
    }
  }

  return (
    <Screen>
      <ScrollView>
        <AppText variant="title">
          Create Challenge
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

        <TextField
          label="Type"
          value={type}
          onChangeText={setType}
        />

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

        <PrimaryButton
          title="Create Challenge"
          onPress={handleCreate}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
});