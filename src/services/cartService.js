import api from "./api";

const cartService = {
  getCart: async () => {
    const response = await api.get(`/cart`);
    return response.data;
  },

  createCart: async (items) => {
    const response = await api.post(`/cart`, { items });
    return response.data;
  },

  updateItemQuantity: async ({ cartItemId, quantity }) => {
    const response = await api.patch(`/cart/item/quantity`, {
      cartItemId,
      quantity,
    });
    return response.data;
  },

  deleteItem: async (cartItemId) => {
    const response = await api.delete(`/cart/item/${cartItemId}`);
    return response.data;
  },
};

export default cartService;
