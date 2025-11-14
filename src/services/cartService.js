import api from "./api";

const cartService = {
  getCart: () => api.get("/cart"),
  createCart: (data) => api.post("/cart", data),
  updateItemQuantity: (data) => api.patch("/cart/item/quantity", data),
  deleteItem: (id) => api.delete(`/cart/item/${id}`),
};

export default cartService;
