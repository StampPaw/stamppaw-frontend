import api from "./api";

// 회원가입
export const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

// 로그인
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  const { token, user } = response.data;

  if (!token) {
    throw new Error("로그인 응답이 비어있습니다.");
  }

  if (token.startsWith("Bearer ")) {
    token = token.substring(7);
  }

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  console.log("[authService] 저장된 토큰:", token);

  return token;
};

// 로그아웃
export const logout = async () => {
<<<<<<< HEAD
  await api.post("/auth/logout");
=======
  await api.post("/auth/logout"); // 🔥 여기만 수정
>>>>>>> main
  localStorage.removeItem("token");
};

export const checkNickname = async (nickname) => {
  const response = await api.get("/auth/check-nickname", {
    params: { nickname },
  });
  return response.data; // true 중복 / false 가능
};
