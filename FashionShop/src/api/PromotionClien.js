import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/public/promotions';

const promotionApi = {
  // Lấy tất cả khuyến mãi đang hoạt động
  getActivePromotions: async () => {
    const response = await axios.get(`${API_BASE}/active`, { withCredentials: true });
    return response.data;
  },

  // Lấy chi tiết khuyến mãi theo ID (bao gồm sản phẩm áp dụng)
  getPromotionById: async (id) => {
    const response = await axios.get(`${API_BASE}/${id}`, { withCredentials: true });
    return response.data;
  },

  // Lấy danh sách khuyến mãi áp dụng cho product variant cụ thể
  getPromotionsByVariantId: async (variantId) => {
    const response = await axios.get(`${API_BASE}/product-variant/${variantId}`, { withCredentials: true });
    return response.data;
  }
};

export default promotionApi;
