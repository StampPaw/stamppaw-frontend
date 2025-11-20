import api from "./api";

// 팔로우 
export const followUser = async (userId) => {
  const res = await api.post(`/follows/${userId}`);
  return res.data;
};

// 언팔로우
export const unfollowUser = async (userId) => {
  const res = await api.delete(`/follows/${userId}`);
  return res.data;
};
