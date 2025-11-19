import api from "./api";

// 회원가입
export const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

// 로그인
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  let { token, user } = response.data;

  if (!token) {
    throw new Error("로그인 응답에 토큰이 없습니다.");
  }

  // "Bearer " 제거
  if (token.startsWith("Bearer ")) {
    token = token.substring(7);
  }

  // 토큰 + 유저 정보 저장
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  console.log("[authService] 저장된 토큰:", token);

  return token;
};

// 로그아웃
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.warn("서버 로그아웃 실패 (무시 가능)");
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// 닉네임 중복 체크
export const checkNickname = async (nickname) => {
  const response = await api.get("/auth/check-nickname", {
    params: { nickname },
  });

  return response.data; 
};
