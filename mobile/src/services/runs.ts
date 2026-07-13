import { api } from "./api";

export async function getRunHistory() {
  const response = await api.get("/runs");

  return response.data;
}

export async function getRunStats() {
  const response = await api.get("/runs/stats");

  return response.data;
}
