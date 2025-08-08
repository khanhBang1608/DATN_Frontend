<template>
  <div class="card p-4" ref="reviewContent">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
      <h2 class="mb-3 mb-md-0">⭐ Quản lý Đánh giá sản phẩm</h2>
    </div>
    <div class="mb-4">
      <!-- Hàng 1: Đánh giá + Ngày đánh giá -->
      <div class="d-flex flex-wrap gap-3 mb-3">
        <!-- Đánh giá sao -->
        <div style="min-width: 180px">
          <label class="form-label">Đánh giá</label>
          <select class="form-select" v-model="filters.rating">
            <option value="">Tất cả sao</option>
            <option v-for="rating in [1, 2, 3, 4, 5]" :key="rating" :value="rating">
              {{ rating }} sao
            </option>
          </select>
        </div>

        <!-- Ngày đánh giá -->
        <div>
          <label class="form-label">Ngày đánh giá</label>
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <input
              type="date"
              class="form-control"
              v-model="filters.startDate"
              placeholder="Từ ngày"
              style="max-width: 160px"
            />
            <span>đến</span>
            <input
              type="date"
              class="form-control"
              v-model="filters.endDate"
              placeholder="Đến ngày"
              style="max-width: 160px"
            />
          </div>
        </div>
      </div>

      <!-- Hàng 2: Tên khách hàng + Tên sản phẩm + Nút -->
      <div class="d-flex flex-wrap gap-3 align-items-end">
        <!-- Tên khách hàng -->
        <div style="min-width: 250px; flex-grow: 1">
          <label class="form-label">Tên khách hàng</label>
          <input
            type="text"
            class="form-control"
            v-model="filters.userFullName"
            placeholder="Nhập tên..."
          />
        </div>

        <!-- Tên sản phẩm -->
        <div style="min-width: 250px; flex-grow: 1">
          <label class="form-label">Tên sản phẩm</label>
          <input
            type="text"
            class="form-control"
            v-model="filters.productName"
            placeholder="Nhập tên sản phẩm..."
          />
        </div>

        <!-- Nút tìm kiếm và xóa -->
        <div class="d-flex gap-2">
          <button class="btn btn-primary" @click="applyFilters">🔍 Tìm</button>
          <button class="btn btn-secondary" @click="clearFilters">Xóa bộ lọc</button>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2 mb-3">
      <button class="btn btn-danger" @click="exportToPDF" :disabled="loading">
        📄 Export PDF
      </button>
    </div>

    <div v-if="loading" class="text-center">
      <p>Đang tải đánh giá...</p>
    </div>
    <div
      v-else-if="error"
      class="text-center text-danger alert alert-danger"
      role="alert"
    >
      {{ error }}
      <button @click="error = null" class="btn btn-sm btn-outline-danger">Đóng</button>
    </div>
    <div v-else class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Khách hàng</th>
            <th>Số sao</th>
            <th>Nội dung</th>
            <th>Ngày</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedReviews.length === 0">
            <td colspan="6" class="text-center text-white fs-5 py-4">
              <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              Không có đánh giá nào được tìm thấy.
            </td>
          </tr>
          <tr v-for="review in paginatedReviews" :key="review.reviewId">
            <td>{{ review.productName || "Không xác định" }}</td>
            <td>{{ review.userFullName || "Không xác định" }}</td>
            <td>
              <span class="rating-stars">{{ displayStars(review.rating) }}</span>
            </td>
            <td>{{ truncateComment(review.comment) }}</td>
            <td>{{ formatDate(review.reviewDate) }}</td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-info text-white m-1"
                @click="viewReview(review.reviewId)"
              >
                👁️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav class="mt-4" v-if="filteredReviews.length > pageSize">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">«</a>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">»</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { getAllReviews, deleteReview } from "@/api/admin/reviewAPI";

export default {
  name: "ReviewMain",
  data() {
    return {
      reviews: [],
      filteredReviews: [],
      paginatedReviews: [],
      currentPage: 1,
      pageSize: 10,
      loading: false,
      error: null,
      filters: {
        rating: "",
        startDate: "",
        endDate: "",
        userFullName: "",
        productName: "",
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredReviews.length / this.pageSize);
    },
  },
  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(date));
    },
    truncateComment(comment) {
      return comment.length > 50 ? comment.slice(0, 47) + "..." : comment;
    },
    displayStars(rating) {
      return "★".repeat(rating) + "☆".repeat(5 - rating);
    },
    async fetchReviews() {
      this.loading = true;
      this.error = null;
      try {
        this.reviews = await getAllReviews(); // lấy toàn bộ
        this.applyFilters(); // lọc tại frontend
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
        this.error = error.message.includes("Access denied")
          ? "Bạn không có quyền truy cập. Vui lòng đăng nhập tài khoản admin."
          : "Không thể tải danh sách đánh giá.";
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      this.currentPage = 1;
      let result = [...this.reviews];

      if (this.filters.rating) {
        result = result.filter(r => r.rating === Number(this.filters.rating));
      }

      if (this.filters.startDate) {
        const start = new Date(this.filters.startDate);
        result = result.filter(r => new Date(r.reviewDate) >= start);
      }

      if (this.filters.endDate) {
        const end = new Date(this.filters.endDate + "T23:59:59");
        result = result.filter(r => new Date(r.reviewDate) <= end);
      }

      if (this.filters.userFullName.trim()) {
        const search = this.filters.userFullName.trim().toLowerCase();
        result = result.filter(r =>
          (r.userFullName || "").toLowerCase().includes(search)
        );
      }

      if (this.filters.productName.trim()) {
        const search = this.filters.productName.trim().toLowerCase();
        result = result.filter(r =>
          (r.productName || "").toLowerCase().includes(search)
        );
      }

      this.filteredReviews = result;
      this.updatePagination();
    },
    updatePagination() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.paginatedReviews = this.filteredReviews.slice(start, end);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },
    async viewReview(reviewId) {
      this.$emit("view-review", reviewId);
    },
    async deleteReview(reviewId) {
      if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
      this.loading = true;
      this.error = null;
      try {
        await deleteReview(reviewId);
        await this.fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error.message);
        this.error = "Không thể xóa đánh giá.";
      } finally {
        this.loading = false;
      }
    },
    clearFilters() {
      this.filters = {
        rating: "",
        startDate: "",
        endDate: "",
        userFullName: "",
        productName: "",
      };
      this.applyFilters(); // chỉ cần gọi lại lọc
    },
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.error = "Vui lòng đăng nhập tài khoản admin.";
      this.$router.push("/login");
    } else {
      this.fetchReviews();
    }
  },
};
</script>

<style scoped>
.rating-stars {
  color: #ffc107;
}
.alert-danger {
  max-width: 600px;
  margin: 20px auto;
}
.btn-primary {
  background-color: #3498db;
  border-color: #3498db;
}
.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}
.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}
.form-select[multiple] {
  height: auto;
}
</style>
