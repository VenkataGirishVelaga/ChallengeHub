import { create } from "axios";

export const api = create({
  baseURL: "http://192.168.1.4:8000",
  headers: {
    "Content-Type": "application/json",
  },
});