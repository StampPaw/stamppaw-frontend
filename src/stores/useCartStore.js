import { create } from "zustand";
import cartService from "../services/cartService";

const useCartStore = create((set) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });

    try {
      const res = await cartService.getCart();
      set({ cart: res.data });
    } catch (e) {
      set({ error: e });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (items) => {
    set({ loading: true, error: null });

    try {
      const res = await cartService.createCart(items);
      set({ cart: res.data, loading: false });
      return res.data;
    } catch (e) {
      set({ error: e, loading: false });
      throw e;
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    try {
      await cartService.updateItemQuantity({
        cartItemId,
        quantity,
      });

      // 로컬 상태 반영, 안돼면 await useCartStore.getState().fetchCart(); //아래 deleteItem 도 동일
      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        },
      }));
    } catch (e) {
      set({ error: e });
    }
  },

  removeItem: async (cartItemId) => {
    try {
      await cartService.deleteItem(cartItemId);

      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.filter((i) => i.cartItemId !== cartItemId),
        },
      }));
    } catch (e) {
      set({ error: e });
    }
  },
}));

export default useCartStore;
