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
              description: "Sản phẩm 1 chất lượng cao",
            },
          ],
        },
      ],
      selectedStatus: "",
      showReviewModal: false,
      selectedOrder: null,
      reviewRating: 0,
      reviewComment: "",
      reviewType: "text",
      filePreview: null,
      mediaData: null,
      showProductModal: false,
      selectedProduct: null,
    };
  },
  computed: {
    filteredOrders() {
      if (!this.selectedStatus) return this.orders;
      return this.orders.filter((order) => order.status === this.selectedStatus);
    },
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        pending: "Chờ xác nhận",
        processing: "Đang xử lý",
        shipping: "Đang giao",
        delivered: "Đã giao",
        cancelled: "Đã hủy",
      };
      return statusMap[status] || "Không xác định";
    },
    getStatusClass(status) {
      return {
        "status status-pending": status === "pending",
        "status status-processing": status === "processing",
        "status status-shipping": status === "shipping",
        "status status-delivered": status === "delivered",
        "status status-cancelled": status === "cancelled",
      };
    },
    viewOrder(orderId) {
      Toastify({
        text: `Xem chi tiết đơn hàng #${orderId}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#10b981",
      }).showToast();
    },
    cancelOrder(order) {
      this.orders = this.orders.map((o) =>
        o.id === order.id ? { ...o, status: "cancelled" } : o
      );
      Toastify({
        text: `Đã hủy đơn hàng #${order.id}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ef4444",
      }).showToast();
    },
    openReviewModal(order) {
      this.selectedOrder = order;
      this.reviewRating = 0;
      this.reviewComment = "";
      this.reviewType = "text";
      this.filePreview = null;
      this.mediaData = null;
      this.showReviewModal = true;
    },
    closeReviewModal() {
      this.showReviewModal = false;
      this.selectedOrder = null;
      this.filePreview = null;
      this.mediaData = null;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const maxSize = 5 * 1024 * 1024;
      const imageTypes = ["image/jpeg", "image/png", "image/gif"];
      const videoTypes = ["video/mp4", "video/webm", "video/ogg"];

      if (file.size > maxSize) {
        Toastify({
          text: "File quá lớn! Vui lòng chọn file dưới 5MB.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ef4444",
        }).showToast();
        return;
      }

      if (this.reviewType === "image" && !imageTypes.includes(file.type)) {
        Toastify({
          text: "Vui lòng chọn file hình ảnh (jpg, png, gif)!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ef4444",
        }).showToast();
        return;
      }

      if (this.reviewType === "video" && !videoTypes.includes(file.type)) {
        Toastify({
          text: "Vui lòng chọn file video (mp4, webm, ogg)!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ef4444",
        }).showToast();
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
        this.mediaData = reader.result;
      };
      reader.readAsDataURL(file);
    },
    submitReview() {
      if (this.reviewRating === 0) {
        Toastify({
          text: "Vui lòng chọn số sao đánh giá",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ef4444",
        }).showToast();
        return;
      }
      if (!this.reviewComment.trim()) {
        Toastify({
          text: "Vui lòng nhập bình luận",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ef4444",
        }).showToast();
        return;
      }
      if (this.reviewType !== "text" && !this.mediaData) {
        Toastify({
          text: `Vui lòng tải lên ${this.reviewType === "image" ? "hình ảnh" : "video"}`,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ef4444",
        }).showToast();
        return;
      }
      this.orders = this.orders.map((o) =>
        o.id === this.selectedOrder.id ? { ...o, reviewed: true } : o
      );
      Toastify({
        text: `Đã gửi đánh giá cho đơn hàng #${this.selectedOrder.id}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#10b981",
      }).showToast();
      this.closeReviewModal();
    },
    handleImageError(event) {
      console.log("Lỗi tải hình ảnh sản phẩm:", event.target.src);
      event.target.src = "https://via.placeholder.com/50?text=No+Image";
    },
    openProductModal(item) {
      this.selectedProduct = item;
      this.showProductModal = true;
    },
    closeProductModal() {
      this.showProductModal = false;
      this.selectedProduct = null;
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
        >Quản lý đơn hàng</a
      >
    </nav>
  </div>
  <div class="container order-management mt-3">
    <h4 class="order-management-title text-center">Quản Lý Đơn Hàng</h4>
    <div class="order-management-nav mt-3">
      <a href="reviews.html" class="order-management-nav-link">
        Xem lịch sử đánh giá
      </a>
    </div>
    <div class="order-management-tabs">
      <div
        class="order-management-tab"
        :class="{ active: selectedStatus === '' }"
        @click="selectedStatus = ''"
      >
        Tất cả
      </div>
      <div
        class="order-management-tab"
        :class="{ active: selectedStatus === 'pending' }"
        @click="selectedStatus = 'pending'"
      >
        Chờ xác nhận
      </div>
      <div
        class="order-management-tab"
        :class="{ active: selectedStatus === 'processing' }"
        @click="selectedStatus = 'processing'"
      >
        Đang xử lý
      </div>
      <div
        class="order-management-tab"
        :class="{ active: selectedStatus === 'shipping' }"
        @click="selectedStatus = 'shipping'"
      >
        Đang giao
      </div>
      <div
        class="order-management-tab"
        :class="{ active: selectedStatus === 'delivered' }"
        @click="selectedStatus = 'delivered'"
      >
        Đã giao
      </div>
      <div
        class="order-management-tab"
        :class="{ active: selectedStatus === 'cancelled' }"
        @click="selectedStatus = 'cancelled'"
      >
        Đã hủy
      </div>
    </div>

    <div v-if="filteredOrders.length === 0" class="order-management-empty">
      <div class="order-management-empty-icon">
        <i class="bi bi-box text-secondary fs-3"></i>
      </div>
      <h2 class="order-management-empty-title">Chưa có đơn hàng</h2>
      <p class="order-management-empty-message">Hãy đặt hàng để bắt đầu!</p>
      <a href="/" class="order-management-start-btn">
        <i class="bi bi-bag me-2"></i>
        Bắt đầu mua sắm
      </a>
    </div>

    <!-- Giả sử có bộ lọc đơn hàng hoặc loading -->
    <div class="order-management-table-wrapper">
      <table class="order-management-table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ order.createdAt }}</td>
            <td>{{ order.total.toLocaleString() }}đ</td>
            <td>
              <span :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </td>
            <td>
              <button
                class="order-management-action-btn view"
                @click="viewOrder(order.id)"
              >
                <i class="bi bi-eye me-1"></i> Xem
              </button>

              <button
                v-if="order.status === 'pending' || order.status === 'processing'"
                class="order-management-action-btn cancel"
                @click="cancelOrder(order)"
              >
                <i class="bi bi-x-lg me-1"></i> Hủy
              </button>

              <button
                v-if="order.status === 'delivered' && order.paid && !order.reviewed"
                class="order-management-action-btn review"
                @click="openReviewModal(order)"
              >
                <i class="bi bi-star-fill me-1"></i> Đánh giá
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal Đánh giá -->
  <div v-if="showReviewModal" class="order-review-modal">
    <div class="order-review-modal-content">
      <div class="order-review-modal-header">
        <h3>Đánh giá đơn hàng #{{ selectedOrder.id }}</h3>
        <button class="order-review-modal-close-btn" @click="closeReviewModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="order-review-modal-form-group">
        <label>Điểm đánh giá</label>
        <div class="order-review-modal-stars">
          <i
            v-for="n in 5"
            :key="n"
            :class="[
              'bi',
              n <= reviewRating ? 'bi-star-fill filled' : 'bi-star',
              'order-review-modal-star',
            ]"
            @click="reviewRating = n"
          ></i>
        </div>
      </div>

      <div class="order-review-modal-form-group">
        <label>Bình luận</label>
        <textarea v-model="reviewComment" placeholder="Nhập bình luận của bạn"></textarea>
      </div>

      <div class="order-review-modal-form-group">
        <label>Loại đánh giá</label>
        <select v-model="reviewType">
          <option value="text">Chỉ văn bản</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div class="order-review-modal-form-group" v-if="reviewType !== 'text'">
        <label>Tải lên {{ reviewType === "image" ? "hình ảnh" : "video" }}</label>
        <input
          type="file"
          class="order-review-modal-file-input"
          :accept="
            reviewType === 'image'
              ? 'image/jpeg,image/png,image/gif'
              : 'video/mp4,video/webm,video/ogg'
          "
          @change="handleFileUpload"
        />
        <div v-if="filePreview" class="order-review-modal-file-preview">
          <img v-if="reviewType === 'image'" :src="filePreview" alt="Preview" />
          <video v-else :src="filePreview" controls></video>
        </div>
      </div>

      <button class="order-review-modal-submit-btn" @click="submitReview">
        Gửi đánh giá
      </button>
    </div>
  </div>

  <!-- Modal Chi tiết sản phẩm -->
  <div v-if="showProductModal" class="product-detail-modal">
    <div class="product-detail-modal-content">
      <div class="product-detail-modal-header">
        <h3>Chi tiết sản phẩm</h3>
        <button class="product-detail-modal-close-btn" @click="closeProductModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="product-detail-modal-body">
        <img
          :src="selectedProduct.imageUrl"
          class="product-detail-modal-image"
          :alt="selectedProduct.name"
          @error="handleImageError"
        />
        <div class="product-detail-modal-info">
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

<style src="@/assets/css/order-management.css"></style>
