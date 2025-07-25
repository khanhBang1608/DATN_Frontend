<!-- src/views/DiscountList.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const discounts = ref([]);
const token = localStorage.getItem('token') || '';

const fetchDiscounts = async () => {
  const res = await axios.get('http://localhost:8080/api/admin/discount/findAll', {
    headers: { Authorization: `Bearer ${token}` },
  });
  discounts.value = res.data;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const deleteDiscount = async (id) => {
  if (confirm('Bạn có chắc muốn xoá mã giảm giá này?')) {
    await axios.delete(`http://localhost:8080/api/admin/discount/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchDiscounts();
  }
};

const goToForm = (id = null) => {
  if (id) {
    router.push(`/admin/discount/form/${id}`);
  } else {
    router.push(`/admin/discount/form`);
  }
};

onMounted(fetchDiscounts);
</script>

<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🎁 Quản lý Mã Giảm Giá</h2>
      <button class="btn btn-primary btn-icon" @click="goToForm()">➕ Thêm mã giảm giá</button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Giảm (%)</th>
            <th>Đơn tối thiểu</th>
            <th>Giảm tối đa</th>
            <th>Số lượng</th>
            <th>Hiệu lực</th>
            <th>Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="discounts.length === 0">
            <td colspan="8" class="text-center text-muted">Không có mã giảm giá nào.</td>
          </tr>
          <tr v-for="discount in discounts" :key="discount.discountId">
            <td><strong>{{ discount.discountCode }}</strong></td>
            <td>{{ discount.discountPercent }}%</td>
            <td>{{ formatCurrency(discount.minOrderAmount) }}</td>
            <td>{{ formatCurrency(discount.maxDiscountAmount) }}</td>
            <td>{{ discount.quantityLimit }}</td>
            <td>{{ formatDate(discount.startDate) }} - {{ formatDate(discount.endDate) }}</td>
            <td>
              <span :class="['badge', discount.status === 1 ? 'bg-success' : 'bg-secondary']">
                {{ discount.status ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
              </span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning m-1" @click="goToForm(discount.discountId)">✏️ Sửa</button>
              <button class="btn btn-sm btn-danger m-1" @click="deleteDiscount(discount.discountId)">🗑️ Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
