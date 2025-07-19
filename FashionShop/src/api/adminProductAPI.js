// src/api/ProductClient.js
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/admin'

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Lấy token mỗi lần gọi (đề phòng token thay đổi)
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getAllProducts = async () => {
  const res = await axiosInstance.get('/products')
  return res.data
}

export const getProductVariants = async (productId) => {
  const res = await axiosInstance.get(`/products/${productId}/variants`)
  return res.data
}

export const addProduct = async (product) => {
  const res = await axiosInstance.post('/products', product)
  return res.data
}

export const updateProduct = async (id, product) => {
  const res = await axiosInstance.put(`/products/${id}`, product)
  return res.data
}
