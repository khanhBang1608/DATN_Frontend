<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { getAllCategories } from "@/api/adminCategoryAPI";
import { addProduct, updateProduct, getProductById } from "@/api/adminProductAPI";
import { getTotalStockByProductId } from "@/api/admin/ProductStockAPI";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import Editor from "@tinymce/tinymce-vue";

const errors = ref({});

const router = useRouter();
const products = ref([]);
const token = localStorage.getItem("token");

const showModal = ref(false);
const isEditing = ref(false);
const currentProductId = ref(null);

// ... (phần còn lại của code hiện có của bạn)

const product = ref({
  name: "",
  description: "",
  status: true,
  categoryId: "",
});
// Bộ lọc nâng cao
const filters = ref({
  searchType: "product", // "product" hoặc "category"
  keyword: "",
  minPrice: "",
  maxPrice: "",
  status: "",
  interactionSort: "",
  priceSort: "",
});

const resetFilter = () => {
  filters.value = {
    searchType: "product",
    keyword: "",
    minPrice: "",
    maxPrice: "",
    status: "",
    interactionSort: "",
    priceSort: "",
  };
};

const categories = ref([]);

const totalPages = ref(0);
const currentPage = ref(0);

const filteredProducts = computed(() => {
  let list = [...products.value];

  // Lọc theo kiểu tìm
  if (filters.value.keyword.trim()) {
    const keyword = filters.value.keyword.trim().toLowerCase();

    if (filters.value.searchType === "product") {
      list = list.filter((p) => (p.name || "").toLowerCase().includes(keyword));
    } else if (filters.value.searchType === "category") {
      list = list.filter((p) => (p.categoryName || "").toLowerCase().includes(keyword));
    }
  }

  // Lọc theo giá
  list = list.filter((p) => {
    const price = getMinPrice(p.variants);
    const minOk = !filters.value.minPrice || price >= Number(filters.value.minPrice);
    const maxOk = !filters.value.maxPrice || price <= Number(filters.value.maxPrice);
    return minOk && maxOk;
  });

  // Lọc theo trạng thái
  if (filters.value.status !== "") {
    const isActive = filters.value.status === "true";
    list = list.filter((p) => p.status === isActive);
  }

  // Sắp xếp theo tương tác
  if (filters.value.interactionSort) {
    list.sort((a, b) => {
      const totalA = (a.viewCount || 0) + (a.favoriteCount || 0) + (a.cartCount || 0);
      const totalB = (b.viewCount || 0) + (b.favoriteCount || 0) + (b.cartCount || 0);
      return filters.value.interactionSort === "desc" ? totalB - totalA : totalA - totalB;
    });
  }

  // Sắp xếp theo giá
  if (filters.value.priceSort) {
    list.sort((a, b) => {
      const priceA = getMinPrice(a.variants);
      const priceB = getMinPrice(b.variants);
      return filters.value.priceSort === "asc" ? priceA - priceB : priceB - priceA;
    });
  }

  return list;
});

const getTotalVariantCount = computed(() => {
  return products.value.reduce((total, product) => {
    return total + (product.variants?.length || 0);
  }, 0);
});

const getTotalStockCount = computed(() => {
  return products.value.reduce((total, product) => {
    return total + (product.totalStock || 0);
  }, 0);
});

