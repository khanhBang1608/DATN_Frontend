// src/api/ProductClient.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("⚠️ Chưa đăng nhập. Không tìm thấy token.");
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
};

// ✅ Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${API_BASE}/products/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};


// ✅ Lấy biến thể theo sản phẩm
export const getProductVariants = async (productId) => {
  const res = await axios.get(`${API_BASE}/products/${productId}/variants`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ✅ Thêm sản phẩm
export const addProduct = async (product) => {
  const res = await axios.post(`${API_BASE}/products`, product, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// ✅ Cập nhật sản phẩm
export const updateProduct = async (id, product) => {
  const res = await axios.put(`${API_BASE}/products/${id}`, product, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
