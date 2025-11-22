import api from "./api";

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post(`/order`, orderData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get(`/order`);
    return response.data;
  },

  //사용안함
  getOrderDetail: async (orderId) => {
    const response = await api.get(`/order/${orderId}/items`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/order/${orderId}/status`, { status });
    return response.data;
  },
};

export default orderService;
