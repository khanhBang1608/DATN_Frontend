// src/api/adminCategoryAPI.js
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/admin'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Không tìm thấy token đăng nhập')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

export const getAllCategories = async () => {
  try {
    const res = await axios.get(`${API_BASE}/category`, {
      headers: getAuthHeaders()
    })
    return res.data
  } catch (error) {
    console.error("Lỗi khi gọi API danh mục:", error)
    throw error
  }
}
