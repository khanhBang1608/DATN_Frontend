import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user/address';

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

// Lấy danh sách địa chỉ
export const getAddressList = async () => {
  try {
    const response = await axios.get(`${API_URL}/list`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Thêm địa chỉ mới
export const addAddress = async (addressData) => {
  try {
    const response = await axios.post(
      `${API_URL}/add`,
      addressData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Cập nhật địa chỉ
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${addressId}`,
      addressData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Xóa địa chỉ
export const deleteAddress = async (addressId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${addressId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
