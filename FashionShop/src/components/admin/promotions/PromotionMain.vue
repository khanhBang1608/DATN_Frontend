<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📢 Quản lý Khuyến mãi</h2>
      <button class="btn btn-primary" @click="openModal()">+ Thêm khuyến mãi</button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên chương trình</th>
            <th>Giảm (VNĐ)</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="promotions.length === 0">
            <td colspan="6" class="text-center text-muted">Không có khuyến mãi nào.</td>
          </tr>
          <tr v-for="promo in promotions" :key="promo.id">
            <td>{{ promo.code }}</td>
            <td>{{ promo.description }}</td>
            <td>{{ formatCurrency(promo.discountAmount) }}</td>
            <td>{{ formatDate(promo.startDate) }} - {{ formatDate(promo.endDate) }}</td>
            <td>
              <span
                :class="['badge text-light', promo.status ? 'bg-success' : 'bg-danger']"
              >
                {{ promo.status ? "Đang hoạt động" : "Ngừng hoạt động" }}
              </span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning m-1" @click="openModal(promo.id)">
                ✏️ Sửa
              </button>
              <button
                class="btn btn-sm btn-danger m-1"
                @click="deletePromotion(promo.id)"
              >
                🗑️ Xoá
              </button>
              <button
                class="btn btn-outline-info me-2"
                @click="goToPromotionProducts(promo.id)"
              >
                🎁 Sản phẩm khuyến mãi
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="savePromotion">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEdit ? "Sửa" : "Thêm" }} khuyến mãi</h5>
              <button type="button" class="btn-close" @click="closeModal()"></button>
            </div>
            <div class="modal-body row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Mã khuyến mãi</label>
                <input
                  v-model="form.code"
                  @input="clearError('code')"
                  class="form-control"
                />
                <div class="text-danger" v-if="errors.code">{{ errors.code }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Giảm giá (VNĐ)</label>
                <input
                  v-model="form.discountAmount"
                  type="number"
                  @input="clearError('discountAmount')"
                  class="form-control"
                />
                <div class="text-danger" v-if="errors.discountAmount">
                  {{ errors.discountAmount }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Ngày bắt đầu</label>
                <input
                  v-model="form.startDate"
                  type="date"
                  @input="clearError('startDate')"
                  class="form-control"
                />
                <div class="text-danger" v-if="errors.startDate">
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
                <div class="text-danger" v-if="errors.endDate">{{ errors.endDate }}</div>
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold">Mô tả</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  rows="3"
                ></textarea>
                <div class="text-danger" v-if="errors.description">
                  {{ errors.description }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Trạng thái</label>
                <select v-model="form.status" class="form-select">
                  <option :value="true">Đang hoạt động</option>
                  <option :value="false">Ngừng hoạt động</option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal()">
                Đóng
              </button>
              <button type="submit" class="btn btn-success">
                {{ isEdit ? "Cập nhật" : "Thêm mới" }}
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
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const promotions = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const router = useRouter();
const token = localStorage.getItem("token");

const form = ref({
  code: "",
  description: "",
  discountAmount: 0,
  startDate: "",
  endDate: "",
  status: true,
});

const errors = ref({});

const fetchPromotions = async () => {
  const res = await axios.get("http://localhost:8080/api/admin/promotions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  promotions.value = res.data;
};

const openModal = async (id = null) => {
  currentId.value = id;
  isEdit.value = !!id;
  errors.value = {};

  if (id) {
    const res = await axios.get(`http://localhost:8080/api/admin/promotions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const promo = res.data;
    form.value = {
      ...promo,
      startDate: promo.startDate?.split("T")[0],
      endDate: promo.endDate?.split("T")[0],
    };
  } else {
    form.value = {
      code: "",
      description: "",
      discountAmount: 0,
      startDate: "",
      endDate: "",
      status: true,
    };
  }

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const savePromotion = async () => {
  errors.value = {};
  if (form.value.startDate > form.value.endDate) {
    errors.value.startDate = "Ngày bắt đầu phải trước ngày kết thúc.";
    errors.value.endDate = "Ngày kết thúc phải sau ngày bắt đầu.";
    return;
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (isEdit.value) {
      await axios.put(
        `http://localhost:8080/api/admin/promotions/${currentId.value}`,
        form.value,
        config
      );
      iziToast.success({
        title: "Thành công",
        message: "Cập nhật thành công!",
        position: "topRight",
      });
    } else {
      await axios.post("http://localhost:8080/api/admin/promotions", form.value, config);
      iziToast.success({
        title: "Thành công",
        message: "Thêm mới thành công!",
        position: "topRight",
      });
    }

    closeModal();
    await fetchPromotions();
  } catch (err) {
    const res = err.response?.data;
    if (Array.isArray(res)) {
      res.forEach((msg) => {
        if (msg.includes("Mã")) errors.value.code = msg;
        if (msg.includes("giảm")) errors.value.discountAmount = msg;
        if (msg.includes("bắt đầu")) errors.value.startDate = msg;
        if (msg.includes("kết thúc")) errors.value.endDate = msg;
        if (msg.includes("Mô tả")) errors.value.description = msg;
      });
    } else {
      iziToast.error({ title: "Lỗi", message: "Lưu thất bại.", position: "topRight" });
    }
  }
};

const deletePromotion = async (id) => {
  const result = await Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Khuyến mãi sẽ bị xoá vĩnh viễn!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8080/api/admin/promotions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchPromotions();
      iziToast.success({
        title: "Thành công",
        message: "Đã xoá khuyến mãi.",
        position: "topRight",
      });
    } catch {
      iziToast.error({ title: "Lỗi", message: "Xoá thất bại!", position: "topRight" });
    }
  }
};

const goToPromotionProducts = (id) => {
  router.push(`/admin/ProductPromotions/${id}`);
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
const formatDate = (d) =>
  new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
const clearError = (field) => (errors.value[field] = null);

onMounted(fetchPromotions);
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
