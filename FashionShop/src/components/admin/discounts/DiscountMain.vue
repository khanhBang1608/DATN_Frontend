<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Modal } from 'bootstrap';


const discounts = ref([]);
const form = ref(resetForm());
const isEdit = ref(false);
const currentId = ref(null);
let modalInstance = null;

const fetchDiscounts = async () => {
  const res = await axios.get('http://localhost:8080/api/admin/discount/findAll',
      {
        headers: {
          
          Authorization: `Bearer ${token}`,
        },
    });
  discounts.value = res.data;
};

const openModal = (discount = null) => {
  if (discount) {
    isEdit.value = true;
    currentId.value = discount.id;
    form.value = { ...discount };
  } else {
    isEdit.value = false;
    currentId.value = null;
    form.value = resetForm();
  }

  const modalEl = document.getElementById('discountModal');
  modalInstance = Modal.getOrCreateInstance(modalEl);
  modalInstance.show();
};

const saveDiscount = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:8080/api/admin/discount/update/${currentId.value}`, form.value,{
        
        headers: {
          'Content-Type': 'multipart/form-data' ,
          Authorization: `Bearer ${token}`,
        },
    });
    } else {
      await axios.post('http://localhost:8080/api/admin/discount/create', form.value,{
        
        headers: {
          'Content-Type': 'multipart/form-data' ,
          Authorization: `Bearer ${token}`,
        },
    });
    }
    modalInstance.hide();
    await fetchDiscounts();
  } catch (e) {
    console.error('Lỗi khi lưu mã giảm giá:', e);
    alert('Có lỗi xảy ra khi lưu.');
  }
};

const deleteDiscount = async (id) => {
  if (confirm('Bạn có chắc muốn xoá mã giảm giá này?')) {
    await axios.delete(`http://localhost:8080/api/admin/discount/delete/${id}`,{
        
        headers: {
          
          Authorization: `Bearer ${token}`,
        },
    });
    await fetchDiscounts();
  }
};

const resetForm = () => ({
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

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

onMounted(fetchDiscounts);
</script>


<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🎁 Quản lý Mã Giảm Giá</h2>
      <button class="btn btn-primary btn-icon" @click="openModal()">
        <i class="bi bi-plus-lg"></i> Thêm mã giảm giá
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle custom-table">
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
          <tr v-if="discounts.length == 0">
            <td colspan="8" class="text-center text-muted">Không có mã giảm giá nào.</td>
          </tr>
          <tr v-for="discount in discounts" :key="discount.id">
            <td><strong>{{ discount.discountCode }}</strong></td>
            <td>{{ discount.discountPercent }}%</td>
            <td>{{ formatCurrency(discount.minOrderAmount) }}</td>
            <td>{{ formatCurrency(discount.maxDiscountAmount) }}</td>
            <td>{{ discount.quantityLimit }}</td>
            <td>{{ formatDate(discount.startDate) }} - {{ formatDate(discount.endDate) }}</td>
            <td>
              <span :class="['badge', discount.status === 1 ? 'bg-success' : 'bg-secondary']">
                {{ discount.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
              </span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning m-1" @click="openModal(discount)">✏️ Sửa</button>
              <button class="btn btn-sm btn-danger m-1" @click="deleteDiscount(discount.id)">🗑️ Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Thêm/Sửa -->
    <div class="modal fade" id="discountModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="saveDiscount">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEdit ? '✏️ Sửa' : '➕ Thêm' }} Mã Giảm Giá</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body row g-3">
              <div class="col-md-6">
                <label class="form-label">Mã giảm giá</label>
                <input v-model="form.discountCode" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Phần trăm giảm (%)</label>
                <input type="number" v-model="form.discountPercent" class="form-control" required min="0" max="100" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Đơn hàng tối thiểu</label>
                <input type="number" v-model="form.minOrderAmount" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Giảm tối đa</label>
                <input type="number" v-model="form.maxDiscountAmount" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số lượng</label>
                <input type="number" v-model="form.quantityLimit" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.status" class="form-select">
                  <option :value="1">Đang hoạt động</option>
                  <option :value="0">Ngừng hoạt động</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Ngày bắt đầu</label>
                <input type="date" v-model="form.startDate" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Ngày kết thúc</label>
                <input type="date" v-model="form.endDate" class="form-control" required />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
              <button class="btn btn-primary" type="submit">{{ isEdit ? 'Lưu thay đổi' : 'Tạo mới' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

