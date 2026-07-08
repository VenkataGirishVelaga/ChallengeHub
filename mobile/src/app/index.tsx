import { useEffect } from "react";
import { router } from "expo-router";

import { hasCompletedOnboarding } from "@/services/storage";

export default function Index() {
  useEffect(() => {
    async function check() {
      const completed = await hasCompletedOnboarding();

      if (completed) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/(onboarding)/welcome");
      }
    }

    check();
  }, []);

  return null;
}