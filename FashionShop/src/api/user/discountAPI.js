import axios from 'axios'
const API_URL = 'http://localhost:8080/api/user/discount/available';
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
export const getDiscount = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
export const fetchAvailableDiscounts = () => {
  return axios.get('/api/user/discount/available')
}
