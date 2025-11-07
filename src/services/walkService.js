// src/services/walkService.js
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/walks`;


// 🔑 토큰 자동 가져오기 (localStorage 등에서)
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken"); // 로그인 시 저장된 토큰
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const walkService = {
  // ✅ 산책 시작
  async startWalk({ lat, lng }) {
    const response = await axios.post(
      `${API_BASE}/start`,
      { lat, lng },
      {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: false,
      }
    );
    
    return response.data;
  },

  // ✅ 좌표 추가 (3초마다)
  async addPoint(walkId, { lat, lng, timestamp }) {
    await axios.post(`${API_BASE}/${walkId}/point`, { lat, lng, timestamp });
  },

  // ✅ 산책 종료
  async endWalk(walkId, { lat, lng }) {
    const response = await axios.post(`${API_BASE}/${walkId}/end`, {
      lat,
      lng,
    });
    return response.data;
  },

  // ✅ 산책 기록 (메모·사진)
  async recordWalk(walkId, formData) {
    const response = await axios.put(`${API_BASE}/${walkId}/record`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // ✅ 산책 상세 조회
  async getWalkDetail(walkId) {
    const response = await axios.get(`${API_BASE}/${walkId}`);
    return response.data;
  },
};
