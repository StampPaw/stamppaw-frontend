// // src/services/dogService.js
// import api from "@/services/api";

// // 반려견 등록
// export const createDog = async (formData) => {
//   const response = await api.post("/api/dogs", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// };

// // 반려견 목록 조회
// export const getDogs = async () => {
//   const response = await api.get("/api/dogs");
//   return response.data;
// };

// // 반려견 수정
// export const updateDog = async (dogId, formData) => {
//   const response = await api.patch(`/api/dogs/${dogId}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// };

// // 반려견 삭제
// export const deleteDog = async (dogId) => {
//   const response = await api.delete(`/api/dogs/${dogId}`);
//   return response.data;
// };
