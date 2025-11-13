import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      // 혹시 줄바꿈/공백 들어간 경우 제거
      token = token.replace(/(\r\n|\n|\r)/gm, "").trim();

      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers.Authorization = undefined;
    }

    console.log("[API Request] Authorization:", config.headers.Authorization);
    return config;
  },
  (error) => Promise.reject(error)
);

window.addEventListener("storage", () => {
  let token = localStorage.getItem("token");
  if (token) {
    token = token.replace(/(\r\n|\n|\r)/gm, "").trim();
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("[API] storage 이벤트 → axios 기본 Authorization 업데이트됨");
  } else {
    delete api.defaults.headers.common["Authorization"];
    console.log("[API] storage 이벤트 → Authorization 제거됨");
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("[API Error Response]", error.response.status, error.response.data);
    }

    if (error.response?.status === 401) {
      console.warn("[API] 401 Unauthorized - invalid token");
    }

    return Promise.reject(error);
  }
);

export default api;
