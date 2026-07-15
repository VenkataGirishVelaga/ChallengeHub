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

export async function getActiveCheckinChallenge() {
  const response = await api.get(
    "/challenges/active/checkin"
  );

  return response.data;
}

export async function getActiveCheckinProgress() {
  const response = await api.get(
    "/challenges/progress/checkin"
  );

  return response.data;
}

export async function getAllActiveChallenges() {
  const response = await api.get(
    "/challenges/active/all"
  );

  return response.data;
}

export async function checkIn(
  challengeId: number,
  note?: string
) {
  const response = await api.post(
    `/challenges/${challengeId}/checkin`,
    { note: note || null }
  );

  return response.data;
}

export async function getCheckinHistory(challengeId: number) {
  const response = await api.get(
    `/challenges/${challengeId}/checkins`
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

export async function leaveChallenge(id: number) {
  const response = await api.delete(
    `/challenges/${id}/leave`
  );

  return response.data;
}

export async function deleteChallenge(id: number) {
  const response = await api.delete(
    `/challenges/${id}`
  );

  return response.data;
}
