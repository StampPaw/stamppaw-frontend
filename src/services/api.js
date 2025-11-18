import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // 필요 없음
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      token = token.replace(/(\r\n|\n|\r)/gm, "").trim();
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("[API Request] Authorization:", config.headers.Authorization);
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(
        "[API Error Response]",
        error.response.status,
        error.response.data
      );
      if (error.response.status === 401) {
        console.warn("[API] 401 Unauthorized - invalid token");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
