<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProductById } from "@/api/adminProductAPI";
import axios from "axios";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const token = localStorage.getItem("token") || "";

const variants = ref([]);
const colors = ref([]);
const sizes = ref([]);
const errorMessage = ref("");
const showModal = ref(false);
const isEdit = ref(false);
const currentVariantId = ref(null);
const productName = ref("");
const totalStock = ref(0);


const variant = ref({
  colorId: "",
  sizeId: "",
  price: null,
  stock: 0,
  image: null,
  imageName: "",
});

const previewImage = ref(null);

const fieldErrors = ref({
  colorId: "",
  sizeId: "",
  price: "",
  stock: "",
  image: "",
});

// Fetch list
const fetchVariants = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/admin/products/${productId}/variants`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const sortedVariants = response.data.sort((a, b) => b.productVariantId - a.productVariantId);
    variants.value = sortedVariants;

    // 👉 Tính tổng tồn kho
    totalStock.value = sortedVariants.reduce((acc, cur) => acc + cur.stock, 0);
  } catch (error) {
    console.error("Lỗi khi fetch biến thể:", error);
    iziToast.error({
      title: "Lỗi",
      message: "Không thể tải danh sách biến thể",
      position: "topRight",
    });
  }
};


const fetchProductInfo = async () => {
  try {
    const productData = await getProductById(productId);
    productName.value = productData.name;
  } catch (error) {
    console.error("Không thể tải tên sản phẩm", error);
    iziToast.error({
      title: "Lỗi",
      message: "Không thể tải thông tin sản phẩm",
      position: "topRight",
    });
  }
};


const fetchColorsAndSizes = async () => {
  try {
    const [colorRes, sizeRes] = await Promise.all([
      axios.get("http://localhost:8080/api/admin/colors", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:8080/api/admin/sizes", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    colors.value = colorRes.data;
    sizes.value = sizeRes.data;
  } catch {
    iziToast.error({
      title: "Lỗi",
      message: "Không thể tải màu sắc và size",
      position: "topRight",
    });
  }
};

// Modal actions
const openAddModal = () => {
  resetVariant();
  isEdit.value = false;
  showModal.value = true;
};

const openEditModal = async (id) => {
  isEdit.value = true;
  currentVariantId.value = id;
  resetFieldErrors();

  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/admin/product-variants/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    variant.value = {
      colorId: data.colorId ?? "",
      sizeId: data.sizeId ?? "",
      price: data.price,
      stock: data.stock,
      image: null,
      imageName: data.imageName,
    };
    previewImage.value = null;
    showModal.value = true;
  } catch {
    iziToast.error({
      title: "Lỗi",
      message: "Không thể tải dữ liệu biến thể",
      position: "topRight",
    });
  }
};

const closeModal = () => {
  showModal.value = false;
};

const resetVariant = () => {
  variant.value = {
    colorId: "",
    sizeId: "",
    price: null,
    stock: 0,
    image: null,
    imageName: "",
  };
  previewImage.value = null;
  resetFieldErrors();
};

const clearFieldError = (field) => {
  fieldErrors.value[field] = "";
};

const resetFieldErrors = () => {
  for (const key in fieldErrors.value) fieldErrors.value[key] = "";
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  variant.value.image = file;

  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImage.value = event.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    previewImage.value = null;
  }
};

// Submit form
const handleSubmit = async () => {
  resetFieldErrors();

  const formData = new FormData();
  formData.append("productId", productId);
  formData.append("colorId", variant.value.colorId);
  formData.append("sizeId", variant.value.sizeId);
  formData.append("price", variant.value.price || "");
  formData.append("stock", variant.value.stock);
  if (variant.value.image) {
    formData.append("image", variant.value.image);
  }

  const url = isEdit.value
    ? `http://localhost:8080/api/admin/product-variants/update/${currentVariantId.value}`
    : `http://localhost:8080/api/admin/product-variants`;

  const method = isEdit.value ? "put" : "post";

  try {
    await axios[method](url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    iziToast.success({
      title: "Thành công",
      message: isEdit.value ? "Cập nhật biến thể thành công" : "Thêm biến thể thành công",
      position: "topRight",
    });

    closeModal();
    fetchVariants();
  } catch (error) {
    const msg = error.response?.data;
    if (typeof msg === "string" && msg.includes("Lỗi dữ liệu:")) {
      const lines = msg.replace("Lỗi dữ liệu:", "").trim().split("\n");
      for (const line of lines) {
        const [field, err] = line.split(":").map((s) => s.trim());
        if (fieldErrors.value[field] !== undefined) {
          fieldErrors.value[field] = err;
        }
      }
    } else {
      iziToast.error({
        title: "Lỗi hệ thống",
        message: msg || "Đã xảy ra lỗi không xác định",
        position: "topRight",
      });
    }
  }
};

