import api from "./api";

// 내 반려견 목록 조회
export const getMyDogs = async () => {
  const response = await api.get("/dogs");
  return response.data;
};

// 반려견 등록 (multipart/form-data)
export const addDog = async (formData) => {
  const res = await api.post("/dogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 반려견 상세 조회 (기존 함수)
export const getDogDetail = async (dogId) => {
  const response = await api.get(`/dogs/${dogId}`);
  return response.data;
};

// ❗ DogDetailPage에서 getDogById 를 import 하므로 alias 추가
export const getDogById = getDogDetail;

// 반려견 수정 (multipart/form-data)
export const updateDog = async (dogId, formData) => {
  const res = await api.patch(`/dogs/${dogId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 반려견 삭제
export const deleteDog = async (dogId) => {
  const response = await api.delete(`/dogs/${dogId}`);
  return response.data;
};
