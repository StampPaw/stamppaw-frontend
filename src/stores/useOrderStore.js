import { create } from "zustand";
import orderService from "../services/orderService";

const useOrderStore = create((set) => ({
  order: null,
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

  fetchOrder: async () => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.getCart();
      set({ cart: res, loading: false });
    } catch (e) {
      set({ error: e });
    }
  },
}));

export default useOrderStore;
