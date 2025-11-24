import { create } from "zustand";
import orderService from "../services/orderService";

const useOrderStore = create((set, get) => ({
  order: null,
  orderDetail: {},
  orders: [],
  allShippingStatus: [],
  page: 0,
  size: 3,
  hasNext: true,
  loading: false,
  error: null,

  createOrder: async (orderData) => {
    set({ loading: true, error: null });

    try {
      const data = await orderService.createOrder(orderData);
      set({ order: data, loading: false });
      return data;
    } catch (e) {
      set({ error: e, loading: false });
      throw e;
    }
  },

  // 사용자 주문내역 : 첫 페이지
  getUserOrders: async (orderStatus) => {
    set({ loading: true, error: null });

    try {
      const data = await orderService.getUserOrders(orderStatus, 0, get().size);

      set({
        orders: data.content,
        page: data.number,
        hasNext: !data.last,
        loading: false,
      });
    } catch (e) {
      set({ error: e, loading: false });
      throw e;
    }
  },

  // 사용자 주문내역 : 다음 페이지
  fetchNextPage: async (orderStatus) => {
    if (!get().hasNext) return;

    const nextPage = get().page + 1;

    try {
      set({ loading: true });
      const data = await orderService.getUserOrders(
        orderStatus,
        nextPage,
        get().size
      );

      set({
        orders: [...get().orders, ...data.content],
        page: data.number,
        hasNext: !data.last,
        loading: false,
      });
    } catch (e) {
      set({ error: e, loading: false });
      throw e;
    }
  },

  fetchOrderDetail: async (orderId) => {
    set({ loading: true, error: null });

    try {
      const data = await orderService.getOrderDetail(orderId);

      set({
        orderDetail: data,
        loading: false,
      });

      return data;
    } catch (e) {
      set({ error: e, loading: false });
      throw e;
    }
  },

  fetchAllShippingStatuses: async () => {
    try {
      const data = await orderService.fetchStatuses();
      set({ allShippingStatus: data });
    } catch (e) {
      console.error("배송 상태 로드 실패:", e);
    }
  },
}));

export default useOrderStore;
