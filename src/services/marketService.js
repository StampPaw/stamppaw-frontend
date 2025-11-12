import api from "./api";

const marketService = {
  searchProducts: async ({ keyword, page = 0, size = 12 }) => {
    const response = await api.post(`/api/market/products/search`, {
      keyword,
      page,
      size,
    });
    return response.data; // Page<ProductListRow>
  },

  getProductDetail: async (productId) => {
    const response = await api.get(`/api/market/products/${productId}`);
    return response.data; // ProductDetailResponse
  },

  getLatestMainImageUrls: async () => {
    const response = await api.get(`/api/market/products/latest`);
    console.log("✅ [marketService] latest response:", response.data);
    return response.data; // List<String>
  },

  getProductsByCategory: async (category) => {
    const response = await api.get(`/api/market/products/category`, {
      params: { category },
    });
    return response.data; // List<ProductListResponse>
  },
};

export default marketService;
