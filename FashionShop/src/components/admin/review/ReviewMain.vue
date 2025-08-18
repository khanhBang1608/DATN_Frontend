<template>
  <div class="card p-4" ref="reviewContent">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">⭐ Quản lý Đánh giá sản phẩm</h2>
    </div>
    <!-- Lọc theo ngày đánh giá -->
    <div class="mb-4 admin-date-filter">
      <label class="form-label">Ngày đánh giá</label>
      <div class="d-flex align-items-center w-50">
        <input
          type="date"
          class="admin-date-input"
          v-model="filters.startDate"
          @change="fetchReviews(0)"
        />
        <span class="mx-2">Đến</span>
        <input
          type="date"
          class="admin-date-input"
          v-model="filters.endDate"
          @change="fetchReviews(0)"
        />
      </div>
    </div>

    <!-- Hàng 1: Loại tìm kiếm + Từ khóa + Đánh giá sao -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label">Loại tìm kiếm</label>
        <div class="admin-search-box">
          <select
            class="admin-select"
            v-model="filters.searchType"
            @change="fetchReviews(0)"
          >
            <option value="userFullName">Tên khách hàng</option>
            <option value="productName">Tên sản phẩm</option>
          </select>
        </div>
      </div>

      <div class="col-md-5">
        <label class="form-label">Từ khóa</label>
        <div class="admin-search-box">
          <input
            type="text"
            class="admin-search-text"
            :placeholder="
              filters.searchType === 'userFullName'
                ? 'Nhập tên khách hàng...'
                : 'Nhập tên sản phẩm...'
            "
            v-model="filters.searchKeyword"
            @input="fetchReviews(0)"
          />
          <i class="bi bi-search admin-search-icon"></i>
        </div>
      </div>

      <div class="col-md-3">
        <label class="form-label">Đánh giá sao</label>
        <div class="admin-search-box">
          <select class="admin-select" v-model="filters.rating" @change="fetchReviews(0)">
            <option value="">Tất cả</option>
            <option v-for="star in [1, 2, 3, 4, 5]" :key="star" :value="star">
              {{ star }} sao
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="row mt-2 mb-3">
      <div class="col-12 d-flex gap-2">
        <button class="btn btn-secondary" @click="resetFilter">Xóa tất cả bộ lọc</button>
      </div>
    </div>

    <!-- Bảng danh sách -->
    <div v-if="loading" class="text-center">Đang tải đánh giá...</div>
    <div v-else-if="error" class="text-center text-danger alert alert-danger">
      {{ error }}
      <button @click="error = null" class="btn btn-sm btn-outline-danger">Đóng</button>
    </div>
    <div v-else class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Sản phẩm</th>
            <th>Khách hàng</th>
            <th>Đánh giá</th>
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
            <td>{{ (currentPage - 1) * pageSize + review.reviewId }}</td>
            <td>{{ review.productName || "Không xác định" }}</td>
            <td>{{ review.userFullName || "Không xác định" }}</td>
            <td>
              <span class="rating-stars">{{ displayStars(review.rating) }}</span>
            </td>
            <td>{{ truncateComment(review.comment) }}</td>
            <td>{{ formatDate(review.reviewDate) }}</td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-info m-1"
                @click="viewReview(review.reviewId)"
              >
                <i class="bi bi-eye-fill"></i> Xem đánh giá
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="admin-pagination" v-if="totalPages > 1">
      <div
        class="admin-button admin-prev"
        :class="{ disabled: currentPage === 1 }"
        @click="changePage(currentPage - 1)"
      >
        &lt; Trước
      </div>
      <div
        v-for="page in displayedPages"
        :key="page"
        class="admin-page"
        :class="{ active: currentPage === page, ellipsis: page === '...' }"
        @click="page !== '...' && changePage(page)"
      >
        {{ page }}
      </div>
      <div
        class="admin-button admin-next"
        :class="{ disabled: currentPage === totalPages }"
        @click="changePage(currentPage + 1)"
      >
        Sau &gt;
      </div>
    </div>
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
      pageSize: 8,
      loading: false,
      error: null,
      filters: {
        rating: "",
        startDate: "",
        endDate: "",
        searchType: "userFullName",
        searchKeyword: "",
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredReviews.length / this.pageSize);
    },
    searchPlaceholder() {
      return this.filters.searchType === "userFullName"
        ? "Nhập tên khách hàng..."
        : "Nhập tên sản phẩm...";
    },
    // Tính toán các trang hiển thị
    displayedPages() {
      const pages = [];
      const maxPagesToShow = 5;

      if (this.totalPages <= maxPagesToShow) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        if (this.currentPage < 3) {
          pages.push(2, 3, 4);
          if (this.totalPages > 4) {
            pages.push("...");
          }
          pages.push(this.totalPages);
        } else if (this.currentPage >= this.totalPages - 2) {
          if (this.totalPages > 4) {
            pages.push("...");
          }
          pages.push(
            this.totalPages - 3,
            this.totalPages - 2,
            this.totalPages - 1,
            this.totalPages
          );
        } else {
          pages.push("...");
          const startPage = this.currentPage + 1;
          const endPage = Math.min(this.currentPage + 3, this.totalPages - 1);
          for (let i = startPage; i <= endPage; i++) {
            if (!pages.includes(i)) pages.push(i); // Tránh trùng lặp
          }
          if (endPage < this.totalPages) {
            pages.push(this.totalPages);
          }
        }
      }

      return pages;
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

    async fetchReviews(page = 0) {
      this.loading = true;
      this.error = null;
      try {
        this.reviews = await getAllReviews();
        this.applyFilters();
        this.currentPage = page + 1;
        this.updatePagination();
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
      let result = [...this.reviews];

      if (this.filters.rating) {
        result = result.filter((r) => r.rating === Number(this.filters.rating));
      }

      if (this.filters.startDate) {
        const start = new Date(this.filters.startDate);
        result = result.filter((r) => new Date(r.reviewDate) >= start);
      }

      if (this.filters.endDate) {
        const end = new Date(this.filters.endDate + "T23:59:59");
        result = result.filter((r) => new Date(r.reviewDate) <= end);
      }

      if (this.filters.searchKeyword.trim()) {
        const search = this.filters.searchKeyword.trim().toLowerCase();
        if (this.filters.searchType === "userFullName") {
          result = result.filter((r) =>
            (r.userFullName || "").toLowerCase().includes(search)
          );
        } else if (this.filters.searchType === "productName") {
          result = result.filter((r) =>
            (r.productName || "").toLowerCase().includes(search)
          );
        }
      }

      this.filteredReviews = result;
      this.currentPage = 1;
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
        await this.fetchReviews(this.currentPage - 1);
      } catch (error) {
        console.error("Error deleting review:", error.message);
        this.error = "Không thể xóa đánh giá.";
      } finally {
        this.loading = false;
      }
    },

    resetFilter() {
      this.filters = {
        rating: "",
        startDate: "",
        endDate: "",
        searchType: "userFullName",
        searchKeyword: "",
      };
      this.currentPage = 1;
      this.fetchReviews(0);
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
