import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/user-missions`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const missionService = {
  // 내 미션 리스트 가져오기
  async fetchUserMissions() {
    const res = await axios.get(API_BASE, {
      headers: getAuthHeader(),
    });
    return res.data;
  },

  // 미션 완료 처리
  async completeMission(userMissionId) {
    const res = await axios.post(
      `${API_BASE}/${userMissionId}/complete`,
      {},
      { headers: getAuthHeader() }
    );
    return res.data;
  },
};
