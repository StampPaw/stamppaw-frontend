import api from "./api";

// 조회
export const getAllCommunity = async (page = 0, size = 20) => {
  const response = await api.get("/community", {
    params: { page, size },
  });
  return response.data; // Page 객체 반환
};

// 글쓰기
export const createCommunity = async (formData) => {
  try {
    const response = await api.post("/community", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("[createCommunity] Error:", error.response || error);
    throw error;
  }
};

// 상세 조회
export const getCommunityDetail = async (id) => {
  const response = await api.get(`/community/${id}`);
  return response.data;
};

// 글 삭제
export const deleteCommunity = async (id) => {
  const response = await api.delete(`/community/${id}`);
  return response.data;
};

// 글 수정
export const updateCommunity = async (id, formData) => {
  try {
    const response = await api.put(`/community/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("[updateCommunity] Error:", error.response || error);
    throw error;
  }
};
