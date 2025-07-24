<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const token = localStorage.getItem('token') || '';
const isEdit = ref(!!id);

// Form data
const form = ref({
  discountCode: '',
  description: '',
  discountPercent: null,
  minOrderAmount: null,
  maxDiscountAmount: null,
  quantityLimit: null,
  startDate: null,
  endDate: null,
  status: true,
});


// Lỗi từng trường
const errors = ref({});

// Load nếu là chỉnh sửa
const fetchDiscount = async () => {
  if (isEdit.value) {
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/discount/findById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      form.value = res.data;
    } catch (err) {
      iziToast.error({ title: 'Lỗi', message: 'Không tìm thấy mã giảm giá!', position: 'topRight' });
      router.push('/admin/discount');
    }
  }
};

// Submit form
const saveDiscount = async () => {
  errors.value = {}; // reset lỗi cũ
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
      iziToast.success({ title: 'Thành công', message: 'Đã cập nhật mã giảm giá!', position: 'topRight' });
    } else {
      await axios.post(`http://localhost:8080/api/admin/discount/create`, payload, config);
      iziToast.success({ title: 'Thành công', message: 'Đã tạo mã giảm giá mới!', position: 'topRight' });
    }

    router.push('/admin/discount');
  } catch (err) {
    if (err.response && err.response.status === 400 && Array.isArray(err.response.data)) {
      err.response.data.forEach(e => {
        const [field, msg] = e.split(': ');
        errors.value[field] = msg;
      });
      // iziToast.error({ title: 'Lỗi', message: 'Vui lòng kiểm tra lại thông tin.' });
    } else {
      iziToast.error({ title: 'Lỗi', message: 'Có lỗi xảy ra khi lưu mã giảm giá.', position: 'topRight'   });
    }
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
          <input v-model="form.discountCode" class="form-control" />
          <div v-if="errors.discountCode" class="text-danger">{{ errors.discountCode }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Phần trăm giảm (%)</label>
          <input type="number" v-model="form.discountPercent" class="form-control" />
          <div v-if="errors.discountPercent" class="text-danger">{{ errors.discountPercent }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Đơn hàng tối thiểu</label>
          <input type="number" v-model="form.minOrderAmount" class="form-control" />
          <div v-if="errors.minOrderAmount" class="text-danger">{{ errors.minOrderAmount }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Giảm tối đa</label>
          <input type="number" v-model="form.maxDiscountAmount" class="form-control" />
          <div v-if="errors.maxDiscountAmount" class="text-danger">{{ errors.maxDiscountAmount }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Số lượng giới hạn</label>
          <input type="number" v-model="form.quantityLimit" class="form-control" />
          <div v-if="errors.quantityLimit" class="text-danger">{{ errors.quantityLimit }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Trạng thái</label>
          <select v-model="form.status" class="form-select">
            <option :value="true">Đang hoạt động</option>
            <option :value="false">Ngừng hoạt động</option>
          </select>
          <div v-if="errors.status" class="text-danger">{{ errors.status }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày bắt đầu</label>
          <input type="date" v-model="form.startDate" class="form-control" />
          <div v-if="errors.startDate" class="text-danger">{{ errors.startDate }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày kết thúc</label>
          <input type="date" v-model="form.endDate" class="form-control" />
          <div v-if="errors.endDate" class="text-danger">{{ errors.endDate }}</div>
        </div>

        <div class="col-12">
          <label class="form-label fw-semibold text-dark">Mô tả</label>
          <textarea v-model="form.description" rows="3" class="form-control" placeholder="Mô tả mã giảm giá (tùy chọn)" />
          <div v-if="errors.description" class="text-danger">{{ errors.description }}</div>
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
.text-danger {
  font-size: 0.9rem;
}
</style>
