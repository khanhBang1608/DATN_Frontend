import axios from 'axios';
import qs from 'qs';
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

// Các hàm hiện có trong reviewAPI.js
export const getReviewById = async (reviewId) => {
  try {
    const response = await axios.get(`${API_URL}/${reviewId}`, {
      headers: getAuthHeaders(),
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
        ratings: filters.ratings,
        hasImage: filters.hasImage || null,
      },
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi getReviewsByProductId:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export const createReview = async (formData) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/user/reviews',
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
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

export const getReviewsByCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
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

export const getProductIdByOrderDetailId = async (orderDetailId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/user/reviews/orderDetails/${orderDetailId}/product-id`,
      { headers: getAuthHeaders() }
    );
    return response.data.productId;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const checkReviewsForOrderDetails = async (orderDetailIds) => {
  try {
    const response = await axios.post(
      `${API_URL}/orderDetails/check-reviews`,
      orderDetailIds,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi checkReviewsForOrderDetails:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const checkReviewByOrderDetailId = async (orderDetailId) => {
  try {
    const response = await axios.get(
      `${API_URL}/orderDetails/${orderDetailId}`,
      { headers: getAuthHeaders() }
    );
    return response.data.reviewed;
  } catch (error) {
    console.error('Lỗi checkReviewByOrderDetailId:', error);
    throw error.response?.data || { message: error.message };
  }
};
