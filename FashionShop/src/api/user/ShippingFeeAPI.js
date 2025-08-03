import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/user/shipping';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Gửi request để tính phí vận chuyển từ backend
 * @param {Object} data - Dữ liệu gửi đi gồm:
 * {
 *   addressId: number,
 *   weight: number,
 *   length: number,
 *   width: number,
 *   height: number,
 *   insuranceValue: number
 * }
 * @returns {Promise<Object>} - Kết quả phí vận chuyển từ GHN
 */
export const getShippingFee = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/fee`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API tính phí vận chuyển:', error);
    throw error.response?.data || 'Đã xảy ra lỗi không xác định';
  }
};
