<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { getAllCategories } from "@/api/adminCategoryAPI";
import { addProduct, updateProduct, getProductById } from "@/api/adminProductAPI";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const errors = ref({});

const router = useRouter();
const products = ref([]);
const token = localStorage.getItem("token");

const showModal = ref(false);
const isEditing = ref(false);
const currentProductId = ref(null);

const product = ref({
  name: "",
  description: "",
  status: true,
  categoryId: "",
});
const categories = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/admin/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    products.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
};

const fetchCategories = async () => {
  try {
    categories.value = await getAllCategories();
  } catch (error) {
    console.error("Không tải được danh mục:", error);
  }
};

const openAddModal = async () => {
  isEditing.value = false;
  currentProductId.value = null;
  product.value = { name: "", description: "", status: true, categoryId: "" };
  await fetchCategories();
  showModal.value = true;
};

const openEditModal = async (id) => {
  isEditing.value = true;
  currentProductId.value = id;
  await fetchCategories();
  try {
    product.value = await getProductById(id);
    showModal.value = true;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
};

const handleSubmit = async () => {
  errors.value = {}; // reset lỗi trước

  try {
    if (!product.value.name?.trim())
      errors.value.name = "Tên sản phẩm không được để trống";
    if (!product.value.categoryId) errors.value.categoryId = "Vui lòng chọn danh mục";
    if (!product.value.description?.trim())
      errors.value.description = "Mô tả không được để trống";

    if (Object.keys(errors.value).length > 0) return;

    if (isEditing.value) {
      await updateProduct(currentProductId.value, product.value);
      iziToast.success({
        title: "Thành công",
        message: "Cập nhật sản phẩm thành công",
        position: "topRight", // ✅ đặt đúng vị trí
      });
    } else {
      await addProduct(product.value);
      iziToast.success({
        title: "Thành công",
        message: "Thêm sản phẩm thành công",
        position: "topRight", // ✅ đặt đúng vị trí
      });
    }

    showModal.value = false;
    await fetchProducts();
  } catch (error) {
    if (error.response?.status === 400 && typeof error.response.data === "string") {
      const lines = error.response.data.split("\n");
      lines.forEach((line) => {
        const [field, message] = line.split(":").map((s) => s.trim());
        if (field && message) errors.value[field] = message;
      });
    } else {
      iziToast.error({
        title: "Lỗi hệ thống",
        message: error.message || "Đã xảy ra lỗi không xác định.",
        position: "topRight", // ✅ thêm dòng này
      });

      console.error(error);
    }
  }
};

const closeModal = () => {
  showModal.value = false;
};

const goToVariantList = (productId) => {
  router.push(`/admin/product/${productId}/variants`);
};

const formatPrice = (value) => {
  if (!value) return "0đ";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );
};

const getMinPrice = (variants) => {
  if (!variants || variants.length === 0) return 0;
  return Math.min(...variants.map((v) => v.price));
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}/${d.getFullYear()}`;
};

onMounted(fetchProducts);
</script>
<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🛍️ Quản lý Sản phẩm</h2>
      <button class="btn btn-primary" @click="openAddModal">+ Thêm sản phẩm</button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Danh mục</th>
            <th>Biến thể</th>
            <th>Giá từ</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.productId">
            <td>{{ index + 1 }}</td>
            <td>
              <img
                :src="
                  product.variants?.[0]?.imageName
                    ? `http://localhost:8080/images/${product.variants[0].imageName}`
                    : 'https://via.placeholder.com/60'
                "
                width="60"
                alt="Ảnh sản phẩm"
              />
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.categoryName || "---" }}</td>
            <td>{{ product.variants?.length || 0 }}</td>
            <td>{{ formatPrice(getMinPrice(product.variants)) }}</td>
            <td>
              <span :class="['badge', product.status ? 'bg-success' : 'bg-danger']">
                {{ product.status ? "Đang bán" : "Ngừng bán" }}
              </span>
            </td>
            <td>{{ formatDate(product.dateCreated) }}</td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-warning m-1"
                @click="openEditModal(product.productId)"
              >
                ✏️ Sửa
              </button>
              <button
                class="btn btn-sm btn-info m-1"
                @click="goToVariantList(product.productId)"
              >
                📦 Biến thể
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 🔽 Modal Thêm/Cập nhật Sản phẩm -->
  <div
    v-if="showModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <form @submit.prevent="handleSubmit">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              {{ isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm" }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body row g-3">
            <div class="col-md-6">
              <label class="form-label">Tên sản phẩm</label>
              <input
                v-model="product.name"
                @input="errors.name = ''"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
              />

              <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Danh mục</label>
              <select
                v-model="product.categoryId"
                @change="errors.categoryId = ''"
                class="form-select"
                :class="{ 'is-invalid': errors.categoryId }"
              >
                <option value="">-- Chọn danh mục --</option>
                <optgroup
                  v-for="cat in categories"
                  :key="cat.categoryId"
                  :label="cat.categoryName"
                >
                  <option
                    v-for="child in cat.children"
                    :key="child.categoryId"
                    :value="child.categoryId"
                  >
                    {{ child.categoryName }}
                  </option>
                </optgroup>
              </select>
              <div class="invalid-feedback" v-if="errors.categoryId">
                {{ errors.categoryId }}
              </div>
            </div>

            <div class="col-md-12">
              <label class="form-label">Mô tả</label>
              <textarea
                v-model="product.description"
                @input="errors.description = ''"
                class="form-control"
                rows="3"
                placeholder="Nhập mô tả..."
                :class="{ 'is-invalid': errors.description }"
              ></textarea>

              <div class="invalid-feedback" v-if="errors.description">
                {{ errors.description }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Trạng thái</label>
              <select class="form-select" v-model="product.status">
                <option :value="true">Đang bán</option>
                <option :value="false">Ngừng bán</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Hủy
            </button>
            <button type="submit" class="btn btn-success">
              {{ isEditing ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
