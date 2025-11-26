import api from "./api";

const BASE = import.meta.env.VITE_API_BASE_URL; 
const API_BASE = `${BASE}/badges`;

export const badgeService = {
  async getMyBadges() {
    const res = await api.get(`${API_BASE}`);
    return res.data;
  },

  async setRepresentative(badgeId) {
    const res = await api.post(`${API_BASE}/representative/${badgeId}`);
    return res.data;
  },

  async clearRepresentative() {
    const res = await api.post(`${API_BASE}/representative/clear`);
    return res.data;
  },
};
