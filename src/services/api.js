import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

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
      const message = error.response.data?.message;

      if (status === 401 && message === "EXPIRED_TOKEN") {
        console.warn("[API] 토큰 만료 → 자동 로그아웃");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }
      
      if (status === 401) {
        console.warn("[API] 401 오류 발생 (토큰 만료 아님)");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
