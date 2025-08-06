<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Router & token
const route = useRoute();
const router = useRouter();
const promotionId = route.params.promotionId;
const token = localStorage.getItem("token");

// List
const promotions = ref([]);
const variantMap = ref({});
const showModal = ref(false);
const showAddModal = ref(false);

// ======================== EDIT ========================
const selectedPromotion = ref({ id: null, productVariantId: "", quantityLimit: 1 });
const errors = ref({});

const openEditModal = (item) => {
  selectedPromotion.value = { ...item };
  errors.value = {};
  showModal.value = true;
};

const closeModal = () => (showModal.value = false);

const saveUpdatedQuantity = async () => {
  errors.value = {};
  const variant = variantMap.value[selectedPromotion.value.productVariantId];
  const maxStock = variant?.stock || 0;
  const quantity = selectedPromotion.value.quantityLimit;

  if (!Number.isInteger(quantity))
    errors.value.quantityLimit = "Số lượng sản phẩm khuyến mãi phải là số nguyên!";
  else if (quantity <= 0)
    errors.value.quantityLimit = "Số lượng sản phẩm khuyến mãi phải lớn hơn 0";
  else if (quantity > maxStock)
    errors.value.quantityLimit = `Số lượng sản phẩm khuyến mãi phải <= ${maxStock}`;

  if (Object.keys(errors.value).length) return;

  try {
    await axios.put(
      `http://localhost:8080/api/admin/product-promotions/${selectedPromotion.value.id}`,
      selectedPromotion.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const index = promotions.value.findIndex((p) => p.id === selectedPromotion.value.id);
    if (index !== -1) promotions.value[index] = { ...selectedPromotion.value };
    closeModal();
    iziToast.success({
      title: "Thành công",
      message: "Cập nhật thành công!",
      position: "topRight",
    });
  } catch (err) {
    iziToast.error({ title: "Lỗi", message: "Lỗi cập nhật", position: "topRight" });
  }
};

const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalItems = ref(0);

const fetchPromotions = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/admin/product-promotions/promotion/${promotionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage.value,
          size: pageSize.value,
        },
      }
    );

    promotions.value = res.data.items;
    totalPages.value = res.data.totalPages;
    totalItems.value = res.data.totalItems;

    await fetchVariantDetails();
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: "Không thể tải danh sách",
      position: "topRight",
    });
  }
};

const handlePageChange = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchPromotions();
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
    } catch {}
  });
  await Promise.all(promises);
};

const deletePromotion = async (id) => {
  const confirm = await Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Sản phẩm khuyến mãi bị xoá vĩnh viễn!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (confirm.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8080/api/admin/product-promotions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      promotions.value = promotions.value.filter((p) => p.id !== id);
      iziToast.success({
        title: "Thành công",
        message: "Đã xóa sản phẩm khuyến mãi",
        position: "topRight",
      });
    } catch {
      iziToast.error({ title: "Lỗi", message: "Xóa thất bại!", position: "topRight" });
    }
  }
};

// ======================== ADD ========================
const showAdd = () => {
  showAddModal.value = true;
  errorsAdd.products = "";
  errorsAdd.global = "";
  successMessage.value = "";
  selectedProductId.value = "";
  selectedVariants.value = {};
};

const allProducts = ref([]);
const selectedProductId = ref("");
const allVariantsMap = ref({});
const selectedVariants = ref({});
const errorsAdd = reactive({ products: "", variants: {}, global: "" });
const successMessage = ref("");

const fetchAllProducts = async () => {
  const res = await axios.get("http://localhost:8080/api/admin/productss", {
    headers: { Authorization: `Bearer ${token}` },
  });
  allProducts.value = res.data;
};

