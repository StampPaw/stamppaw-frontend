import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // ✅ 공통 prefix
  headers: {
    "Content-Type": "application/json",
  },
});

// 필요 시 interceptors (토큰 추가 등)
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
