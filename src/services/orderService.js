import api from "./api";

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post(`/order`, orderData);
    return response.data;
  },

  getUserOrders: async (orderStatus, page, size) => {
    const response = await api.get(`/order`, {
      params: {
        orderStatus: orderStatus,
        page: page,
        size: size,
      },
    });
    return response.data;
  },

  getOrderDetail: async (orderId) => {
    const response = await api.get(`/order/${orderId}/detail`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/order/${orderId}/status`, { status });
    return response.data;
  },

  fetchStatuses: async () => {
    const response = await api.get("/order/shipping");
    return response.data;
  },
};

export default orderService;
