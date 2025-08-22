<script>
import { ref, onMounted } from "vue";
import { getReviewsByCurrentUser } from "@/api/user/reviewAPI"; // hoặc getReviewsByCurrentUser

export default {
  setup() {
    const reviews = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");

    const fetchReviews = async () => {
      try {
        loading.value = true;
        // Nếu API có endpoint getReviewsByCurrentUser thì dùng:
        // const res = await getReviewsByCurrentUser();
        const res = await getReviewsByCurrentUser();
        reviews.value = res;
      } catch (err) {
        errorMessage.value = err.message || "Lỗi khi tải dữ liệu";
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateString) => {
      const d = new Date(dateString);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    onMounted(fetchReviews);

    return { reviews, loading, errorMessage, formatDate };
  },
};
</script>
<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="/user/account" class="custom-breadcrumb-link">Tổng quan tài khoản</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Lịch sử đánh giá</a
      >
    </nav>
  </div>
  <div class="container account-summary-container my-5">
    <div class="row">
      <div class="col-md-2 account-sidebar d-none d-md-block">
        <a href="/user/account">Tổng quan tài khoản</a><br />
        <a href="/user/profile">Thông tin của tôi</a><br />
        <a href="/user/change-password">Đổi mật khẩu</a><br />
        <a href="/user/listaddress">Sổ địa chỉ</a><br />
        <a href="#" class="active">Đánh giá của tôi</a><br />
        <a href="/user/order-management">Mua hàng & Trả hàng</a><br />
        <a href="/user/favorite">Danh sách yêu thích</a>
      </div>
      <div class="review-history col-md-10">
        <div class="text-center mb-3">
          <h3 class="review-history-title text-center fw-bold">Lịch Sử Đánh Giá</h3>
          <p class="text-muted">Xem lại các đánh giá bạn đã gửi cho sản phẩm</p>
        </div>

        <!-- Nếu chưa có đánh giá -->
        <div v-if="reviews.length === 0" class="review-empty">
          <div class="review-empty-icon">
            <i class="fas fa-star text-gray-400 text-3xl"></i>
          </div>
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">Chưa có đánh giá</h2>
          <p class="text-gray-500 mb-8">Hãy đánh giá các đơn hàng đã giao!</p>
        </div>

        <!-- Nếu có đánh giá -->
        <div v-else class="review-table-wrapper">
          <table class="review-table">
            <thead>
              <tr>
                <th>Mã review</th>
                <th>Sản phẩm</th>
                <th>Điểm</th>
                <th>Bình luận</th>
                <th>Media</th>
                <th>Ngày đánh giá</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="review in reviews" :key="review.reviewId">
                <td>#{{ review.reviewId }}</td>
                <td>{{ review.productName }}</td>
                <td>
                  <span class="review-stars">
                    <i
                      v-for="n in review.rating"
                      :key="'filled-' + n"
                      class="bi bi-star-fill text-warning"
                    ></i>
                    <i
                      v-for="n in 5 - review.rating"
                      :key="'empty-' + n"
                      class="bi bi-star text-warning"
                    ></i>
                  </span>
                </td>
                <td>{{ review.comment }}</td>
                <td>
                  <div v-if="review.media.length">
                    <div v-for="m in review.media" :key="m.mediaId" class="review-media">
                      <img
                        v-if="m.reviewType === 'image'"
                        :src="`http://localhost:8080/images/${m.reviewUrl}`"
                        :alt="'Hình ảnh đánh giá ' + review.reviewId"
                        class="w-20 h-20 object-cover rounded"
                      />
                      <video
                        v-else-if="m.reviewType === 'video'"
                        :src="`/uploads/review/${m.reviewUrl}`"
                        controls
                        class="w-32 h-20 rounded"
                      ></video>
                    </div>
                  </div>
                  <span v-else>-</span>
                </td>
                <td>{{ formatDate(review.reviewDate) }}</td>
                <td>
                  <router-link
                    :to="`/product-detail/${review.productId}`"
                    class="order-management-action-btn buy-again"
                  >
                    <i class="bi bi-cart-plus me-1"></i> Mua lại
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/review-history.css"></style>
