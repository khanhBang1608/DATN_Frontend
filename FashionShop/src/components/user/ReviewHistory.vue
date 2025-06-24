<script>
export default {
  data() {
    return {
      orders: [
        {
          id: "1001",
          createdAt: "2025-05-30",
          total: 500000,
          status: "pending",
          paid: false,
          reviewed: false,
          items: [
            {
              id: "1",
              name: "Sản phẩm 1",
              price: 100000,
              quantity: 2,
              imageUrl: "https://via.placeholder.com/50?text=SP1",
              description: "Sản phẩm 1 chất lượng cao",
            },
            {
              id: "2",
              name: "Sản phẩm 2",
              price: 200000,
              quantity: 1,
              imageUrl: "https://via.placeholder.com/50?text=SP2",
              description: "Sản phẩm 2 bền đẹp",
            },
          ],
        },
        {
          id: "1002",
          createdAt: "2025-05-29",
          total: 900000,
          status: "delivered",
          paid: true,
          reviewed: false,
          items: [
            {
              id: "3",
              name: "Sản phẩm 3",
              price: 150000,
              quantity: 3,
              imageUrl: "https://via.placeholder.com/50?text=SP3",
              description: "Sản phẩm 3 tiện dụng",
            },
            {
              id: "4",
              name: "Sản phẩm 4",
              price: 300000,
              quantity: 2,
              imageUrl: "https://via.placeholder.com/50?text=SP4",
              description: "Sản phẩm 4 cao cấp",
            },
          ],
        },
        {
          id: "1003",
          createdAt: "2025-05-28",
          total: 300000,
          status: "processing",
          paid: false,
          reviewed: false,
          items: [
            {
              id: "1",
              name: "Sản phẩm 1",
              price: 100000,
              quantity: 3,
              imageUrl: "https://via.placeholder.com/50?text=SP1",
              description: "Sản phẩm 1 chất lượng cao",
            },
          ],
        },
        {
          id: "1004",
          createdAt: "2025-05-27",
          total: 600000,
          status: "delivered",
          paid: true,
          reviewed: true,
          items: [
            {
              id: "2",
              name: "Sản phẩm 2",
              price: 200000,
              quantity: 3,
              imageUrl: "https://via.placeholder.com/50?text=SP2",
              description: "Sản phẩm 2 bền đẹp",
            },
          ],
        },
        {
          id: "1005",
          createdAt: "2025-05-26",
          total: 200000,
          status: "cancelled",
          paid: false,
          reviewed: false,
          items: [
            {
              id: "1",
              name: "Sản phẩm 1",
              price: 100000,
              quantity: 2,
              imageUrl: "https://via.placeholder.com/50?text=SP1",
              description: "Sản phẩm chất lượng cao",
            },
          ],
        },
      ],
      reviews: [
        {
          reviewId: "rev001",
          orderId: "1004",
          rating: 4,
          comment: "Sản phẩm tốt, giao hàng nhanh!",
          reviewDate: "2025-05-28",
          reviewType: "image",
          mediaData: "https://via.placeholder.com/200x150",
        },
      ],
      showProductModal: false,
      selectedProduct: null,
    };
  },

  computed: {
    reviewedOrders() {
      return this.reviews.map((r) => r.orderId);
    },
  },

  methods: {
    getOrderItems(orderId) {
      const order = this.orders.find((o) => o.id === orderId);
      return order ? order.items : [];
    },

    isReviewed(orderId) {
      return this.reviews.some((r) => r.orderId === orderId);
    },

    getReviewByOrder(orderId) {
      return this.reviews.find((r) => r.orderId === orderId);
    },

    handleImageError(event) {
      console.warn("Lỗi hình ảnh sản phẩm:", event.target.src);
      event.target.src = "https://via.placeholder.com/50?text=No+Image";
    },

    handleMediaError(event) {
      console.warn("Lỗi media đánh giá:", event.target.src);
      event.target.src = "https://via.placeholder.com/200x150?text=Media+Error";
    },

    openProductModal(product) {
      this.selectedProduct = product;
      this.showProductModal = true;
    },

    closeProductModal() {
      this.selectedProduct = null;
      this.showProductModal = false;
    },
  },
};
</script>
<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Giỏ hàng (1)</a
      >
    </nav>
  </div>
  <div class="container">
    <div class="review-history">
      <h4 class="review-history-title text-center">Lịch Sử Đánh Giá</h4>
      <div class="review-nav-links mt-2">
        <a href="orders.html" class="review-orders-link"> Quản lý đơn hàng </a>
      </div>
      <div v-if="reviews.length === 0" class="review-empty">
        <div class="review-empty-icon">
          <i class="fas fa-star text-gray-400 text-3xl"></i>
        </div>
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Chưa có đánh giá</h2>
        <p class="text-gray-500 mb-8">Hãy đánh giá các đơn hàng đã giao!</p>
      </div>

      <div v-else class="review-table-wrapper">
        <table class="review-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Sản phẩm</th>
              <th>Điểm</th>
              <th>Bình luận</th>
              <th>Media</th>
              <th>Ngày đánh giá</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in reviews" :key="review.reviewId">
              <td>#{{ review.orderId }}</td>
              <td>
                <ul class="review-product-list">
                  <li
                    v-for="item in getOrderItems(review.orderId)"
                    :key="item.id"
                    :title="`${item.name} - ${item.price.toLocaleString()}đ x ${
                      item.quantity
                    }`"
                  >
                    <img
                      :src="item.imageUrl"
                      class="review-product-thumbnail"
                      :alt="item.name"
                      @error="handleImageError"
                      @click="openProductModal(item)"
                    />
                    <span
                      >{{ item.name }} ({{ item.quantity }} x
                      {{ item.price.toLocaleString() }}đ)</span
                    >
                  </li>
                </ul>
              </td>
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
                <div v-if="review.reviewType === 'image'" class="review-media">
                  <img
                    :src="review.mediaData"
                    :alt="'Hình ảnh đánh giá ' + review.orderId"
                    @error="handleMediaError"
                  />
                </div>
                <div v-else-if="review.reviewType === 'video'" class="review-media">
                  <video :src="review.mediaData" controls></video>
                </div>
                <span v-else>-</span>
              </td>
              <td>{{ review.reviewDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- Modal xem chi tiết sản phẩm -->
  <div v-if="showProductModal" class="review-product-modal">
    <div class="review-modal-content">
      <div class="review-modal-header">
        <h3>Chi Tiết Sản Phẩm</h3>
        <button class="review-modal-close-btn" @click="closeProductModal">
          <i class="bi bi-x fs-4"></i>
        </button>
      </div>
      <div class="review-product-details">
        <img
          :src="selectedProduct.imageUrl"
          class="review-product-image"
          :alt="selectedProduct.name"
          @error="handleImageError"
        />
        <div class="review-product-info">
          <h4>{{ selectedProduct.name }}</h4>
          <p>Giá: {{ selectedProduct.price.toLocaleString() }}đ</p>
          <p>Số lượng: {{ selectedProduct.quantity }}</p>
          <p v-if="selectedProduct.description">
            Mô tả: {{ selectedProduct.description }}
          </p>
          <p v-else>Mô tả: Không có</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/review-history.css"></style>
