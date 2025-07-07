import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const discountAPI = {
  async getDiscounts(params = {}) {
    try {
      const response = await apiClient.get('/discounts', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Loi get discount');
    }
  },

  async getDiscountById(id) {
    try {
      const response = await apiClient.get(`/discounts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'loi get discount by id');
    }
  },

  async createDiscount(discountData) {
    try {
      const response = await apiClient.post('/discounts', discountData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'thm that bai');
    }
  },

  async updateDiscount(id, discountData) {
    try {
      const response = await apiClient.put(`/discounts/${id}`, discountData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'update that bai');
    }
  },

  async deleteDiscount(id) {
    try {
      const response = await apiClient.delete(`/discounts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'delete that bai');
    }
  },
};
