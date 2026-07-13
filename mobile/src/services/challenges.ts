import { api } from "./api";

export async function getChallenges() {
  const response = await api.get("/challenges");
  return response.data;
}

export async function getActiveChallenge() {
  const response = await api.get(
    "/challenges/active"
  );

  return response.data;
}

export async function getActiveProgress() {
  const response = await api.get(
    "/challenges/progress"
  );

  return response.data;
}
export async function createChallenge(challenge: any) {
  const response = await api.post(
    "/challenges",
    challenge
  );

  return response.data;
}

export async function joinChallenge(id: number) {
  const response = await api.post(
    `/challenges/${id}/join`
  );

  return response.data;
}