export function calculateCalories(
  distanceMeters: number
) {
  return Math.round(
    (distanceMeters / 1000) * 60
  );
}