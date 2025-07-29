<template>
  <div class="card p-4" ref="reviewContent">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
      <h2 class="mb-3 mb-md-0">⭐ Quản lý Đánh giá sản phẩm</h2>
    </div>
    <div class="mb-4">
      <!-- Đánh giá sao -->
      <div class="mb-3 w-25">
        <label class="form-label">Đánh giá</label>
        <select class="form-select" v-model="filters.rating">
          <option value="">Tất cả sao</option>
          <option v-for="rating in [1, 2, 3, 4, 5]" :key="rating" :value="rating">
            {{ rating }} sao
          </option>
        </select>
      </div>

      <!-- Ngày đánh giá -->
      <div class="mb-3">
        <label class="form-label">Ngày đánh giá</label>
        <div class="d-flex gap-2 flex-wrap">
          <input
            type="date"
            class="form-control"
            v-model="filters.startDate"
            placeholder="Từ ngày"
            style="max-width: 180px"
          />
          Đến
          <input
            type="date"
            class="form-control"
            v-model="filters.endDate"
            placeholder="Đến ngày"
            style="max-width: 180px"
          />
        </div>
      </div>

      <!-- Tên khách hàng -->
      <div class="mb-3 w-50">
        <label class="form-label">Tên khách hàng</label>
        <input
          type="text"
          class="form-control"
          v-model="filters.userFullName"
          placeholder="Nhập tên..."
        />
      </div>

      <!-- Nút lọc -->
      <div>
        <button class="btn btn-primary me-2" @click="applyFilters">🔍 Tìm</button>
        <button class="btn btn-secondary" @click="clearFilters">Xóa bộ lọc</button>
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
              <button
                class="btn btn-sm btn-danger m-1"
                @click="deleteReview(review.reviewId)"
              >
                🗑️
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
        this.reviews = await getAllReviews({
          ratings: this.filters.rating ? [this.filters.rating] : null,
          startDate: this.filters.startDate
            ? this.filters.startDate + "T00:00:00"
            : null,
          endDate: this.filters.endDate
            ? this.filters.endDate + "T23:59:59"
            : null,
          userFullName: this.filters.userFullName.trim() || null,
        });
        this.applyFilters();
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
      this.filteredReviews = [...this.reviews];
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
      };
      this.fetchReviews();
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
