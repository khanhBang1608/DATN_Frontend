<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📢 Quản lý Khuyến mãi</h2>
      <button class="btn btn-primary" @click="openModal()">
        <i class="bi bi-plus-circle"></i> Thêm khuyến mãi
      </button>
    </div>

    <div class="mb-4 admin-date-filter">
      <label class="form-label">Giảm giá (%)</label>
      <div class="d-flex align-items-center w-50">
        <input
          v-model="filters.discountMin"
          type="number"
          class="admin-number-input"
          placeholder="0"
          min="0"
          max="100"
          @input="applyFilters('filter')"
        />
        <span class="mx-2">Đến</span>
        <input
          v-model="filters.discountMax"
          type="number"
          class="admin-number-input"
          placeholder="100"
          min="0"
          max="100"
          @input="applyFilters('filter')"
        />
      </div>
    </div>

    <!-- Bộ lọc -->
    <div class="row g-3 mb-4">
      <!-- Loại tìm kiếm -->
      <div class="col-md-4">
        <label class="form-label">Loại tìm kiếm</label>
        <div class="admin-search-box">
          <select
            class="admin-select"
            v-model="filters.searchType"
            @change="
              resetFiltersExcept('search');
              resetAndFetch();
            "
          >
            <option value="code">Mã khuyến mãi</option>
            <option value="description">Tên chương trình</option>
          </select>
        </div>
      </div>

      <!-- Từ khóa -->
      <div class="col-md-5">
        <label class="form-label">Từ khóa</label>
        <div class="admin-search-box">
          <input
            type="text"
            class="admin-search-text"
            :placeholder="
              filters.searchType === 'code'
                ? 'Nhập mã khuyến mãi...'
                : 'Nhập tên chương trình...'
            "
            v-model="filters.searchKeyword"
            @input="applyFilters('search')"
          />
          <i class="bi bi-search admin-search-icon"></i>
        </div>
      </div>

      <!-- Trạng thái -->
      <div class="col-md-3">
        <label class="form-label">Trạng thái</label>
        <div class="admin-search-box">
          <select
            v-model="filters.status"
            class="admin-select"
            @change="applyFilters('filter')"
          >
            <option value="">Tất cả</option>
            <option :value="true">Đang hoạt động</option>
            <option :value="false">Ngừng hoạt động</option>
          </select>
        </div>
      </div>
    </div>

    <!-- <div class="mb-3">
      <button class="btn btn-secondary" @click="clearFilters">Xóa bộ lọc</button>
    </div> -->

    <!-- Bảng dữ liệu -->
    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã</th>
            <th>Tên chương trình</th>
            <th>Giảm %</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="promotions.length === 0">
            <td colspan="6" class="text-center text-white fs-5 py-4">
              <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              Không có mã khuyến mãi nào được tìm thấy.
            </td>
          </tr>
          <tr v-for="promo in promotions" :key="promo.id">
            <td>{{ promo.id }}</td>
            <td>{{ promo.code }}</td>
            <td>{{ promo.description }}</td>
            <td>{{ formatDiscount(promo.discountAmount) }}</td>
            <td>{{ formatDate(promo.startDate) }} - {{ formatDate(promo.endDate) }}</td>
            <td>
              <span
                :class="[
                  'badge text-light',
                  isCurrentlyActive(promo) ? 'bg-success' : 'bg-danger',
                ]"
              >
                {{ isCurrentlyActive(promo) ? "Đang hoạt động" : "Ngừng hoạt động" }}
              </span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning m-1" @click="openModal(promo.id)">
                <i class="bi bi-pencil-square"></i> Sửa
              </button>
              <button
                class="btn btn-sm btn-danger m-1"
                @click="deletePromotion(promo.id)"
              >
                <i class="bi bi-trash"></i> Xoá
              </button>
              <button
                class="btn btn-sm btn-info m-1"
                @click="goToPromotionProducts(promo.id)"
              >
                <i class="bi bi-box-seam"></i> Sản phẩm khuyến mãi
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div v-if="totalPages > 1" class="admin-pagination">
      <div
        class="admin-button admin-prev"
        :class="{ disabled: currentPage === 0 }"
        @click="changePage(currentPage - 1)"
      >
        &lt; prev
      </div>
      <div
        v-for="page in totalPages"
        :key="page"
        class="admin-page"
        :class="{ active: currentPage === page - 1 }"
        @click="changePage(page - 1)"
      >
        {{ page }}
      </div>
      <div
        class="admin-button admin-next"
        :class="{ disabled: currentPage === totalPages - 1 }"
        @click="changePage(currentPage + 1)"
      >
        next &gt;
      </div>
    </div>
  </div>

  <!-- Modal thêm/sửa -->
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
              <label class="form-label fw-semibold">Giảm %</label>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useRouter } from "vue-router";

