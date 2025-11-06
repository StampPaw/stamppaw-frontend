import api from "./api";

// ✅ 동행 목록 조회
export const getAllCompanions = async (page = 0, size = 10) => {
  const response = await api.get("/companion", {
    params: { page, size },
  });
  return response.data; // Page 객체 반환
};
