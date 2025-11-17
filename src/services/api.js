import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      token = token.replace(/(\r\n|\n|\r)/gm, "").trim();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 🔥 401 = 토큰 만료 or 유효하지 않음
      if (status === 401) {
        console.warn("[API] 401 Unauthorized - 만료된 토큰입니다.");

        // 1) 토큰 삭제
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 2) 로그인 페이지로 이동
        window.location.href = "/login";

        return;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
