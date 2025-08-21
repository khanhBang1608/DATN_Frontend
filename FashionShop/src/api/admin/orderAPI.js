import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No JWT token found. Please log in.')
  config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getAllOrders = async (page = 0, size = 10) => {
  const res = await api.get(`/api/admin/orders?page=${page}&size=${size}`, {
    headers: { Accept: 'application/json' },
  })
  return res.data
}

export const getOrderById = async (orderId) => {
  const res = await api.get(`/api/admin/orders/${orderId}`, {
    headers: { Accept: 'application/json' },
  })
  return res.data
}

export async function approveOrderAPI(orderId) {
  const response = await api.put(`/api/admin/orders/${orderId}/approve`, null, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  })
  return response.data
}
export const updateOrder = async (orderId, orderData) => {
  const res = await api.put(`/api/admin/orders/${orderId}`, orderData, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  })
  return res.data
}
export async function downloadInvoicePDF(orderId) {
  try {
    const res = await api.get(`/api/admin/orders/${orderId}/download-pdf`, {
      responseType: 'blob', // để nhận file PDF
    })

    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url

    // Lấy tên file từ header
    const contentDisposition = res.headers['content-disposition']
    let fileName = `invoice-${orderId}.pdf`
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/)
      if (match) fileName = match[1]
    }

    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Download PDF Error:', error)
  }
}

export const approveReturnRequest = async (orderId) => {
  const res = await api.put(`/api/admin/orders/${orderId}/approve-return`, null, {
    headers: { Accept: 'application/json' },
  })
  return res.data
}

export const rejectReturnRequest = async (orderId) => {
  const res = await api.put(`/api/admin/orders/${orderId}/reject-return`, null, {
    headers: { Accept: 'application/json' },
  })
  return res.data
}

export const getReturnRequestByOrder = async (orderId) => {
  const res = await api.get(`/api/admin/orders/returns/${orderId}`, {
    headers: { Accept: 'application/json' },
  })
  return res.data
}

export const getAllReturnRequests = async () => {
  const res = await api.get(`/api/admin/orders/returns`, {
    headers: { Accept: 'application/json' },
  })
  return res.data
}

export const getOrdersByUserId = async (userId, page = 0, size = 8) => {
  try {
    const res = await api.get(`/api/admin/orders/user/${userId}?page=${page}&size=${size}`, {
      headers: { Accept: 'application/json' },
    })
    return res.data
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error)
    throw error
  }
}

export const syncGhnStatusAPI = async (orderId) => {
  const res = await api.post(`/api/admin/orders/${orderId}/sync-ghn-status`, null, {
    headers: { Accept: 'application/json' },
  })
  return res.data
}

export const printGhnLabel = async (orderId) => {
  const res = await api.get(`/api/admin/orders/${orderId}/ghn-label`, {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `ghn-label-${orderId}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}
