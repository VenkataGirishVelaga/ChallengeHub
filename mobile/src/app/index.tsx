import { useEffect } from "react";
import { router } from "expo-router";

import { hasCompletedOnboarding } from "@/services/storage";
import { getToken } from "@/services/authStorage";

export default function Index() {
  useEffect(() => {
    async function check() {
      const completed = await hasCompletedOnboarding();

      if (!completed) {
        router.replace("/(onboarding)/welcome");
        return;
      }

      const token = await getToken();

      if (token) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/login");
      }
    }

    check();
  }, []);

  return null;
}