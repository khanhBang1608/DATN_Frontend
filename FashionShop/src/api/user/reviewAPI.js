import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user/reviews';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No JWT token found. Please log in.');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
};

export const getReviewById = async (reviewId) => {
  try {
    const response = await axios.get(`${API_URL}/${reviewId}`, {
      headers: getAuthHeaders(), // ✅ thêm dòng này
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getReviewsByProductId = async (productId, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}`, {
      params: {
        ratings: filters.ratings ? filters.ratings.join(',') : null,
        hasImage: filters.hasImage || null,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi getReviewsByProductId:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};



export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(API_URL, reviewData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi createReview:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export const checkUserOrderForProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${productId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};


export const getProductIdByOrderDetailId = async (orderDetailId) => {
  try {
    const response = await axios.get(`${API_URL}/orderDetails/${orderDetailId}/product-id`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};


export const getReviewsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(`${API_URL}/${reviewId}`, reviewData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await axios.delete(`${API_URL}/${reviewId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
