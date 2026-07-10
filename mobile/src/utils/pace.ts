export function calculatePace(
  distanceMeters: number,
  seconds: number
) {
  if (
    distanceMeters < 20 ||
    seconds < 10
  ) {
    return "--:--";
  }

  const paceSeconds =
    seconds / (distanceMeters / 1000);

  const minutes = Math.floor(
    paceSeconds / 60
  );

  const secs = Math.round(
    paceSeconds % 60
  );

  return `${minutes}:${secs
    .toString()
    .padStart(2, "0")}/km`;
}