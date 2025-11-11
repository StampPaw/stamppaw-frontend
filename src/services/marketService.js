import api from "./api";

const marketService = {
  // 🔍 상품 검색 (페이지네이션 포함) - POST
  searchProducts: async ({ keyword, page = 0, size = 12 }) => {
    const response = await api.post(`/api/market/products/search`, {
      keyword,
      page,
      size,
    });
    return response.data; // Page<ProductListRow>
  },

  // 📄 상품 상세 조회
  getProductDetail: async (productId) => {
    const response = await api.get(`/api/market/products/${productId}`);
    return response.data; // ProductDetailResponse
  },

  // 🆕 최신 상품 메인 이미지 URL 목록 조회
  getLatestMainImageUrls: async () => {
    const response = await api.get(`/api/market/products/latest`);
    console.log("✅ [marketService] latest response:", response.data);
    return response.data; // List<String>
  },

  // 🗂️ 카테고리별 상품 조회
  getProductsByCategory: async (category) => {
    const response = await api.get(`/api/market/products/category`, {
      params: { category },
    });
    return response.data; // List<ProductListResponse>
  },
};

export default marketService;
