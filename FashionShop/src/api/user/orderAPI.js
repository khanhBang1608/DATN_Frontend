import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/user/orders';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const createOrder = async (orderData) => {
  const res = await axios.post(BASE_URL, orderData, { headers: getAuthHeaders() });
  return res.data;
};

export const getUserOrders = async () => {
  const res = await axios.get(BASE_URL, { headers: getAuthHeaders() });
  return res.data;
};

export const getOrderDetails = async (orderId) => {
  const res = await axios.get(`${BASE_URL}/${orderId}`, { headers: getAuthHeaders() });
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await axios.put(`${BASE_URL}/${orderId}/cancel`, null, { headers: getAuthHeaders() });
  return res.data;
};

export const requestReturn = async (orderId, formData) => {
  const res = await axios.post(`${BASE_URL}/${orderId}/return-request`, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const checkReturnStatus = async (orderId) => {
  const res = await axios.get(`${BASE_URL}/${orderId}/return-status`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
