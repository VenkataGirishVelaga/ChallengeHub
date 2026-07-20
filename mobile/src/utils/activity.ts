/**
 * Distance-type challenges can track running, walking, or swimming —
 * but the tracker/summary/dashboard screens used to hardcode "Run"
 * everywhere. This centralizes the label/emoji per activity so a
 * swim or walk challenge reads correctly across the app instead of
 * always saying "Run".
 */

export type ActivityMeta = {
  noun: string; // "Run" | "Walk" | "Swim" — used in buttons like "Start Run"
  emoji: string;
  label: string; // "Morning Run" style heading
};

const ACTIVITIES: Record<string, ActivityMeta> = {
  running: { noun: "Run", emoji: "🏃", label: "Morning Run" },
  walking: { noun: "Walk", emoji: "🚶", label: "Morning Walk" },
  swimming: { noun: "Swim", emoji: "🏊", label: "Morning Swim" },
};

/**
 * Looks up display info for a challenge's activity `type`. Falls
 * back to "running" for anything unrecognized (including CHECKIN
 * challenges, which never reach this — and freeform sessions with
 * no active challenge at all).
 */
export function getActivityMeta(type?: string | null): ActivityMeta {
  if (!type) return ACTIVITIES.running;

  return ACTIVITIES[type.toLowerCase()] ?? ACTIVITIES.running;
}

export const ACTIVITY_OPTIONS: { value: string; label: string; emoji: string }[] = [
  { value: "running", label: "Running", emoji: "🏃" },
  { value: "walking", label: "Walking", emoji: "🚶" },
  { value: "swimming", label: "Swimming", emoji: "🏊" },
];
