import axios from "axios";
import { api } from "./api";

export async function saveWalk(
  steps: number,
  duration: number,
  calories: number
) {
  const payload = {
    distance: steps,
    duration,
    calories,
    activity_type: "walking",
  };

  try {
    const response = await api.post("/runs", payload);
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
