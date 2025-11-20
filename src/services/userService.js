import api from "./api";

// 내 정보 조회
export const getMyInfo = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

// 다른 유저 정보 조회 (프로필 방문 시 사용)
export const getUserInfo = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

// 내 정보 수정 (이미지 + 닉네임 + 자기소개)
export const updateUserInfo = async (formData) => {
  const res = await api.patch("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
