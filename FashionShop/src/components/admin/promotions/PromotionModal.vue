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

// Lưu lỗi từng trường
const fieldErrors = ref({})
const generalErrors = ref([])

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

// Phân tích lỗi từ backend theo từng field
const parseErrors = (errors) => {
  const map = {}
  generalErrors.value = []

  for (const msg of errors) {
    if (msg.includes('Mã khuyến mãi')) map.code = msg
    else if (msg.includes('Mô tả')) map.description = msg
    else if (
      msg.includes('phần trăm') ||
      msg.includes('giảm giá') ||
      msg.includes('lớn hơn') ||
      msg.includes('vượt quá')
    ) map.discountAmount = msg
    else if (msg.includes('bắt đầu')) map.startDate = msg
    else if (msg.includes('kết thúc')) map.endDate = msg
    else if (msg.includes('Trạng thái')) map.status = msg
    else generalErrors.value.push(msg)
  }

  fieldErrors.value = map
}

// Gọi khi có lỗi từ backend
const handleErrors = (err) => {
  fieldErrors.value = {}
  generalErrors.value = []

  if (err.response && err.response.data) {
    const data = err.response.data
    if (Array.isArray(data)) {
      parseErrors(data)
    } else {
      generalErrors.value.push(data)
    }
  } else {
    generalErrors.value.push('Đã xảy ra lỗi không xác định.')
  }
}

const createPromotion = async () => {
  fieldErrors.value = {}
  generalErrors.value = []

  if (form.value.startDate > form.value.endDate) {
    fieldErrors.value.startDate = 'Ngày bắt đầu phải trước ngày kết thúc.'
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
    handleErrors(err)
  }
}

const updatePromotion = async () => {
  fieldErrors.value = {}
  generalErrors.value = []

  if (form.value.startDate > form.value.endDate) {
    fieldErrors.value.startDate = 'Ngày bắt đầu phải trước ngày kết thúc.'
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
    handleErrors(err)
  }
}

const cancelEdit = () => {
  router.push('/admin/promotion')
}

onMounted(() => {
  if (id) fetchPromotionById()
})
</script>

<template>
  <div class="card p-4 mb-4 shadow rounded bg-white">
    <div class="card-header bg-dark text-white rounded mb-3">
      <h5 class="mb-0">{{ isEdit ? '✏️ Sửa Khuyến mãi' : '➕ Thêm Khuyến mãi' }}</h5>
    </div>

    <!-- Lỗi tổng quát -->
    <div v-if="generalErrors.length" class="alert alert-danger">
      <ul class="mb-0">
        <li v-for="(e, i) in generalErrors" :key="i">{{ e }}</li>
      </ul>
    </div>

    <form @submit.prevent="isEdit ? updatePromotion() : createPromotion()">
      <div class="row g-3">
        <!-- Tên chương trình -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Tên chương trình</label>
          <input type="text" class="form-control" v-model="form.code" />
          <small v-if="fieldErrors.code" class="text-danger">{{ fieldErrors.code }}</small>
        </div>

        <!-- Giảm giá (%) -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Giảm giá (%)</label>
          <input type="number" class="form-control" v-model="form.discountAmount" />
          <small v-if="fieldErrors.discountAmount" class="text-danger">{{ fieldErrors.discountAmount }}</small>
        </div>

        <!-- Mô tả -->
        <div class="col-md-12">
          <label class="form-label fw-semibold text-dark">Mô tả</label>
          <textarea class="form-control" rows="3" v-model="form.description"></textarea>
          <small v-if="fieldErrors.description" class="text-danger">{{ fieldErrors.description }}</small>
        </div>

        <!-- Ngày bắt đầu -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày bắt đầu</label>
          <input type="date" class="form-control" v-model="form.startDate" />
          <small v-if="fieldErrors.startDate" class="text-danger">{{ fieldErrors.startDate }}</small>
        </div>

        <!-- Ngày kết thúc -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày kết thúc</label>
          <input type="date" class="form-control" v-model="form.endDate" />
          <small v-if="fieldErrors.endDate" class="text-danger">{{ fieldErrors.endDate }}</small>
        </div>

        <!-- Trạng thái -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Trạng thái</label>
          <select class="form-select" v-model="form.status">
            <option :value="true">Đang hoạt động</option>
            <option :value="false">Ngừng hoạt động</option>
          </select>
          <small v-if="fieldErrors.status" class="text-danger">{{ fieldErrors.status }}</small>
        </div>

        <!-- Nút hành động -->
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
