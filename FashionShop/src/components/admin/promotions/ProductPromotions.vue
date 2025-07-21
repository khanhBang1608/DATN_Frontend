<!-- src/views/admin/ProductPromotions.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const promotionId = route.params.promotionId

const promotions = ref([])
const token = localStorage.getItem('token')

const fetchPromotions = async () => {
  try {
      const res = await axios.get(`http://localhost:8080/api/admin/product-promotions/promotion/${promotionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    promotions.value = res.data
  } catch (err) {
    console.error('Lỗi khi lấy danh sách sản phẩm khuyến mãi:', err)
  }
}

const deletePromotion = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa liên kết này?')) return
  try {
    await axios.delete(`http://localhost:8080/api/admin/product-promotions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    promotions.value = promotions.value.filter(p => p.id !== id)
  } catch (err) {
    console.error('Lỗi xoá:', err)
  }
}

const goToAddForm = () => {
  router.push(`/admin/ProductPromotionForm/${promotionId}`)
}
onMounted(() => {
  fetchPromotions()
})

</script>

<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🎁 Danh sách Sản phẩm Khuyến mãi</h2>
      <button class="btn btn-primary" @click="goToAddForm">+ Thêm sản phẩm khuyến mãi</button>
    </div>

    <table class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Biến thể sản phẩm</th>
          <th>Giới hạn số lượng</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in promotions" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.productVariantId }}</td>
          <td>{{ item.quantityLimit }}</td>
          <td class="text-center">
            <!-- <button
              class="btn btn-sm btn-warning me-1"
              @click="router.push(`/admin/ProductPromotionForm/${promotionId}/${item.id}`)">
              ✏️ Sửa
            </button> -->
            <button class="btn btn-sm btn-danger" @click="deletePromotion(item.id)">🗑️ Xoá</button>
          </td>
        </tr>
        <tr v-if="promotions.length === 0">
          <td colspan="4" class="text-center text-white bg-dark">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
