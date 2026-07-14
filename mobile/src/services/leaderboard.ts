import { api } from "./api";

export async function getGlobalLeaderboard() {
  const response = await api.get("/leaderboard");
  return response.data;
}

export async function getFriendsLeaderboard() {
  const response = await api.get("/leaderboard/friends");
  return response.data;
}