const fetchProducts = async (page = 0) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/admin/products?page=${page}&size=8`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    products.value = response.data.products;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage;

    // Lấy stock song song cho nhanh
    await Promise.all(
      products.value.map(async (p) => {
        try {
          const stockData = await getTotalStockByProductId(p.productId);
          p.totalStock = stockData.totalStock;
        } catch {
          p.totalStock = 0;
        }
      })
    );
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
};

watch(
  () => ({ ...filters.value }),
  () => {
    currentPage.value = 0;
    fetchProducts(0);
  },
  { deep: true }
);

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
    else if (product.value.description.length > 300)
      errors.value.description = "Mô tả không được vượt quá 300 ký tự";

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

const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;

  if (totalPages.value <= maxPagesToShow) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage.value < 3) {
      pages.push(2, 3, 4);
      if (totalPages.value > 4) {
        pages.push("...");
      }
      pages.push(totalPages.value);
    } else if (currentPage.value >= totalPages.value - 2) {
      if (totalPages.value > 4) {
        pages.push("...");
      }
      pages.push(
        totalPages.value - 3,
        totalPages.value - 2,
        totalPages.value - 1,
        totalPages.value
      );
    } else {
      pages.push("...");
      pages.push(currentPage.value, currentPage.value + 1, currentPage.value + 2);
      if (currentPage.value + 2 < totalPages.value - 1) {
        pages.push("...");
      }
      pages.push(totalPages.value);
    }
  }

  return pages;
});

onMounted(fetchProducts);

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    fetchProducts(page);
  }
};
</script>
<template>
  <div class="card p-4">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <h2 class="m-0">🛍️ Quản lý sản phẩm</h2>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle"></i> Thêm sản phẩm
      </button>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-md-3">
        <div class="admin-date-filter">
          <label class="form-label">Giá từ</label>
          <input
            v-model="filters.minPrice"
            type="number"
            class="admin-number-input"
            placeholder="0"
          />
        </div>
      </div>

      <!-- Giá đến -->
      <div class="col-md-3">
        <label class="form-label">Giá đến</label>
        <input
          v-model="filters.maxPrice"
          type="number"
          class="admin-number-input"
          placeholder="∞"
        />
      </div>
    </div>

    <div class="row g-3 mb-3">
      <!-- Sắp xếp tương tác -->
      <div class="col-md-3">
        <label class="form-label">Sắp xếp tương tác</label>
        <div class="admin-search-box">
          <select v-model="filters.interactionSort" class="admin-select">
            <option value="">Mặc định</option>
            <option value="desc">Cao → Thấp</option>
            <option value="asc">Thấp → Cao</option>
          </select>
        </div>
      </div>

      <!-- Sắp xếp giá -->
      <div class="col-md-3">
        <label class="form-label">Sắp xếp giá</label>
        <div class="admin-search-box">
          <select v-model="filters.priceSort" class="admin-select">
            <option value="">Mặc định</option>
            <option value="asc">Thấp → Cao</option>
            <option value="desc">Cao → Thấp</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bộ lọc & tìm kiếm -->
    <div class="row g-3 mb-3">
      <!-- Tìm theo -->
      <div class="col-md-4">
        <label class="form-label">Loại tìm kiếm</label>
        <div class="admin-search-box">
          <select v-model="filters.searchType" class="admin-select">
            <option value="product">Tên sản phẩm</option>
            <option value="category">Tên danh mục</option>
          </select>
        </div>
      </div>

      <!-- Từ khóa -->
      <div class="col-md-5">
        <label class="form-label">Từ khóa</label>
        <div class="admin-search-box">
          <input
            v-model="filters.keyword"
            type="text"
            class="admin-search-text"
            :placeholder="
              filters.searchType === 'product'
                ? 'Nhập tên sản phẩm...'
                : 'Nhập tên danh mục...'
            "
          />
          <i class="bi bi-search admin-search-icon"></i>
        </div>
      </div>

      <!-- Trạng thái -->
      <div class="col-md-3">
        <label class="form-label">Trạng thái</label>
        <div class="admin-search-box">
          <select v-model="filters.status" class="admin-select">
            <option value="">Tất cả</option>
            <option value="true">Đang bán</option>
            <option value="false">Ngừng bán</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Nút -->
    <div class="row mt-2 mb-3">
      <div class="col-12 d-flex gap-2">
        <button class="btn btn-secondary" @click="resetFilter">Xóa tất cả bộ lọc</button>
      </div>
    </div>

    <!-- Thống kê -->
    <div class="mb-3 d-flex flex-wrap gap-2">
      <!-- Tổng biến thể -->
      <span
        class="badge fs-6 shadow-sm py-2 px-3 d-flex align-items-center gap-2 text-white"
        style="background: linear-gradient(135deg, #28a745, #20c997)"
      >
        <i class="bi bi-box-seam-fill fs-5"></i>
        Tổng biến thể: <strong class="text-danger">{{ getTotalVariantCount }}</strong>
      </span>

      <!-- Tổng tồn kho -->
      <span
        class="badge fs-6 shadow-sm py-2 px-3 d-flex align-items-center gap-2 text-white"
        style="background: linear-gradient(135deg, #17a2b8, #0d6efd)"
      >
        <i class="bi bi-tags-fill fs-5"></i>
        Tổng tồn kho: <strong class="text-danger">{{ getTotalStockCount }}</strong>
      </span>
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
            <th>Tồn kho</th>
            <th>Lượng tương tác</th>
            <th>Giá từ</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in filteredProducts" :key="product.productId">
            <td>{{ index + 1 + currentPage * 10 }}</td>
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
            <td>{{ product.totalStock }}</td>
            <td>
              <div class="d-flex flex-column gap-1">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-eye text-info"></i>
                  {{ product.viewCount || 0 }} lượt xem
                </span>
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-heart-fill text-danger"></i>
                  {{ product.favoriteCount || 0 }} yêu thích
                </span>
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-cart-fill"></i>
                  {{ product.cartCount || 0 }} trong giỏ
                </span>
              </div>
            </td>

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
                <i class="bi bi-pencil-square"></i> Sửa
              </button>
              <button
                class="btn btn-sm btn-info m-1"
                @click="goToVariantList(product.productId)"
              >
                <i class="bi bi-box-seam"></i> Biến thể
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="admin-pagination">
      <div
        class="admin-button admin-prev"
        :class="{ disabled: currentPage === 0 }"
        @click="changePage(currentPage - 1)"
      >
        &lt; Trước
      </div>

      <!-- Hiển thị các trang động -->
      <div
        v-for="page in displayedPages"
        :key="page"
        class="admin-page"
        :class="{ active: currentPage === page - 1, ellipsis: page === '...' }"
        @click="page !== '...' && changePage(page - 1)"
      >
        {{ page }}
      </div>

      <div
        class="admin-button admin-next"
        :class="{ disabled: currentPage === totalPages - 1 }"
        @click="changePage(currentPage + 1)"
      >
        Sau &gt;
      </div>
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
              <Editor
                api-key="uq49m95egvz7u4v198d5akt3drd5bc4f4h3h6tjdcz80d5wo"
                v-model="product.description"
                :init="{
                  toolbar_mode: 'sliding',
                  plugins: [
                    'anchor',
                    'autolink',
                    'charmap',
                    'codesample',
                    'emoticons',
                    'link',
                    'lists',
                    'media',
                    'searchreplace',
                    'table',
                    'visualblocks',
                    'wordcount',
                  ],
                  toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                  tinycomments_mode: 'embedded',
                  tinycomments_author: 'Author name',
                  uploadcare_public_key: 'a1c1977a399e5039e233',
                }"
              />
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
