import api from "./api";

export const getMyInfo = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("[userService] getMyInfo error:", error.response?.data || error);
    throw error;
  }
};

export const updateUserInfo = async (userId, data) => {
  try {
    const response = await api.patch(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("[userService] updateUserInfo error:", error.response?.data || error);
    throw error;
  }
};
