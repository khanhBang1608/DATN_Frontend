import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/user/orders';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
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

export const createOrder = async (orderData) => {
  try {
    const res = await axios.post(BASE_URL, orderData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Không thể tạo đơn hàng.');
  }
};

export const syncGhnStatus = async (orderId) => {
  try {
    const res = await axios.post(`${BASE_URL}/${orderId}/sync-ghn-status`, null, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Không thể đồng bộ trạng thái GHN.');
  }
};
