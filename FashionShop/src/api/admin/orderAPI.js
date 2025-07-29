import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin/orders';

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

export const getAllOrders = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch order');
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}`, orderData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update order');
  }
};

export const downloadInvoicePDF = async (orderId) => {
  const res = await axios.get(`${API_URL}/${orderId}/invoice`, {
    headers: {
      ...getAuthHeaders(),
      'Accept': 'application/pdf',
    },
    responseType: 'blob',
  });
  return res.data;
};
export const approveReturnRequest = async (orderId) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}/approve-return`, null, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error approving return request:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to approve return request';
  }
};

export const rejectReturnRequest = async (orderId) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}/reject-return`, null, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting return request:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to reject return request';
  }
};

