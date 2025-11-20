import api from "./api";

const marketService = {
  searchProducts: async ({ keyword, page = 0, size = 12 }) => {
    const response = await api.post(`/market/products/search`, {
      keyword,
      page,
      size,
    });
    return response.data;
  },

  getProductDetail: async (productId) => {
    const response = await api.get(`/market/products/${productId}`);
    return response.data;
  },

  getLatestMainImageUrls: async () => {
    const response = await api.get(`/market/products/latest`);
    return response.data;
  },

  getProductsAllCategory: async () => {
    const response = await api.get(`/market/products/grouped`);
    return response.data;
  },

  getProductsByCategory: async (category) => {
    const encodedCategory = encodeURIComponent(category);
    const response = await api.get(`/market/products/category`, {
      params: { category: encodedCategory },
    });
    return response.data;
  },

  getCategory: async () => {
    const response = await api.get(`/market/products/categories`);
    return response.data;
  },
};

export default marketService;
