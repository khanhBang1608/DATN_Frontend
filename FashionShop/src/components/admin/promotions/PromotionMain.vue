<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const promotions = ref([]);
const token = localStorage.getItem("token");

// Lấy danh sách khuyến mãi
const fetchPromotions = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/admin/promotions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    promotions.value = res.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách khuyến mãi:", err);
  }
};

// Xoá khuyến mãi
const deletePromotion = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xoá khuyến mãi này?")) return;
  try {
    await axios.delete(`http://localhost:8080/api/admin/promotions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    promotions.value = promotions.value.filter((p) => p.id !== id);
  } catch (err) {
    console.error("Xoá thất bại:", err);
  }
};

// Định dạng ngày theo kiểu Việt Nam
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

// Điều hướng
const goToAddForm = () => {
  router.push("/admin/promotion/form");
};

const editPromotion = (id) => {
  router.push(`/admin/promotion/form/${id}`);
};

const goToPromotionProducts = (id) => {
  router.push(`/admin/ProductPromotions/${id}`);
};

// Gọi API khi component mounted
onMounted(() => {
  fetchPromotions();
});
</script>

<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📢 Quản lý Khuyến mãi</h2>
      <button class="btn btn-primary" @click="goToAddForm">+ Thêm khuyến mãi</button>
    </div>

    <table class="table table-hover align-middle text-light custom-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Tên chương trình</th>
          <th>Giảm (%)</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th>Trạng thái</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="promo in promotions" :key="promo.id">
          <td>{{ promo.id }}</td>
          <td>{{ promo.code }}</td>
          <td>{{ promo.discountAmount }} %</td>
          <td>{{ formatDate(promo.startDate) }}</td>
          <td>{{ formatDate(promo.endDate) }}</td>
          <td>
            <span :class="['badge', promo.status ? 'bg-success' : 'bg-secondary']">
              {{ promo.status ? "Đang hoạt động" : "Ngừng hoạt động" }}
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning m-1" @click="editPromotion(promo.id)">
              ✏️ Sửa
            </button>
            <button class="btn btn-sm btn-danger m-1" @click="deletePromotion(promo.id)">
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
        <tr v-if="promotions.length === 0">
          <td colspan="7" class="text-center text-white fs-5 py-4">
            <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
            Không có khuyến mãi nào được tìm thấy.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.custom-table thead {
  background-color: #1f1f1f;
}
.custom-table th,
.custom-table td {
  color: #fff;
  vertical-align: middle;
}
.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.75em;
}
</style>
