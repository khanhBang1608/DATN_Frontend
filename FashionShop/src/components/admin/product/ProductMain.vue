<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const products = ref([])

const token = localStorage.getItem("token");

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/admin/products', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log("Response từ API:", response.data)
    products.value = response.data
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error)
  }
})

//chuyen trang khi bam vao nut bien the
const goToVariantList = (productId) => {
  router.push(`/admin/product/${productId}/variants`)
}

const goToAddForm = () => {
  router.push('/admin/product/form') // Trang thêm mới
}

const goToEditForm = (id) => {
  router.push(`/admin/product/form?id=${id}`) // Trang chỉnh sửa, truyền ID sản phẩm
}

const formatPrice = (value) => {
  if (!value) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const getMinPrice = (variants) => {
  if (!variants || variants.length === 0) return 0
  return Math.min(...variants.map(v => v.price))
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}
</script>
<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🛍️ Quản lý Sản phẩm</h2>
      <button class="btn btn-primary" @click="goToAddForm">
        + Thêm sản phẩm
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead class="table-dark">
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Biến thể</th>
            <th>Giá từ</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.productId">
            <td>{{ index + 1 }}</td> <!-- Cột STT -->
            <td>
              <img
              :src="product.variants?.[0]?.imageName ? `http://localhost:8080/images/${product.variants[0].imageName}` : 'https://via.placeholder.com/60'"
                alt="Ảnh sản phẩm"
                width="60"
              >
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.categoryName || '---' }}</td>
            <td>{{ product.variants ? product.variants.length : 0 }}</td>
            <td>{{ formatPrice(getMinPrice(product.variants)) }}</td>
            <td>
              <span :class="['badge', product.status === 1 ? 'bg-success' : 'bg-secondary']">
                {{ product.status === 1 ? 'Đang bán' : 'Ngừng bán' }}
              </span>
            </td>
            <td>{{ formatDate(product.dateCreated) }}</td>
            <td class="text-center">
               <button class="btn btn-sm btn-warning m-1" @click="goToEditForm(product.productId)">✏️ Sửa</button>
              <button class="btn btn-sm btn-info m-1" @click="goToVariantList(product.productId)">📦 Biến thể</button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
