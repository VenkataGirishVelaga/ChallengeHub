import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

import { calculateDistance } from "@/utils/distance";
import { calculatePace } from "@/utils/pace";
import { calculateCalories } from "@/utils/calories";

export default function useRunTracker() {
  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);

  const [running, setRunning] = useState(false);

  const [distance, setDistance] = useState(0);

  const [seconds, setSeconds] = useState(0);

  const previousLocation =
    useRef<Location.LocationObject | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(null);

  async function startRun() {
    if (running) return;

    // Reset previous run
    setDistance(0);
    setSeconds(0);
    previousLocation.current = null;

    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Location permission is required."
      );
      return;
    }

    setRunning(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    locationSubscription.current =
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 1,
          timeInterval: 1000,
        },
        (newLocation) => {
          setLocation(newLocation);

          if (previousLocation.current) {
            const meters = calculateDistance(
              previousLocation.current.coords.latitude,
              previousLocation.current.coords.longitude,
              newLocation.coords.latitude,
              newLocation.coords.longitude
            );

            setDistance((prev) => prev + meters);
          }

          previousLocation.current = newLocation;
        }
      );
  }

  function finishRun() {
    locationSubscription.current?.remove();
    locationSubscription.current = null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setRunning(false);
  }

  useEffect(() => {
    return () => {
      locationSubscription.current?.remove();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const pace = calculatePace(distance, seconds);

  const calories = calculateCalories(distance);

  return {
    location,
    running,
    distance,
    seconds,
    pace,
    calories,
    startRun,
    finishRun,
  };
}