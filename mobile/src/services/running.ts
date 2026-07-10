import axios from "axios";
import { api } from "./api";

export async function saveRun(
  distance: number,
  duration: number,
  calories: number
) {
  const payload = {
    distance,
    duration,
    calories,
  };

  console.log("PAYLOAD:", payload);

  try {
    console.log("Sending save request...");

    const response = await api.post("/runs", payload);

    console.log("Save completed");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        "RESPONSE:",
        JSON.stringify(error.response?.data, null, 2)
      );
    } else {
      console.log(error);
    }

    throw error;
  }
}