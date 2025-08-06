<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🎁 Quản lý Mã Giảm Giá</h2>
      <button class="btn btn-primary" @click="openModal()">+ Thêm mã giảm giá</button>
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
            <td colspan="8" class="text-center text-white fs-5 py-4">
              <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i> Không có
              mã giảm giá nào được tìm thấy.
            </td>
          </tr>
          <tr v-for="discount in discounts" :key="discount.discountId">
            <td>
              <strong>{{ discount.discountCode }}</strong>
            </td>
            <td>{{ discount.discountPercent }}%</td>
            <td>{{ formatCurrency(discount.minOrderAmount) }}</td>
            <td>{{ formatCurrency(discount.maxDiscountAmount) }}</td>
            <td>{{ discount.quantityLimit }}</td>
            <td>
              {{ formatDate(discount.startDate) }} - {{ formatDate(discount.endDate) }}
            </td>
            <td>
              <span
                :class="[
                  'badge text-light',
                  discount.status ? 'bg-success' : 'bg-danger',
                ]"
              >
                {{ discount.status ? "Đang hoạt động" : "Ngừng hoạt động" }}
              </span>
            </td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-warning m-1"
                @click="openModal(discount.discountId)"
              >
                ✏️ Sửa
              </button>
              <button
                class="btn btn-sm btn-danger m-1"
                @click="deleteDiscount(discount.discountId)"
              >
                🗑️ Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav v-if="totalPages > 1" class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 0 }">
            <button class="page-link" @click="fetchDiscounts(currentPage - 1)">«</button>
          </li>

          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page - 1 }"
          >
            <button class="page-link" @click="fetchDiscounts(page - 1)">
              {{ page }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
            <button class="page-link" @click="fetchDiscounts(currentPage + 1)">»</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? "Sửa" : "Thêm" }} Mã Giảm Giá</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <form @submit.prevent="saveDiscount">
            <div class="modal-body row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Mã giảm giá</label>
                <input
                  v-model="form.discountCode"
                  @input="clearError('discountCode')"
                  class="form-control"
                />
                <div v-if="errors.discountCode" class="text-danger">
                  {{ errors.discountCode }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Phần trăm giảm (%)</label>
                <input
                  v-model="form.discountPercent"
                  type="number"
                  @input="clearError('discountPercent')"
                  class="form-control"
                />
                <div v-if="errors.discountPercent" class="text-danger">
                  {{ errors.discountPercent }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Đơn hàng tối thiểu</label>
                <input
                  v-model="form.minOrderAmount"
                  type="number"
                  @input="clearError('minOrderAmount')"
                  class="form-control"
                />
                <div v-if="errors.minOrderAmount" class="text-danger">
                  {{ errors.minOrderAmount }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Giảm tối đa</label>
                <input
                  v-model="form.maxDiscountAmount"
                  type="number"
                  @input="clearError('maxDiscountAmount')"
                  class="form-control"
                />
                <div v-if="errors.maxDiscountAmount" class="text-danger">
                  {{ errors.maxDiscountAmount }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Số lượng giới hạn</label>
                <input
                  v-model="form.quantityLimit"
                  type="number"
                  @input="clearError('quantityLimit')"
                  class="form-control"
                />
                <div v-if="errors.quantityLimit" class="text-danger">
                  {{ errors.quantityLimit }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Trạng thái</label>
                <select v-model="form.status" class="form-select">
                  <option :value="true">Đang hoạt động</option>
                  <option :value="false">Ngừng hoạt động</option>
                </select>
                <div v-if="errors.status" class="text-danger">{{ errors.status }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Ngày bắt đầu</label>
                <input
                  v-model="form.startDate"
                  type="date"
                  @input="clearError('startDate')"
                  class="form-control"
                />
                <div v-if="errors.startDate" class="text-danger">
                  {{ errors.startDate }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Ngày kết thúc</label>
                <input
                  v-model="form.endDate"
                  type="date"
                  @input="clearError('endDate')"
                  class="form-control"
                />
                <div v-if="errors.endDate" class="text-danger">{{ errors.endDate }}</div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Đóng
              </button>
              <button type="submit" class="btn btn-success">
                {{ isEdit ? "Cập nhập" : "Thêm mới" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const token = localStorage.getItem("token") || "";

const showModal = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);

const form = ref({
  discountCode: "",
  discountPercent: null,
  minOrderAmount: null,
  maxDiscountAmount: null,
  quantityLimit: null,
  startDate: null,
  endDate: null,
  status: true,
});
const errors = ref({});

// Discount list & pagination
const discounts = ref([]);
const totalPages = ref(0);
const currentPage = ref(0);
const pageSize = ref(8);

const fetchDiscounts = async (page = 0) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/admin/discount/paging?page=${page}&size=${pageSize.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    discounts.value = res.data.content;
    totalPages.value = res.data.totalPages;
    currentPage.value = res.data.number;
  } catch (err) {
    iziToast.error({ title: "Lỗi", message: "Không thể tải mã giảm giá." });
  }
};

const openModal = async (id = null) => {
  currentEditId.value = id;
  isEdit.value = !!id;
  errors.value = {};

  if (id) {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/discount/findById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      form.value = res.data;
    } catch {
      iziToast.error({ title: "Lỗi", message: "Không tìm thấy mã giảm giá!" });
      return;
    }
  } else {
    form.value = {
      discountCode: "",
      discountPercent: null,
      minOrderAmount: null,
      maxDiscountAmount: null,
      quantityLimit: null,
      startDate: null,
      endDate: null,
      status: true,
    };
  }

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveDiscount = async () => {
  errors.value = {};

  // Kiểm tra ngày bắt đầu khi thêm mới
  if (!isEdit.value) {
    const today = new Date().toISOString().split("T")[0];
    if (form.value.startDate && form.value.startDate < today) {
      errors.value.startDate = "Ngày bắt đầu phải từ hôm nay trở đi";
      return;
    }
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const payload = { ...form.value };

    if (isEdit.value) {
      await axios.put(
        `http://localhost:8080/api/admin/discount/update/${currentEditId.value}`,
        payload,
        config
      );
      iziToast.success({
        title: "Thành công",
        message: "Cập nhật thành công!",
        position: "topRight",
      });
    } else {
      await axios.post(
        `http://localhost:8080/api/admin/discount/create`,
        payload,
        config
      );
      iziToast.success({
        title: "Thành công",
        message: "Tạo mới thành công!",
        position: "topRight",
      });
    }

    closeModal();
    await fetchDiscounts(currentPage.value);
  } catch (err) {
    if (err.response && err.response.status === 400 && Array.isArray(err.response.data)) {
      err.response.data.forEach((e) => {
        const [field, msg] = e.split(": ");
        errors.value[field] = msg;
      });
    } else {
      iziToast.error({ title: "Lỗi", message: "Có lỗi xảy ra khi lưu." });
    }
  }
};

const deleteDiscount = async (id) => {
  const result = await Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Mã giảm giá sẽ bị xoá vĩnh viễn!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8080/api/admin/discount/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDiscounts(currentPage.value);
      iziToast.success({ title: "Thành công", message: "Mã giảm giá đã được xoá." });
    } catch {
      iziToast.error({ title: "Lỗi", message: "Xoá mã giảm giá thất bại!" });
    }
  }
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const clearError = (field) => {
  errors.value[field] = null;
};
onMounted(() => fetchDiscounts(0));
</script>

<style scoped>
.modal {
  display: block;
  z-index: 1050;
}
.text-danger {
  font-size: 0.9rem;
}
</style>
