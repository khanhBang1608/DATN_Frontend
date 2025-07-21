<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const token = localStorage.getItem("token")

const form = ref({
  code: '',
  description: '',
  discountAmount: 0,
  startDate: '',
  endDate: '',
  status: true
})

const isEdit = ref(false)
const id = route.params.id

const fetchPromotionById = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/admin/promotions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const promo = res.data
    form.value = {
      ...promo,
      startDate: promo.startDate?.split('T')[0],
      endDate: promo.endDate?.split('T')[0]
    }
    isEdit.value = true
  } catch (err) {
    alert('Không tìm thấy khuyến mãi cần sửa.')
    router.push('/admin/promotion')
  }
}

const createPromotion = async () => {
  if (form.value.startDate > form.value.endDate) {
    alert('Ngày bắt đầu phải trước ngày kết thúc!')
    return
  }

  try {
    await axios.post('http://localhost:8080/api/admin/promotions', form.value, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    alert('Thêm khuyến mãi thành công')
    router.push('/admin/promotion')
  } catch (err) {
    alert('Lỗi khi thêm khuyến mãi')
  }
}

const updatePromotion = async () => {
  if (form.value.startDate > form.value.endDate) {
    alert('Ngày bắt đầu phải trước ngày kết thúc!')
    return
  }

  try {
    await axios.put(`http://localhost:8080/api/admin/promotions/${id}`, form.value, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    alert('Cập nhật khuyến mãi thành công')
    router.push('/admin/promotion')
  } catch (err) {
    alert('Lỗi khi cập nhật khuyến mãi')
  }
}

const cancelEdit = () => {
  router.push('/admin/promotion')
}

onMounted(() => {
  if (id) {
    fetchPromotionById()
  }
})
</script>

<template>
  <div class="card p-4 mb-4 shadow rounded bg-white">
    <div class="card-header bg-dark text-white rounded mb-3">
      <h5 class="mb-0">
        {{ isEdit ? '✏️ Sửa Khuyến mãi' : '➕ Thêm Khuyến mãi' }}
      </h5>
    </div>

    <form @submit.prevent="isEdit ? updatePromotion() : createPromotion()">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Tên chương trình</label>
          <input type="text" class="form-control" v-model="form.code" required />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Giảm giá (VNĐ)</label>
          <input type="number" class="form-control" v-model="form.discountAmount" required min="1000" />
        </div>

        <div class="col-md-12">
          <label class="form-label fw-semibold text-dark">Mô tả</label>
          <textarea class="form-control" rows="3" v-model="form.description"></textarea>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày bắt đầu</label>
          <input type="date" class="form-control" v-model="form.startDate" required />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày kết thúc</label>
          <input type="date" class="form-control" v-model="form.endDate" required />
        </div>

        <!-- Trạng thái -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Trạng thái</label>
          <select class="form-select" v-model="form.status">
            <option :value="true">Đang hoạt động</option>
            <option :value="false">Ngừng hoạt động</option>
          </select>
        </div>

        <div class="col-12 d-flex justify-content-end gap-2">
          <button type="submit" class="btn btn-success">
            <i class="bi" :class="isEdit ? 'bi-pencil-square' : 'bi-check-circle'"></i>
            {{ isEdit ? 'Cập nhật' : 'Lưu' }}
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="cancelEdit">
            <i class="bi bi-x-circle"></i> Hủy
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