const fetchVariantsByProductId = async (productId) => {
  const res = await axios.get(
    "http://localhost:8080/api/admin/product-promotions/productVariants",
    {
      params: { productId },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  allVariantsMap.value[productId] = res.data;

  res.data.forEach((variant) => {
    if (!selectedVariants.value[variant.productVariantId]) {
      selectedVariants.value[variant.productVariantId] = {
        checked: false,
        promotionQuantity: 0,
      };
    }
  });
};

const saveAddPromotion = async () => {
  errorsAdd.products = "";
  errorsAdd.variants = {};
  errorsAdd.global = "";
  successMessage.value = "";

  if (!selectedProductId.value) {
    errorsAdd.products = "Vui lòng chọn sản phẩm";
    return;
  }

  const selectedList = [];
  for (const [variantId, val] of Object.entries(selectedVariants.value)) {
    if (val.checked) {
      selectedList.push({
        productVariantId: parseInt(variantId),
        promotionId: parseInt(promotionId),
      });
    }
  }

  if (selectedList.length === 0) {
    errorsAdd.global = "Vui lòng chọn ít nhất một biến thể.";
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:8080/api/admin/product-promotions`,
      selectedList,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const savedVariants = response.data;
    const savedVariantIds = savedVariants.map((item) => item.productVariantId);
    const failedVariants = selectedList.filter(
      (item) => !savedVariantIds.includes(item.productVariantId)
    );

    if (savedVariants.length > 0) {
      const successVariantNames = savedVariants.map((item) => {
        const variant = Object.values(allVariantsMap.value)
          .flat()
          .find((v) => v.productVariantId === item.productVariantId);
        return `${variant.colorName} - ${variant.sizeName}`;
      });
      successMessage.value = `Đã thêm thành công các biến thể: ${successVariantNames.join(", ")}`;
    }

    if (failedVariants.length > 0) {
      failedVariants.forEach((item) => {
        const variant = Object.values(allVariantsMap.value)
          .flat()
          .find((v) => v.productVariantId === item.productVariantId);
        errorsAdd.variants[
          item.productVariantId
        ] = `Biến thể ${variant.colorName} - ${variant.sizeName} đã tồn tại trong một chương trình khuyến mãi khác có thời gian trùng lặp.`;
      });
      return;
    }

    await fetchPromotions();
    await fetchVariantDetails();
    showAddModal.value = false;
    iziToast.success({
      title: "Thành công",
      message: "Thêm mới thành công!",
      position: "topRight",
    });
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: "Thêm thất bại. Vui lòng thử lại.",
      position: "topRight",
    });
  }
};

const closeAddModal = () => {
  showAddModal.value = false;
  successMessage.value = "";
  window.location.reload(); // Reload the page when closing the modal
};

const getImageUrl = (imageName) => {
  if (!imageName) {
    return "http://localhost:8080/images/default.png";
  }
  return `http://localhost:8080/images/${imageName}`;
};

onMounted(async () => {
  await fetchPromotions();
  await fetchVariantDetails();
  await fetchAllProducts();
});

const getProductName = (productId) => {
  const product = allProducts.value.find((p) => p.productId == productId);
  return product ? product.name : "Không rõ";
};
</script>

<template>
  <div class="container py-5">
    <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">🎁 Danh sách Sản phẩm Khuyến Mãi</h2>
        <button class="btn btn-primary" @click="showAdd">
          + Thêm sản phẩm khuyến mãi
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle text-light custom-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Biến thể sản phẩm</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Ảnh</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in promotions" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div>
                  ID: {{ item.productVariant?.productVariantId }} <br />
                  Màu: {{ item.productVariant?.colorName }} - Size:
                  {{ item.productVariant?.sizeName }}
                </div>
              </td>
              <td>
                Gốc: {{ item.productVariant?.price?.toLocaleString() }} ₫ <br />
                Giảm còn: {{ item.discountedPrice.toLocaleString() }} ₫
              </td>
              <td>{{ item.productVariant?.stock }}</td>
              <td>
                <img
                  :src="getImageUrl(item.productVariant?.imageName)"
                  alt="ảnh"
                  width="50"
                  height="50"
                  style="object-fit: cover"
                />
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-danger m-1"
                  @click="deletePromotion(item.id)"
                >
                  🗑️ Xoá
                </button>
              </td>
            </tr>

            <tr v-if="promotions.length === 0">
              <td colspan="6" class="text-center text-white fs-5 py-4">
                <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                Không có sản phẩm khuyến mãi nào được tìm thấy.
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div class="d-flex justify-content-center align-items-center mt-3 text-white">
          <!-- Previous Button -->
          <button
            class="btn btn-sm btn-outline-light me-2"
            :disabled="currentPage === 0"
            @click="handlePageChange(currentPage - 1)"
          >
            &lt;
          </button>

          <!-- Page Numbers -->
          <span v-for="page in totalPages" :key="page" class="mx-1">
            <button
              class="btn btn-sm"
              :class="
                page - 1 === currentPage ? 'btn-light text-dark' : 'btn-outline-light'
              "
              @click="handlePageChange(page - 1)"
            >
              {{ page }}
            </button>
          </span>

          <!-- Next Button -->
          <button
            class="btn btn-sm btn-outline-light ms-2"
            :disabled="currentPage + 1 >= totalPages"
            @click="handlePageChange(currentPage + 1)"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal thêm -->
  <div
    v-if="showAddModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Thêm sản phẩm khuyến mãi</h5>
          <button type="button" class="btn-close" @click="closeAddModal"></button>
        </div>
        <div class="modal-body">
          <!-- Select product -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Chọn sản phẩm</label>
            <select
              v-model="selectedProductId"
              class="form-control"
              @change="
                () => {
                  errorsAdd.products = '';
                  errorsAdd.global = '';
                  successMessage = '';
                  fetchVariantsByProductId(selectedProductId);
                }
              "
            >
              <option disabled value="">-- Chọn sản phẩm --</option>
              <option v-for="p in allProducts" :key="p.productId" :value="p.productId">
                {{ p.name }}
              </option>
            </select>
            <div class="text-danger mt-1" v-if="errorsAdd.products">
              {{ errorsAdd.products }}
            </div>
          </div>

          <!-- Variants -->
          <div v-if="selectedProductId">
            <label class="form-label fw-semibold">
              Biến thể của sản phẩm: {{ getProductName(selectedProductId) }}
            </label>
            <!-- Success message for added variants -->
            <div v-if="successMessage" class="alert alert-success mt-2">
              {{ successMessage }}
            </div>
            <div
              v-if="allVariantsMap[selectedProductId]?.length"
              v-for="variant in allVariantsMap[selectedProductId]"
              :key="variant.productVariantId"
              class="border rounded p-2 mb-2"
            >
              <div>
                <input
                  type="checkbox"
                  v-model="selectedVariants[variant.productVariantId].checked"
                  @change="
                    errorsAdd.variants[variant.productVariantId] = '';
                    errorsAdd.global = '';
                  "
                />
                {{ variant.colorName }} - {{ variant.sizeName }} - Tồn kho:
                {{ variant.stock }}
              </div>
              <div
                v-if="errorsAdd.variants[variant.productVariantId]"
                class="text-danger mt-1"
              >
                {{ errorsAdd.variants[variant.productVariantId] }}
              </div>
            </div>

            <!-- Nếu không có biến thể -->
            <div v-else class="alert text-danger">
              <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              Không có biến thể nào cho sản phẩm này.
            </div>

            <div class="text-danger mt-2" v-if="errorsAdd.global">
              {{ errorsAdd.global }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeAddModal">Đóng</button>
          <button class="btn btn-success" @click="saveAddPromotion">Thêm mới</button>
        </div>
      </div>
    </div>
  </div>
</template>
