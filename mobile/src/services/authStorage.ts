import {
  getJSON,
  getItem,
  multiRemove,
  removeItem,
  setJSON,
  setItem,
} from "@/lib/storage";

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export async function saveToken(token: string) {
  await setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return getItem(TOKEN_KEY);
}

export async function removeToken() {
  await removeItem(TOKEN_KEY);
}

export async function saveRefreshToken(token: string) {
  await setItem(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function removeRefreshToken() {
  await removeItem(REFRESH_TOKEN_KEY);
}

export type StoredUser = {
  id: number;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
};

export async function saveUser(user: StoredUser) {
  await setJSON(USER_KEY, user);
}

export async function getUser() {
  return getJSON<StoredUser>(USER_KEY);
}

export async function removeUser() {
  await removeItem(USER_KEY);
}

export async function logout() {
  await multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
}