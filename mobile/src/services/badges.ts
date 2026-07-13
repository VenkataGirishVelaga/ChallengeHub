import { api } from "./api";

export async function getMyBadges() {
  const response = await api.get("/badges/me");

  return response.data;
}
