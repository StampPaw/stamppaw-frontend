import api from "./api";

// 🔥 리뷰 태그 전체 조회
export const getReviewTags = async () => {
  try {
    const res = await api.get("/companion/review/all-tags");
    return res.data;
  } catch (err) {
    console.error("[getReviewTags] Error:", err);
    throw err;
  }
};

// 🔥 리뷰 작성
export const writeReview = async (applyId, selectedTags) => {
  try {
    const res = await api.post(`/companion/review/${applyId}`, {
      tags: selectedTags,
    });
    return res.data;
  } catch (err) {
    console.error("[writeReview] Error:", err);
    throw err;
  }
};
