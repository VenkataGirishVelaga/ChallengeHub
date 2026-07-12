import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.29.4:8000",
  headers: {
    "Content-Type": "application/json",
  },
});