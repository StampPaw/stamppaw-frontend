import api from "./api";

// 회원가입
export const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

// 로그인
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  let token = response.data;

  if (!token) {
    throw new Error("로그인 응답이 비어있습니다.");
  }

  token = token.replace(/(\r\n|\n|\r)/gm, "").trim();

  if (token.startsWith("Bearer ")) {
    token = token.substring(7);
  }

  localStorage.setItem("token", token);

  console.log("[authService] 저장된 토큰:", token);

  return token;
};

// 로그아웃
export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
};

export const checkNickname = async (nickname) => {
  const response = await api.get("/auth/check-nickname", {
    params: { nickname },
  });
  return response.data; // true 중복 / false 가능
};
