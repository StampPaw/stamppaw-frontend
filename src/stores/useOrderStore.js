import { create } from "zustand";
import orderService from "../services/orderService";

const useOrderStore = create((set, get) => ({
  order: null,
  orderDetail: {},
  orders: [],
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
  getUserOrders: async () => {
    set({ loading: true, error: null });

    try {
      const data = await orderService.getUserOrders(0, get().size);

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
  fetchNextPage: async () => {
    if (!get().hasNext) return;

    const nextPage = get().page + 1;

    try {
      set({ loading: true });

      const data = await orderService.getUserOrders(nextPage, get().size);

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

  // 주문 상세 조회 :  사용안함
  getOrderDetail: async (orderId) => {
    set({ loading: true, error: null });

    try {
      const data = await orderService.getOrderDetail(orderId);
      set((state) => ({
        orderDetails: {
          ...state.orderDetails,
          [orderId]: data,
        },
        loading: false,
      }));

      return data;
    } catch (e) {
      set({ error: e, loading: false });
      throw e;
    }
  },
}));

export default useOrderStore;
