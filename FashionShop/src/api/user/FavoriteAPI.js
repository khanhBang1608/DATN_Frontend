import axios from 'axios';

const FAVORITE_API_URL = 'http://localhost:8080/api/user/favorites';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Không tìm thấy mã thông báo JWT. Vui lòng đăng nhập.');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
};

/**
 *
 * @param {number} productId
 * @returns {Promise<string>}
 */
export const toggleFavorite = async (productId) => {
  try {
    const response = await axios.post(
      `${FAVORITE_API_URL}/${productId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 *
 * @returns {Promise<Array>}
 */
export const getFavorites = async () => {
  try {
    const response = await axios.get(
      `${FAVORITE_API_URL}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Kiểm tra sản phẩm có nằm trong danh sách yêu thích của người dùng không
 * @param {number} productId
 * @returns {Promise<boolean>}
 */
export const checkFavorite = async (productId) => {
  try {
    const response = await axios.get(
      `${FAVORITE_API_URL}/check/${productId}`,
      { headers: getAuthHeaders() }
    );
    return response.data; // true hoặc false
  } catch (error) {
    console.error("Lỗi checkFavorite:", error);
    return false; // fallback an toàn
  }
};
