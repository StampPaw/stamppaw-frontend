import { create } from "zustand";
import marketService from "../services/marketService";

const useMarketStore = create((set) => ({
  products: [],
  productDetail: null,
  latestMainImages: [],
  categoryProducts: [],
  categories: [],

  loading: false,
  error: null,

  searchProducts: async (keyword, page = 0, size = 12) => {
    set({ loading: true, error: null });
    try {
      const result = await marketService.searchProducts({
        keyword,
        page,
        size,
      });
      set({
        products: result.content ?? result, // Page 반환 구조 안전 처리
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to search products",
        loading: false,
      });
    }
  },

  fetchProductDetail: async (productId) => {
    set({ loading: true, error: null });
    try {
      const detail = await marketService.getProductDetail(productId);
      set({ productDetail: detail, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch product detail",
        loading: false,
      });
    }
  },

  fetchLatestMainImages: async () => {
    set({ loading: true, error: null });
    try {
      const images = await marketService.getLatestMainImageUrls();
      set({ latestMainImages: images, loading: false });
      //console.log("✅ [useMarketStore] fetched images:", images);
    } catch (err) {
      //console.error("🔴 [useMarketStore] fetchLatestMainImages failed:", err);
      set({
        error:
          err.response?.data?.message ||
          "Failed to fetch latest product image list",
        loading: false,
      });
    }
  },

  fetchProductsByCategory: async () => {
    set({ loading: true, error: null });
    try {
      const list = await marketService.getProductsByCategory();
      set({ categoryProducts: list, loading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message || "Failed to fetch products by category",
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await marketService.getCategory();
      set({ categories: categories, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch categories",
        loading: false,
      });
    }
  },
}));

export default useMarketStore;
