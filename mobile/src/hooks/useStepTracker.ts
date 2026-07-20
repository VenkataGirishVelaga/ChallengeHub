import { useEffect, useRef, useState } from "react";
import { Pedometer } from "expo-sensors";
import { Alert } from "react-native";

// Rough estimate — same spirit as utils/calories.ts for running,
// just calibrated for walking's much lower per-unit energy cost.
// ~0.04 kcal per step is a commonly cited average.
function estimateWalkCalories(steps: number) {
  return Math.round(steps * 0.04);
}

export default function useStepTracker() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [walking, setWalking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    Pedometer.isAvailableAsync()
      .then(setAvailable)
      .catch(() => setAvailable(false));

    return () => {
      subscriptionRef.current?.remove();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  async function startWalk() {
    if (walking) return;

    const isAvailable = await Pedometer.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert(
        "Step counting unavailable",
        "This device doesn't support step counting."
      );
      return;
    }

    const { status } = await Pedometer.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Motion & fitness permission is required to count steps."
      );
      return;
    }

    setSteps(0);
    setSeconds(0);
    setWalking(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    subscriptionRef.current = Pedometer.watchStepCount((result) => {
      setSteps((prev) => prev + result.steps);
    });
  }

  function finishWalk() {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setWalking(false);
  }

  const calories = estimateWalkCalories(steps);

  return {
    available,
    walking,
    steps,
    seconds,
    calories,
    startWalk,
    finishWalk,
  };
}
