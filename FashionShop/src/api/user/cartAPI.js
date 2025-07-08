import axios from 'axios';

const API_URL = 'http://localhost:8080/api/cart';
const PRODUCT_API_URL = 'http://localhost:8080/api/products';

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

export const getCart = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const addToCart = async (productVariantId, quantity) => {
  try {
    const response = await axios.post(
      `${API_URL}/add`,
      { productVariantId, quantity },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateCartItem = async (cartDetailId, quantity) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${cartDetailId}`,
      { quantity },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const removeCartItem = async (cartDetailId) => {
  try {
    const response = await axios.delete(`${API_URL}/remove/${cartDetailId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const clearCart = async () => {
  try {
    const response = await axios.delete(`${API_URL}/clear`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getRelatedProducts = async () => {
  try {
    const response = await axios.get(`${PRODUCT_API_URL}/related`, {
      headers: getAuthHeaders(),
    });
    return response.data.map(product => ({
      id: product.productVariantId,
      name: product.productName,
      discountedPrice: product.price,
      originalPrice: product.originalPrice || product.price * 1.33,
      discount: product.discount || Math.round((1 - product.price / (product.originalPrice || product.price * 1.33)) * 100),
      imageUrl: product.imageUrl || 'https://via.placeholder.com/100x140',
      imageHoverUrl: product.imageHoverUrl || product.imageUrl || 'https://via.placeholder.com/100x140',
      size: product.size || 'S',
      color: product.color || 'Không xác định',
    }));
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