const router = useRouter();
const promotions = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const token = localStorage.getItem("token");

const filters = ref({
  searchType: "code",
  searchKeyword: "",
  status: "",
  discountMin: "",
  discountMax: "",
  isCurrentlyActive: false,
});

const form = ref({
  code: "",
  description: "",
  discountAmount: 0,
  startDate: "",
  endDate: "",
  status: true,
});

const errors = ref({});
const currentPage = ref(0);
const pageSize = ref(8);
const totalPages = ref(0);

const fetchPromotions = async () => {
  const res = await axios.get(`http://localhost:8080/api/admin/promotions/paging`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page: currentPage.value, size: pageSize.value },
  });
  promotions.value = res.data.content;
  totalPages.value = res.data.totalPages;
};

const resetFiltersExcept = (except) => {
  if (except !== "search") {
    filters.value.searchKeyword = "";
    filters.value.searchType = "code";
  }
  if (except !== "status") filters.value.status = "";
  if (except !== "discount") {
    filters.value.discountMin = "";
    filters.value.discountMax = "";
  }
  if (except !== "active") filters.value.isCurrentlyActive = false;
};

const resetAndFetch = () => {
  applyFilters();
};

const applyFilters = async (mode) => {
  // mode: "search" hoặc "filter" để biết đang thao tác gì
  if (mode === "search") {
    // Khi tìm kiếm thì reset toàn bộ filter
    filters.value.status = "";
    filters.value.discountMin = "";
    filters.value.discountMax = "";
    filters.value.isCurrentlyActive = false;
  } else if (mode === "filter") {
    // Khi lọc thì reset toàn bộ search
    filters.value.searchKeyword = "";
    filters.value.searchType = "code";
  }

  // Reset phân trang về trang đầu tiên
  currentPage.value = 0;

  // Lấy dữ liệu từ API
  await fetchPromotions();

  // Tiến hành lọc dữ liệu trên client
  let filtered = [...promotions.value];
  const today = new Date().toISOString().split("T")[0];

  if (filters.value.searchKeyword) {
    if (filters.value.searchType === "code") {
      filtered = filtered.filter((p) =>
        p.code.toLowerCase().includes(filters.value.searchKeyword.toLowerCase())
      );
    } else if (filters.value.searchType === "description") {
      filtered = filtered.filter((p) =>
        p.description.toLowerCase().includes(filters.value.searchKeyword.toLowerCase())
      );
    }
  }

  if (filters.value.status !== "")
    filtered = filtered.filter((p) => p.status === JSON.parse(filters.value.status));

  if (filters.value.discountMin)
    filtered = filtered.filter((p) => p.discountAmount >= +filters.value.discountMin);

  if (filters.value.discountMax)
    filtered = filtered.filter((p) => p.discountAmount <= +filters.value.discountMax);

  if (filters.value.isCurrentlyActive) {
    filtered = filtered.filter((p) => p.startDate <= today && p.endDate >= today);
  }

  promotions.value = filtered;
};

const clearFilters = async () => {
  filters.value = {
    searchType: "code",
    searchKeyword: "",
    status: "",
    discountMin: "",
    discountMax: "",
    isCurrentlyActive: false,
  };
  await fetchPromotions();
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchPromotions();
  }
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
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
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

const formatDiscount = (val) => `${val} %`;

const formatDate = (d) =>
  new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const clearError = (field) => (errors.value[field] = null);

const isCurrentlyActive = (promo) => {
  const today = new Date().toISOString().split("T")[0];
  return promo.status === true && promo.startDate <= today && promo.endDate >= today;
};

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
.custom-table thead {
  background-color: #1f1f1f;
}
.custom-table th,
.custom-table td {
  color: #fff;
  vertical-align: middle;
}
</style>
