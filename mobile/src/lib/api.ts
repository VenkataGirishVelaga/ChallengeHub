import axios from "axios";
import { router } from "expo-router";

import {
  getRefreshToken,
  getToken,
  logout,
  saveToken,
} from "@/services/authStorage";

// NOTE: update this to match whatever your PC's current LAN IP is
// (ipconfig / ifconfig) — it changes when you switch networks.
const BASE_URL = "http://192.168.1.4:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshingPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await refreshClient.post("/auth/refresh", {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;
    await saveToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      if (!refreshingPromise) {
        refreshingPromise = refreshAccessToken().finally(() => {
          refreshingPromise = null;
        });
      }

      const newAccessToken = await refreshingPromise;

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }

      await logout();
      router.replace("/(auth)/login");
    }

    return Promise.reject(error);
  }
);