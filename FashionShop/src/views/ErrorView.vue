<template>
  <div
    class="error-page d-flex align-items-center justify-content-center vh-100 bg-light"
  >
    <div class="card shadow-sm border-0 p-4" style="max-width: 920px; width: 100%">
      <div class="row g-0 align-items-center">
        <div class="col-md-6 text-center p-4">
          <!-- Illustration -->
          <div class="mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="220"
              height="220"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-alert-circle text-primary"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <circle cx="12" cy="16" r="0.5"></circle>
            </svg>
          </div>
          <h1 class="display-4 fw-bold mb-1">404</h1>
          <p class="mb-0 text-muted">Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
        </div>

        <div class="col-md-6 p-4">
          <div class="card-body">
            <h3 class="card-title text-black">Ôi không — trang lỗi!</h3>
            <p class="card-text text-muted">
              Có thể đường dẫn bạn nhập sai hoặc dữ liệu đã bị xóa. Nếu bạn nghĩ đây là
              lỗi, vui lòng liên hệ với bộ phận hỗ trợ.
            </p>

            <ul class="list-unstyled mb-3">
              <!-- <li><strong class="text-black">URL:</strong> <code class="text-black">{{ currentPath }}</code></li> -->
              <li v-if="suggestion" class="text-muted">Gợi ý: {{ suggestion }}</li>
            </ul>

            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-primary" @click="goHome">
                <i class="bi bi-house-door me-1"></i> Về trang chủ
              </button>

              <button class="btn btn-outline-secondary" @click="goBack">
                <i class="bi bi-arrow-left-circle me-1"></i> Quay lại
              </button>

              <button class="btn btn-outline-danger ms-auto" @click="reportIssue">
                <i class="bi bi-exclamation-triangle me-1"></i> Báo lỗi
              </button>
            </div>

            <hr />

            <form class="mt-3" @submit.prevent="onSearch">
              <label for="searchInput" class="form-label visually-hidden"
                >Tìm sản phẩm hoặc trang</label
              >
              <div class="input-group">
                <input
                  id="searchInput"
                  v-model="query"
                  type="search"
                  class="form-control"
                  placeholder="Tìm sản phẩm, danh mục, hoặc trang..."
                />
                <button class="btn btn-outline-primary" type="submit">Tìm</button>
              </div>
              <div v-if="query" class="mt-2 text-muted small">
                Bạn tìm: <strong>{{ query }}</strong>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="text-center mt-3 small text-muted">
        Nếu bạn muốn, thử xóa cache hoặc kiểm tra lại URL. © {{ year }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const query = ref("");
const year = new Date().getFullYear();

const currentPath = computed(() => route.fullPath);

// Gợi ý cơ bản dựa vào đường dẫn
const suggestion = computed(() => {
  if (route.path.includes("product-detail"))
    return "Kiểm tra xem ID sản phẩm có đúng không hoặc sản phẩm đã bị xóa.";
  if (route.path.startsWith("/admin"))
    return "Bạn có thể cần đăng nhập với quyền quản trị.";
  return null;
});

function goHome() {
  router.push({ path: "/" });
}

function goBack() {
  router.back();
}

function reportIssue() {
  // Thay thế bằng logic báo cáo thực tế (mở modal, gọi API, chuyển đến trang liên hệ...)
  const subject = encodeURIComponent("Báo lỗi 404: " + currentPath.value);
  const body = encodeURIComponent("Mô tả (tùy chọn):\n");
  window.location.href = `mailto:support@yourdomain.com?subject=${subject}&body=${body}`;
}

function onSearch() {
  if (!query.value) return;
  // Điều hướng tới trang tìm kiếm với query keyword
  router.push({ path: "/product", query: { keyword: query.value } });
}
</script>

<style scoped>
.error-page {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}
.card .feather {
  width: 96px;
  height: 96px;
  color: #0d6efd;
}
.code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Segoe UI Mono",
    monospace;
}

/* Responsive tweaks */
@media (max-width: 767.98px) {
  .card {
    padding: 1rem;
  }
  .feather {
    width: 72px;
    height: 72px;
  }
}
</style>
