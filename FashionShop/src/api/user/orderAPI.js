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
  try {
    const response = await axios.post(BASE_URL, orderData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to create order';
  }
};

export const getUserOrders = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to fetch orders';
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${orderId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to fetch order details';
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.put(`${BASE_URL}/${orderId}/cancel`, null, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to cancel order';
  }
};
