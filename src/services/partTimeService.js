import api from "./api";

// 알바 목록 조회
export const getPartTimeList = async (page = 0, size = 20) => {
  const response = await api.get("/parttime", {
    params: { page, size },
  });
  return response.data;
};

// 알바 글쓰기
export const createPartTime = async (formData) => {
  try {
    const response = await api.post("/parttime", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("[createPartTime] Error:", error.response || error);
    throw error;
  }
};

// 알바 상세 조회
export const getPartTimeDetail = async (id) => {
  const response = await api.get(`/parttime/${id}`);
  return response.data;
};

// 알바 지원
export const applyPartTime = async (id) => {
  const response = await api.post(`/parttime/${id}/apply`);
  return response.data;
};

// 지원 목록 불러오기 (작성자 전용)
export const getPartTimeApplyList = async (id) => {
  const response = await api.get(`/parttime/${id}/apply/manage`);
  return response.data;
};

// 지원 상태 변경 (수락/거절)
export const updatePartTimeApplyStatus = async (id, applyId, status) => {
  const response = await api.put(`/parttime/${id}/apply/status/${applyId}`, {
    status,
  });
  return response.data;
};

// 모집 상태 변경
export const updatePartTimeStatus = async (id, status) => {
  const response = await api.put(`/parttime/${id}`, { status });
  return response.data;
};

// 알바 글 삭제
export const deletePartTime = async (id) => {
  const response = await api.delete(`/parttime/${id}`);
  return response.data;
};

// 알바 글 수정
export const updatePartTime = async (id, formData) => {
  try {
    const response = await api.patch(`/parttime/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("[updatePartTime] Error:", error.response || error);
    throw error;
  }
};
