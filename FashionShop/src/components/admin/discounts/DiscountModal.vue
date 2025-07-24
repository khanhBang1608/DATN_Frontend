<!-- DiscountForm.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// Route và Router
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const token = localStorage.getItem('token')
const isEdit = ref(!!id);

// Dữ liệu form
const form = ref({
  discountCode: '',
  description: '',
  discountPercent: 0,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  quantityLimit: 0,
  startDate: '',
  endDate: '',
  status: 1,
});

// Load dữ liệu nếu là chỉnh sửa
const fetchDiscount = async () => {
  if (isEdit.value) {
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/discount/findById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      form.value = res.data;
    } catch (err) {
      console.error('❌ Không tìm thấy mã giảm giá:', err);
      alert('Không tìm thấy mã giảm giá!');
      router.push('/admin/discount');
    }
  }
};

// Submit form
const saveDiscount = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const payload = { ...form.value };

    if (isEdit.value) {
      await axios.put(`http://localhost:8080/api/admin/discount/update/${id}`, payload, config);
    } else {
      await axios.post(`http://localhost:8080/api/admin/discount/create`, payload, config);
    }

    router.push('/admin/discount');
  } catch (err) {
    console.error('❌ Lỗi khi lưu mã giảm giá:', err);
    alert('Đã xảy ra lỗi khi lưu mã giảm giá!');
  }
};

onMounted(fetchDiscount);
</script>

<template>
  <div class="container py-4">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4 text-primary">
        {{ isEdit ? '✏️ Sửa' : '➕ Thêm' }} Mã Giảm Giá
      </h2>

      <form @submit.prevent="saveDiscount" class="row g-3">
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Mã giảm giá</label>
          <input v-model="form.discountCode" class="form-control"  />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Phần trăm giảm (%)</label>
          <input type="number" v-model="form.discountPercent" min="0" max="100" class="form-control"  />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Đơn hàng tối thiểu</label>
          <input type="number" v-model="form.minOrderAmount" class="form-control"  />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Giảm tối đa</label>
          <input type="number" v-model="form.maxDiscountAmount" class="form-control"  />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Số lượng giới hạn</label>
          <input type="number" v-model="form.quantityLimit" class="form-control"  />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Trạng thái</label>
          <select v-model="form.status" class="form-select">
            <option :value="true">🟢 Đang hoạt động</option>
            <option :value="false">🔴 Ngừng hoạt động</option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày bắt đầu</label>
          <input type="date" v-model="form.startDate" class="form-control"  />
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày kết thúc</label>
          <input type="date" v-model="form.endDate" class="form-control"  />
        </div>

        <div class="col-12">
          <label class="form-label fw-semibold text-dark">Mô tả</label>
          <textarea v-model="form.description" rows="3" class="form-control" placeholder="Mô tả mã giảm giá (tùy chọn)" />
        </div>

        <div class="col-12 d-flex justify-content-between">
          <button type="button" class="btn btn-outline-secondary" @click="router.push('/admin/discount')">
            ⬅️ Quay lại
          </button>
          <button type="submit" class="btn btn-primary">
            {{ isEdit ? '💾 Lưu thay đổi' : '➕ Tạo mới' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: #fff;
}
</style>
