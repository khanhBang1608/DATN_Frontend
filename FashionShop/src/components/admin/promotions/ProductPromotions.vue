<!-- src/views/admin/ProductPromotions.vue -->
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const variantMap = ref({}); // { variantId: variantObject }
const errorMessage = ref("");
const promotionId = route.params.promotionId;

const promotions = ref([]);
const token = localStorage.getItem("token");

const fetchPromotions = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/admin/product-promotions/promotion/${promotionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    promotions.value = res.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm khuyến mãi:", err);
  }
};

const fetchVariantDetails = async () => {
  const promises = promotions.value.map(async (item) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/product-variants/${item.productVariantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      variantMap.value[item.productVariantId] = res.data;
    } catch (err) {
      console.error(`Lỗi lấy biến thể cho ID ${item.productVariantId}:`, err);
    }
  });
  await Promise.all(promises);
};

const deletePromotion = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xóa liên kết này?")) return;
  try {
    await axios.delete(`http://localhost:8080/api/admin/product-promotions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    promotions.value = promotions.value.filter((p) => p.id !== id);
  } catch (err) {
    console.error("Lỗi xoá:", err);
  }
};

const goToAddForm = () => {
  router.push(`/admin/ProductPromotionForm/${promotionId}`);
};

onMounted(async () => {
  await fetchPromotions();
  await fetchVariantDetails();
});

const showModal = ref(false);
const selectedPromotion = ref({ id: null, productVariantId: "", quantityLimit: 1 });

const openEditModal = (item) => {
  selectedPromotion.value = { ...item };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveUpdatedQuantity = async () => {
  const variant = variantMap.value[selectedPromotion.value.productVariantId];
  const maxStock = variant?.stock || 0;
  const quantity = selectedPromotion.value.quantityLimit;

  // Kiểm tra ràng buộc
  if (!Number.isInteger(quantity)) {
    errorMessage.value = "⚠️ Số lượng phải là số nguyên.";
    return;
  }
  if (quantity <= 0) {
    errorMessage.value = "⚠️ Số lượng phải lớn hơn 0.";
    return;
  }
  if (quantity > maxStock) {
    errorMessage.value = `⚠️ Số lượng không được vượt quá số lượng tồn kho: ${maxStock}.`;
    return;
  }

  try {
    await axios.put(
      `http://localhost:8080/api/admin/product-promotions/${selectedPromotion.value.id}`,
      selectedPromotion.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Cập nhật lại trong danh sách
    const index = promotions.value.findIndex((p) => p.id === selectedPromotion.value.id);
    if (index !== -1) promotions.value[index] = { ...selectedPromotion.value };

    closeModal();
    errorMessage.value = "";
  } catch (err) {
    console.error("Lỗi cập nhật số lượng:", err);
    errorMessage.value = "❌ Có lỗi khi cập nhật. Vui lòng thử lại.";
  }
};
</script>
<template>
  <div class="container py-5">
    <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">🎁 Danh sách Sản phẩm Khuyến Mãi</h2>
        <button class="btn btn-primary" @click="goToAddForm">
          + Thêm sản phẩm khuyến mãi
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle text-light custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID - Biến thể sản phẩm</th>
              <th>Giới hạn số lượng</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in promotions" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.productVariantId }}</td>
              <td>{{ item.quantityLimit }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning me-1" @click="openEditModal(item)">
                  ✏️ Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="deletePromotion(item.id)">
                  🗑️ Xoá
                </button>
              </td>
            </tr>
            <tr v-if="promotions.length === 0">
              <td colspan="4" class="text-center text-muted">
                Không có sản phẩm khuyến mãi nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- Modal sửa số lượng -->
  <div
    v-if="showModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">✏️ Sửa số lượng</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p><strong>ID:</strong> {{ selectedPromotion.id }}</p>
          <p><strong>Biến thể:</strong> {{ selectedPromotion.productVariantId }}</p>

          <div class="mb-3">
            <label for="quantityLimit" class="form-label">Giới hạn số lượng</label>
            <input
              type="number"
              class="form-control"
              v-model="selectedPromotion.quantityLimit"
              min="1"
              :max="variantMap[selectedPromotion.productVariantId]?.stock || 1"
            />
          </div>

          <!-- Thông báo lỗi -->
          <div v-if="errorMessage" class="alert alert-danger py-2 px-3">
            {{ errorMessage }}
          </div>

          <!-- Gợi ý thêm -->
          <div class="text-muted small">
            Số lượng tồn kho hiện tại:
            <strong>{{
              variantMap[selectedPromotion.productVariantId]?.stock ?? "..."
            }}</strong>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Đóng</button>
          <button class="btn btn-primary" @click="saveUpdatedQuantity">
            💾 Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
