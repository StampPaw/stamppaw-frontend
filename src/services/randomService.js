import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/random`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const randomService = {
  // 위치 업데이트
  async updateLocation({ lat, lng, timestampMillis, walkId }) {
    const res = await axios.post(
      `${API_BASE}/location/update`,
      { lat, lng, timestampMillis, walkId },
      { headers: { ...getAuthHeader() } }
    );
    return res.data;
  },

  // 랜덤 포인트 조회
  async fetchRandomPoints() {
    const res = await axios.get(`${API_BASE}/points`, {
      headers: getAuthHeader(),
    });
    return res.data; // [{lat, lng, visited}]
  },
};
