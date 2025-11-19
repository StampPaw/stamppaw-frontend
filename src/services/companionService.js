import api from "./api";

// ✅ 동행 목록 조회
export const getAllCompanions = async (page = 0, size = 10) => {
  const response = await api.get("/companion", {
    params: { page, size },
  });
  return response.data; // Page 객체 반환
};

// 동행 글쓰기
export const createCompanion = async (formData) => {
  try {
    const response = await api.post("/companion", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("[createCompanion] Error:", error.response || error);
    throw error;
  }
};

// 상세 조회
export const getCompanionDetail = async (id) => {
  const response = await api.get(`/companion/${id}`);
  return response.data;
};

// 동행 신청
export const applyCompanion = async (id) => {
  const response = await api.post(`/companion/${id}/apply`);
  return response.data;
};

// 신청 목록 불러오기 (작성자 전용)
export const getApplyList = async (id) => {
  const response = await api.get(`/companion/${id}/apply/manage`);
  return response.data;
};

// 신청 상태 변경 (수락/거절)
export const updateApplyStatus = async (id, applyId, status) => {
  const response = await api.put(`/companion/${id}/apply/status/${applyId}`, {
    status,
  });
  return response.data;
};

// 모집 상태 변경
export const updateCompanionStatus = async (id, status) => {
  const response = await api.put(`/companion/${id}`, { status });
  return response.data;
};

// 동행 글 삭제
export const deleteCompanion = async (id) => {
  const response = await api.delete(`/companion/${id}`);
  return response.data;
};

// 동행 글 수정
export const updateCompanion = async (id, formData) => {
  try {
    const response = await api.put(`/companion/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("[updateCompanion] Error:", error.response || error);
    throw error;
  }
};
