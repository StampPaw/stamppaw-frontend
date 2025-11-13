import api from "./api";

// 내 정보 조회
export const getMyInfo = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

// 내 정보 수정
export const updateUserInfo = async (formData) => {
  const res = await api.patch("/users/me", formData);
  return res.data;
};
