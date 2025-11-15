import api from "./api";

const cartService = {
  getCart: async (userId) => {
    const response = await api.get(`/cart/`);
    return response.data;
  },

  createCart: async (items) => {
    const response = await api.post(`/cart/add`, { items });
    return response.data;
  },

  updateItemQuantity: async (cartItemId, quantity) => {
    const response = await api.patch(`/cart/item/${cartItemId}`, {
      quantity,
    });
    return response.data;
  },

  deleteItem: async (cartItemId) => {
    const response = await axios.delete(`${API_URL}/cart/item/${cartItemId}`);
    return response.data;
  },
};

export default cartService;
