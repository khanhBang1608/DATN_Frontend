<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const route = useRoute();
const token = localStorage.getItem("token");
const promotionId = route.params.promotionId;
const id = route.params.id;

const allProducts = ref([]);
const selectedProductId = ref(""); // Chỉ chọn 1 sản phẩm
const allVariantsMap = ref({});
const selectedVariants = ref({});
const errors = reactive({
  products: "",
  variants: {},
  variantsGlobal: "",
});

// ===== Thông báo hệ thống =====
const showSuccess = (message) => {
  iziToast.success({
    title: "Thành công",
    message,
    position: "topRight",
  });
};

const showError = (message) => {
  iziToast.error({
    title: "Lỗi",
    message,
    position: "topRight",
  });
};

const showWarning = (message) => {
  iziToast.warning({
    title: "Cảnh báo",
    message,
    position: "topRight",
  });
};

const fetchAllProducts = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    allProducts.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách sản phẩm:", err);
    showError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
  }
};

const fetchVariantsByProductId = async (productId) => {
  try {
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
  } catch (err) {
    console.error(`Lỗi khi tải biến thể cho sản phẩm ${productId}:`, err);
    showError(`Không thể tải biến thể cho sản phẩm ${productId}.`);
  }
};

const loadEditData = async () => {
  if (!id) return;

  try {
    const res = await axios.get(
      `http://localhost:8080/api/admin/product-promotions/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = res.data;

    selectedVariants.value[data.productVariantId] = {
      checked: true,
      promotionQuantity: data.quantityLimit,
    };

    const variantRes = await axios.get(
      `http://localhost:8080/api/admin/product-variants/${data.productVariantId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const variant = variantRes.data;
    const productId = variant.productId;

    selectedProductId.value = productId;
    await fetchVariantsByProductId(productId);
  } catch (err) {
    console.error("Lỗi khi load dữ liệu sửa:", err);
    showError("Không thể tải dữ liệu khuyến mãi. Vui lòng thử lại.");
  }
};

watch(selectedProductId, async (newId) => {
  errors.products = "";
  if (newId && !allVariantsMap.value[newId]) {
    await fetchVariantsByProductId(newId);
  }
});

onMounted(() => {
  fetchAllProducts();
  loadEditData();
});

const submitPromotionVariants = async () => {
  errors.products = "";
  errors.variants = {};
  errors.variantsGlobal = "";

  if (!selectedProductId.value) {
    errors.products = "Vui lòng chọn sản phẩm.";
    return;
  }

  const selectedList = [];

  for (const [variantId, value] of Object.entries(selectedVariants.value)) {
    if (value.checked) {
      if (!value.promotionQuantity || value.promotionQuantity <= 0) {
        errors.variants[variantId] = "Số lượng phải lớn hơn 0.";
        continue;
      }

      const variant = Object.values(allVariantsMap.value)
        .flat()
        .find((v) => v.productVariantId === parseInt(variantId));
      if (variant && value.promotionQuantity > variant.stock) {
        errors.variants[variantId] = `Số lượng vượt tồn kho (${variant.stock})`;
        continue;
      }

      selectedList.push({
        productVariantId: parseInt(variantId),
        promotionId: parseInt(promotionId),
        quantityLimit: value.promotionQuantity,
      });
    }
  }

  const hasChecked = Object.values(selectedVariants.value).some((v) => v.checked);

  if (Object.keys(errors.variants).length > 0 || selectedList.length === 0) {
    if (!hasChecked) {
      errors.variantsGlobal = "Vui lòng chọn ít nhất 1 biến thể.";
    }
    return;
  }

  try {
    if (id) {
      const item = selectedList[0];
      const response = await axios.put(
        `http://localhost:8080/api/admin/product-promotions/${id}`,
        item,
        {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "application/json",
        }
      );
      if (!response.data) {
        errors.variants[item.productVariantId] = "Đã có khuyến mãi trùng thời gian.";
        return;
      }
    } else {
      const response = await axios.post(
        `http://localhost:8080/api/admin/product-promotions`,
        selectedList,
        {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "application/json",
        }
      );

      const savedVariants = response.data;
      const savedVariantIds = savedVariants.map((item) => item.productVariantId);
      const failedVariants = selectedList.filter(
        (item) => !savedVariantIds.includes(item.productVariantId)
      );

      failedVariants.forEach((item) => {
        errors.variants[item.productVariantId] =
          "Không thể lưu do trùng thời gian khuyến mãi.";
      });
    }
  } catch (err) {
    console.error("Lỗi khi lưu khuyến mãi:", err);
    errors.products = "Đã xảy ra lỗi khi lưu khuyến mãi. Vui lòng thử lại.";
  }
};

const getProductName = (productId) => {
  const product = allProducts.value.find((p) => p.productId == productId);
  return product ? product.name : "Không rõ";
};
const deleteError = (variantId) => {
  if (errors.variants[variantId]) {
    delete errors.variants[variantId];
  }

  // Nếu không còn lỗi nào trong variants => xóa lỗi tổng quát
  if (Object.keys(errors.variants).length === 0) {
    errors.variantsGlobal = "";
  }
};
</script>

<template>
  <div class="container mt-4">
    <h3>Chọn sản phẩm và biến thể để áp dụng khuyến mãi</h3>

    <!-- Dropdown chọn 1 sản phẩm -->
    <div class="form-group mb-3">
      <label class="form-label fw-semibold">Chọn sản phẩm</label>
      <select v-model="selectedProductId" class="form-control">
        <option disabled value="">-- Chọn sản phẩm --</option>
        <option
          v-for="product in allProducts"
          :key="product.productId"
          :value="product.productId"
        >
          {{ product.name }}
        </option>
      </select>
      <div v-if="errors.products" class="text-danger mt-1">{{ errors.products }}</div>
    </div>

    <!-- Hiển thị biến thể -->
    <div v-if="selectedProductId" class="mt-4">
      <h5>Biến thể của sản phẩm: {{ getProductName(selectedProductId) }}</h5>

      <div v-if="allVariantsMap[selectedProductId]?.length">
        <div
          v-for="variant in allVariantsMap[selectedProductId]"
          :key="variant.productVariantId"
          class="variant-box mb-3 p-3 border rounded shadow-sm"
        >
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              :id="'variant-' + variant.productVariantId"
              v-model="selectedVariants[variant.productVariantId].checked"
              @change="deleteError(variant.productVariantId)"
            />

            <label class="form-check-label" :for="'variant-' + variant.productVariantId">
              <strong>Màu:</strong> {{ variant.colorName || "Không có" }} -
              <strong>Size:</strong> {{ variant.sizeName || "Không có" }} -
              <strong>Giá:</strong> {{ variant.price }} - <strong>Tồn kho:</strong>
              {{ variant.stock }}
            </label>
          </div>

          <div
            v-if="selectedVariants[variant.productVariantId].checked"
            class="form-group mt-2"
          >
            <label>Số lượng khuyến mãi</label>
            <input
              type="number"
              min="0"
              :max="variant.stock"
              class="form-control"
              v-model.number="
                selectedVariants[variant.productVariantId].promotionQuantity
              "
              @input="deleteError(variant.productVariantId)"
            />

            <div
              v-if="errors.variants[variant.productVariantId]"
              class="text-danger mt-1"
            >
              {{ errors.variants[variant.productVariantId] }}
            </div>
          </div>
        </div>
        <div v-if="errors.variantsGlobal" class="text-danger mt-2">
          {{ errors.variantsGlobal }}
        </div>
      </div>
      <div v-else class="alert text-danger">
        <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
        Không có biến thể nào cho sản phẩm này.
      </div>
    </div>

    <button class="btn btn-success mt-3" @click="submitPromotionVariants">
      Lưu khuyến mãi
    </button>
  </div>
</template>

<style scoped>
.modal {
  display: block;
  z-index: 1050;
}
.text-danger {
  font-size: 0.9rem;
}
</style>
