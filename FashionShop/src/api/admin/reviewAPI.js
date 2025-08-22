import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin/reviews';

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

export const getAllReviews = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
      params: {
        ratings: params.ratings ? params.ratings.join(',') : null,
        startDate: params.startDate,
        endDate: params.endDate,
        userFullName: params.userFullName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

export const getReviewById = async (reviewId) => {
  try {
    const response = await axios.get(`${API_URL}/${reviewId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch review');
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await axios.delete(`${API_URL}/${reviewId}`, { headers: getAuthHeaders() });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};

export const hideReview = async (reviewId, hide) => {
  try {
    await axios.patch(`${API_URL}/${reviewId}/hide`, null, {
      headers: getAuthHeaders(),
      params: { hide },
    });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to hide/unhide review');
  }
};
