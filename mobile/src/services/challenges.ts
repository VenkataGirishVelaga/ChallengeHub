import { api } from "@/lib/api";

export async function getChallenges() {
  const response = await api.get("/challenges");
  return response.data;
}

export async function createChallenge(challenge: any) {
  const response = await api.post(
    "/challenges",
    challenge
  );

  return response.data;
}