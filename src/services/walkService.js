import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/walks`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const walkService = {
  // ================================
  // ✅ 산책 CRUD
  // ================================

  async startWalk({ lat, lng, timestamp }) {
    const response = await axios.post(
      `${API_BASE}/start`,
      { lat, lng, timestamp },
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async addPoint(walkId, { lat, lng, timestamp }) {
    await axios.post(
      `${API_BASE}/${walkId}/point`,
      { lat, lng, timestamp },
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
  },

  async endWalk(walkId, { lat, lng, timestamp }) {
    const response = await axios.post(
      `${API_BASE}/${walkId}/end`,
      { lat, lng, timestamp },
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async recordWalk(walkId, formData) {
    const response = await axios.put(
      `${API_BASE}/${walkId}/record`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async getWalkDetail(walkId) {
    const response = await axios.get(`${API_BASE}/${walkId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  },

  async deleteWalk(walkId) {
    const response = await axios.delete(`${API_BASE}/${walkId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  },

  // ================================
  // 내 산책 목록 조회
  // ================================
  async getMyWalks(page = 0, size = 12) {
    const response = await axios.get(`${API_BASE}/my`, {
      params: { page, size },
      headers: {
        ...getAuthHeader(),
      },
    });

    return {
      content: response.data.content || [],
      totalPages: response.data.totalPages,
      currentPage: response.data.number,
      last: response.data.last,
    };
  },

  // ================================
  // 다른 사용자 산책 목록 조회
  // ================================
  async getWalksByUser(userId, page = 0, size = 12) {
    const response = await axios.get(`${API_BASE}/user/${userId}`, {
      params: { page, size },
      headers: {
        ...getAuthHeader(),
      },
    });

    return {
      content: response.data.content || [],
      totalPages: response.data.totalPages,
      currentPage: response.data.number,
      last: response.data.last,
    };
  },
};
