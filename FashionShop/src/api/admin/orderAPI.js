import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin/orders';
const RETURN_API = 'http://localhost:8080/api/admin/orders/returns';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No JWT token found. Please log in.');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
};

export const getAllOrders = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    return response.data; // trả về Page<OrderDTO> có cả content, totalPages, ...
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const getOrderById = async (orderId) => {
  const res = await axios.get(`${API_URL}/${orderId}`, { headers: getAuthHeaders() });
  return res.data;
};

export const updateOrder = async (orderId, orderData) => {
  const res = await axios.put(`${API_URL}/${orderId}`, orderData, { headers: getAuthHeaders() });
  return res.data;
};

export const downloadInvoicePDF = async (orderId) => {
  const res = await axios.get(`${API_URL}/${orderId}/invoice`, {
    headers: { ...getAuthHeaders(), 'Accept': 'application/pdf' },
    responseType: 'blob',
  });

  const blob = new Blob([res.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `hoa-don-${orderId}.pdf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const approveReturnRequest = async (orderId) => {
  const res = await axios.put(`${API_URL}/${orderId}/approve-return`, null, { headers: getAuthHeaders() });
  return res.data;
};

export const rejectReturnRequest = async (orderId) => {
  const res = await axios.put(`${API_URL}/${orderId}/reject-return`, null, { headers: getAuthHeaders() });
  return res.data;
};

export const getReturnRequestByOrder = async (orderId) => {
  const res = await axios.get(`${RETURN_API}/${orderId}`, { headers: getAuthHeaders() });
  return res.data;
};

export const getAllReturnRequests = async () => {
  const res = await axios.get(RETURN_API, { headers: getAuthHeaders() });
  return res.data;
};
