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
