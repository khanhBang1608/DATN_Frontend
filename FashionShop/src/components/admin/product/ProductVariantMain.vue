<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const productId = route.params.id;
const variants = ref([]);
const errorMessage = ref("");
const token = localStorage.getItem("token") || "";

const fetchVariants = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/admin/products/${productId}/variants`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    variants.value = response.data;
  } catch (error) {
    errorMessage.value = "❌ Không thể tải danh sách biến thể";
    console.error(error);
  }
};

const handleAdd = () => {
  router.push(`/admin/product/${productId}/variants/add`);
};

const handleBack = () => {
  router.push("/admin/product");
};

const editVariant = (variantId) => {
  router.push(`/admin/product/${productId}/variants/add/${variantId}`);
};

const deleteVariant = async (variantId) => {
  if (!confirm("Bạn có chắc chắn muốn xoá biến thể này?")) return;

  try {
    await axios.delete(`http://localhost:8080/api/admin/product-variants/${variantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("✅ Xoá thành công!");
    fetchVariants(); // reload lại danh sách
  } catch (error) {
    console.error(error);
    alert("❌ Không thể xoá biến thể");
  }
};

onMounted(fetchVariants);
</script>

<template>
  <div class="container py-5">
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📦 Danh sách biến thể sản phẩm #{{ productId }}</h2>

      <button class="btn btn-primary" @click="handleAdd">➕ Thêm biến thể</button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Màu</th>
            <th>Size</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variant in variants" :key="variant.productVariantId">
            <td>
              <img
                v-if="variant.imageName"
                :src="`http://localhost:8080/images/${variant.imageName}`"
                width="80"
                alt="variant"
              />
            </td>
            <td>{{ variant.colorName }}</td>
            <td>{{ variant.sizeName || "Không có" }}</td>
            <td>{{ variant.price.toLocaleString() }}đ</td>
            <td>{{ variant.stock }}</td>
            <td>
              <button
                class="btn btn-sm btn-warning me-1"
                @click="editVariant(variant.productVariantId)"
              >
                ✏️ Sửa
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteVariant(variant.productVariantId)"
              >
                🗑️ Xoá
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="d-flex justify-content-end mb-3">
    <button
      class="btn btn-link text-decoration-underline text-white me-5"
      @click="handleBack"
    >
    Quay về
    </button>
  </div>
  </div>
</template>

<style scoped>
table th,
table td {
  vertical-align: middle;
  text-align: center;
}
</style>
