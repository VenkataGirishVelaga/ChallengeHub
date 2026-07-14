import { api } from "./api";

export async function getFriends() {
  const response = await api.get("/friends");
  return response.data;
}

export async function getPendingRequests() {
  const response = await api.get("/friends/pending");
  return response.data;
}

export async function searchUsers(query: string) {
  const response = await api.get("/friends/search", {
    params: { q: query },
  });
  return response.data;
}

export async function sendFriendRequest(userId: number) {
  const response = await api.post(`/friends/request/${userId}`);
  return response.data;
}

export async function acceptFriendRequest(friendshipId: number) {
  const response = await api.post(`/friends/${friendshipId}/accept`);
  return response.data;
}

export async function rejectFriendRequest(friendshipId: number) {
  const response = await api.post(`/friends/${friendshipId}/reject`);
  return response.data;
}

export async function removeFriend(friendId: number) {
  const response = await api.delete(`/friends/${friendId}`);
  return response.data;
}
