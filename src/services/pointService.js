import api from "./api";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/points`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const pointService = {
  // 누적 포인트 합계
  async getTotal() {
    const res = await api.get(`${API_BASE}/total`, {
      headers: getAuthHeader(),
    });
    return res.data;
  },

  // 포인트 내역
  async getHistory() {
    const res = await api.get(API_BASE, {
      headers: getAuthHeader(),
    });
    // [{ id, amount, reason }]
    return res.data;
  },
};
