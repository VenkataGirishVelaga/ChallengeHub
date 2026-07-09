import {
  getItem,
  removeItem,
  setItem,
} from "@/lib/storage";

const ONBOARDING_KEY = "onboarding_completed";

export async function completeOnboarding() {
  await setItem(ONBOARDING_KEY, "true");
}

export async function hasCompletedOnboarding() {
  const value = await getItem(ONBOARDING_KEY);
  return value === "true";
}

export async function clearOnboarding() {
  await removeItem(ONBOARDING_KEY);
}