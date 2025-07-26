<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const router = useRouter();
const route = useRoute();
const token = localStorage.getItem("token");

const id = route.params.id;
const isEdit = ref(false);

const form = ref({
  code: "",
  description: "",
  discountAmount: 0,
  startDate: "",
  endDate: "",
  status: true,
});

const formErrors = ref({}); // Lưu lỗi cho từng field

const showToast = (msg, type = "error") => {
  iziToast[type]({
    title: type === "error" ? "Lỗi" : "Thành công",
    message: msg,
    position: "topRight",
  });
};

const fetchPromotionById = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/admin/promotions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const promo = res.data;
    form.value = {
      ...promo,
      startDate: promo.startDate?.split("T")[0],
      endDate: promo.endDate?.split("T")[0],
    };
    isEdit.value = true;
  } catch {
    showToast("Không tìm thấy khuyến mãi cần sửa.");
    router.push("/admin/promotion");
  }
};

const handleSubmit = async (isUpdate = false) => {
  formErrors.value = {};

  // Kiểm tra logic ngày tháng
  if (form.value.startDate > form.value.endDate) {
    formErrors.value.startDate = "Ngày bắt đầu phải trước ngày kết thúc.";
    formErrors.value.endDate = "Ngày kết thúc phải sau ngày bắt đầu.";
    return;
  }

  try {
    const url = isUpdate
      ? `http://localhost:8080/api/admin/promotions/${id}`
      : "http://localhost:8080/api/admin/promotions";

    const method = isUpdate ? "put" : "post";

    await axios[method](url, form.value, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    showToast(isUpdate ? "Cập nhật thành công" : "Thêm thành công", "success");
    router.push("/admin/promotion");
  } catch (err) {
    const res = err.response?.data;
    if (Array.isArray(res)) {
      res.forEach((msg) => {
        if (msg.includes("Mã khuyến mãi")) formErrors.value.code = msg;
        if (msg.includes("Mô tả")) formErrors.value.description = msg;
        if (msg.includes("Số tiền")) formErrors.value.discountAmount = msg;
        if (msg.includes("bắt đầu")) formErrors.value.startDate = msg;
        if (msg.includes("kết thúc")) formErrors.value.endDate = msg;
        if (msg.includes("Trạng thái")) formErrors.value.status = msg;
      });
    } else {
      showToast(res || "Lỗi hệ thống");
    }
  }
};

const createPromotion = () => handleSubmit(false);
const updatePromotion = () => handleSubmit(true);

const cancelEdit = () => router.push("/admin/promotion");

onMounted(() => {
  if (id) fetchPromotionById();
});
</script>

<template>
  <div class="card p-4 mb-4 shadow rounded bg-white">
    <div class="card-header bg-dark text-white rounded mb-3">
      <h5 class="mb-0">
        {{ isEdit ? "✏️ Sửa Khuyến mãi" : "➕ Thêm Khuyến mãi" }}
      </h5>
    </div>

    <form @submit.prevent="isEdit ? updatePromotion() : createPromotion()">
      <div class="row g-3">
        <!-- Code -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Tên chương trình</label>
          <input type="text" class="form-control" v-model="form.code" />
          <small class="text-danger" v-if="formErrors.code">{{ formErrors.code }}</small>
        </div>

        <!-- Discount -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Giảm giá (VNĐ)</label>
          <input type="number" class="form-control" v-model="form.discountAmount" />
          <small class="text-danger" v-if="formErrors.discountAmount">{{
            formErrors.discountAmount
          }}</small>
        </div>

        <!-- Description -->
        <div class="col-md-12">
          <label class="form-label fw-semibold text-dark">Mô tả</label>
          <textarea class="form-control" rows="3" v-model="form.description"></textarea>
          <small class="text-danger" v-if="formErrors.description">{{
            formErrors.description
          }}</small>
        </div>

        <!-- Start Date -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày bắt đầu</label>
          <input type="date" class="form-control" v-model="form.startDate" />
          <small class="text-danger" v-if="formErrors.startDate">{{
            formErrors.startDate
          }}</small>
        </div>

        <!-- End Date -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Ngày kết thúc</label>
          <input type="date" class="form-control" v-model="form.endDate" />
          <small class="text-danger" v-if="formErrors.endDate">{{
            formErrors.endDate
          }}</small>
        </div>

        <!-- Status -->
        <div class="col-md-6">
          <label class="form-label fw-semibold text-dark">Trạng thái</label>
          <select class="form-select" v-model="form.status">
            <option :value="true">Đang hoạt động</option>
            <option :value="false">Ngừng hoạt động</option>
          </select>
          <small class="text-danger" v-if="formErrors.status">{{
            formErrors.status
          }}</small>
        </div>

        <!-- Buttons -->
        <div class="col-12 d-flex justify-content-end gap-2">
          <button type="submit" class="btn btn-success">
            <i class="bi" :class="isEdit ? 'bi-pencil-square' : 'bi-check-circle'"></i>
            {{ isEdit ? "Cập nhật" : "Lưu" }}
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="cancelEdit">
            <i class="bi bi-x-circle"></i> Hủy
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
