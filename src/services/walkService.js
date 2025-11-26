import api from "./api";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/walks`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const walkService = {
  async searchWalks(keyword, page = 0, size = 10) {
    if (!keyword || keyword.trim().length === 0)
      return { content: [], totalElements: 0 };

    const res = await api.post("/walks/search", {
      keyword: keyword.trim(),
      page,
      size,
    });
    return res.data;
  },

  async startWalk({ lat, lng, timestamp }) {
    const response = await api.post(
      `${API_BASE}/start`,
      { lat, lng, timestamp },
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  async addPoint(walkId, { lat, lng, timestamp }) {
    await api.post(
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
    const response = await api.post(
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
    const response = await api.put(`${API_BASE}/${walkId}/record`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getWalkDetail(walkId) {
    const response = await api.get(`${API_BASE}/${walkId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  },

  async deleteWalk(walkId) {
    const response = await api.delete(`${API_BASE}/${walkId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  },

  async getMyWalks(page = 0, size = 12) {
    const response = await api.get(`${API_BASE}/my`, {
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

  async getWalksByUser(userId, page = 0, size = 12) {
    const response = await api.get(`${API_BASE}/user/${userId}`, {
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
