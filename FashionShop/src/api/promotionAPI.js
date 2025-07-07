import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const promotionAPI = {
  async getPromotions(params = {}) {
    try {
      const response = await apiClient.get('/promotions', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'loi get');
    }
  },

  async getPromotionById(id) {
    try {
      const response = await apiClient.get(`/promotions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'loi get id');
    }
  },

  async createPromotion(promotionData) {
    try {
      const response = await apiClient.post('/promotions', promotionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'them that bai');
    }
  },

  async updatePromotion(id, promotionData) {
    try {
      const response = await apiClient.put(`/promotions/${id}`, promotionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'update that bai');
    }
  },

  async deletePromotion(id) {
    try {
      const response = await apiClient.delete(`/promotions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'xoa that bai');
    }
  },
};
