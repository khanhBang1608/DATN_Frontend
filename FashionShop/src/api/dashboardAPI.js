import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardAPI = {
  async getStats() {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Loi stats');
    }
  },

  async getRecentOrders(limit = 10) {
    try {
      const response = await apiClient.get('/dashboard/orders', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Loi order');
    }
  },

  async getActiveUsers() {
    try {
      const response = await apiClient.get('/dashboard/users/active');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'loi user');
    }
  },
  async getMonthlyRevenue() {
    try {
      const response = await apiClient.get('/dashboard/stats/monthly-revenue');
      return response.data; // JSON [{ month: 1, revenue: 0.0 }, ...]
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi lấy doanh thu tháng');
    }
  },
};