const deleteVariant = async (variantId) => {
  const result = await Swal.fire({
    title: "Bạn chắc chắn?",
    text: "Biến thể sẽ bị xoá vĩnh viễn!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.delete(`http://localhost:8080/api/admin/product-variants/${variantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    iziToast.success({
      title: "Thành công",
      message: "Đã xoá biến thể thành công",
      position: "topRight",
    });

    fetchVariants();
  } catch (error) {
    iziToast.error({
      title: "Lỗi",
      message: "Không thể xoá biến thể",
      position: "topRight",
    });
  }
};

const handleBack = () => {
  router.push("/admin/product");
};

onMounted(async () => {
  await fetchProductInfo();
  await fetchColorsAndSizes();
  await fetchVariants();
});

</script>

<template>
  <div class="container py-5">
    <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-white fw-bold fs-4 mb-3">
          📦 Biến thể của sản phẩm <span class="text-info">{{ productName }}</span> (ID: {{ productId }})
        </h2>
        <div class="d-flex align-items-center flex-wrap gap-3">
          <span class="badge bg-gradient fs-6 shadow-sm p-3">
            🧮 <strong>Tổng tồn kho: {{ totalStock }}</strong>
          </span>
          <button class="btn btn-success" @click="openAddModal">+ Thêm biến thể</button>
        </div>

      </div>

      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <div class="table-responsive">
        <table class="table table-hover align-middle text-light custom-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh</th>
              <th>Màu</th>
              <th>Size</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(variant, index) in variants" :key="variant.productVariantId">
              <td>{{ index + 1 }}</td>
              <td>
                <img v-if="variant.imageName" :src="`http://localhost:8080/images/${variant.imageName}`" width="80" />
              </td>
              <td>{{ variant.colorName }}</td>
              <td>{{ variant.sizeName || "Không có" }}</td>
              <td>{{ variant.price.toLocaleString() }}đ</td>
              <td>{{ variant.stock }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-1" @click="openEditModal(variant.productVariantId)">
                  ✏️ Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteVariant(variant.productVariantId)">
                  🗑️ Xoá
                </button>
              </td>
            </tr>
            <tr v-if="variants.length === 0">
              <td colspan="7" class="text-center text-white fs-5 py-4">
                <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                Không có biến thể nào được tìm thấy.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-link text-white" @click="handleBack">Quay về</button>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Cập nhật" : "Thêm" }} biến thể sản phẩm #{{ productId }}
            </h5>
            <button class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Màu sắc</label>
                <select class="form-select" v-model="variant.colorId" @change="clearFieldError('colorId')">
                  <option value="">-- Chọn màu --</option>
                  <option v-for="color in colors" :key="color.colorId" :value="color.colorId">
                    {{ color.colorName }}
                  </option>
                </select>
                <div class="text-danger small">{{ fieldErrors.colorId }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Size</label>
                <select class="form-select" v-model="variant.sizeId" @change="clearFieldError('sizeId')">
                  <option value="">-- Không có --</option>
                  <option v-for="size in sizes" :key="size.sizeId" :value="size.sizeId">
                    {{ size.sizeName }}
                  </option>
                </select>
                <div class="text-danger small">{{ fieldErrors.sizeId }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Giá</label>
                <input type="number" class="form-control" v-model="variant.price" @input="clearFieldError('price')" />

                <div class="text-danger small">{{ fieldErrors.price }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Tồn kho</label>
                <input type="number" class="form-control" v-model="variant.stock" @input="clearFieldError('stock')" />

                <div class="text-danger small">{{ fieldErrors.stock }}</div>
              </div>

              <div class="col-md-12">
                <label class="form-label">Ảnh</label>
                <input type="file" class="form-control" @change="
                  (e) => {
                    handleImageChange(e);
                    clearFieldError('image');
                  }
                " />

                <div class="text-danger small">{{ fieldErrors.image }}</div>

                <div v-if="previewImage" class="mt-2">
                  <p>Ảnh xem trước:</p>
                  <img :src="previewImage" width="100" />
                </div>

                <div v-else-if="isEdit && variant.imageName" class="mt-2">
                  <p>Ảnh hiện tại:</p>
                  <img :src="`http://localhost:8080/images/${variant.imageName}`" width="100" />
                </div>
              </div>

              <div class="col-12 d-flex justify-content-end">
                <button class="btn btn-secondary me-2" type="button" @click="closeModal">
                  Hủy
                </button>
                <button class="btn btn-success" type="submit">
                  {{ isEdit ? "Cập nhật" : "Thêm mới" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table th,
table td {
  vertical-align: middle;
  text-align: center;
}

.btn-link.text-white {
  margin-right: 40px;
}

.btn-link.text-white:hover {
  text-decoration: none;
  color: #fff;
  /* Đảm bảo màu trắng khi hover */
}
</style>
