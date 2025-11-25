import api from "./api";

// ⭐ 댓글 조회 (상위 댓글 + 대댓글 포함)
export const getComments = async (communityId, page = 0, size = 10) => {
  const response = await api.get(`/comments/${communityId}`, {
    params: { page, size },
  });
  return response.data;
};

// ⭐ 댓글 작성 (일반 댓글 + 대댓글)
export const createComment = async (body) => {
  try {
    const response = await api.post("/comments", body);
    return response.data;
  } catch (error) {
    console.error("[createComment] Error:", error.response || error);
    throw error;
  }
};

// ⭐ 댓글 수정
export const updateComment = async (commentId, body) => {
  try {
    const response = await api.patch(`/comments/${commentId}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("[updateComment] Error:", error.response || error);
    throw error;
  }
};

// ⭐ 댓글 삭제
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("[deleteComment] Error:", error.response || error);
    throw error;
  }
};
