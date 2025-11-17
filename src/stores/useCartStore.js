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
      set({ cart: res, loading: false });
    } catch (e) {
      set({ error: e });
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
      await cartService.updateItemQuantity({ cartItemId, quantity });

      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.map((i) =>
            i.id === cartItemId
              ? {
                  ...i,
                  quantity,
                  subtotal: i.price * quantity,
                }
              : i
          ),
        },
      }));

      await useCartStore.getState().fetchCart();
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
          items: (state.cart.items || []).filter((i) => i.id !== cartItemId),
        },
      }));
    } catch (e) {
      set({ error: e });
    }
  },
}));

export default useCartStore;
