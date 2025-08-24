<template>
  <div v-if="order" class="container mt-4">
    <h3 class="text-center mb-4">Chi tiết đơn hàng #{{ order.orderId }}</h3>
    <div class="order-info-section mb-4">
      <h4 class="section-title">Thông tin đơn hàng</h4>
      <div class="order-info-grid">
        <p><strong>Ngày đặt:</strong> {{ formatDate(order.orderDate) }}</p>
        <p><strong>Tổng tiền:</strong> {{ formatPrice(order.totalAmount) }}</p>
        <p>
          <strong>Trạng thái:</strong>
          <span :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </span>
        </p>
        <p v-if="order.status === 3">
          <button
            class="order-management-action-btn return"
            data-bs-toggle="modal"
            data-bs-target="#returnModal"
          >
            <i class="bi bi-box-arrow-left me-1"></i> Yêu cầu trả hàng
          </button>
        </p>

        <p><strong>Số điện thoại:</strong> {{ order.address?.split(" - ")[0] }}</p>
        <p><strong>Địa chỉ:</strong> {{ order.address?.split(" - ")[2] }}</p>
        <p><strong>Phương thức thanh toán:</strong> {{ order.paymentMethod }}</p>
        <p>
          <strong>Trạng thái thanh toán:</strong>
          <span :class="getPaymentStatusClass(order.paymentStatus)">
            {{ getPaymentStatusText(order.paymentStatus) }}
          </span>
        </p>

        <p><strong>Phí vận chuyển:</strong> {{ formatPrice(order.shippingFee) }}</p>
        <p><strong>Giảm giá:</strong> {{ formatPrice(order.discountAmount) }}</p>
        <p><strong>Người nhận</strong> {{ order.address?.split(" - ")[1] }}</p>
      </div>
    </div>

    <div class="order-items-section">
      <h4 class="section-title">Sản phẩm</h4>
      <div
        v-for="item in order.orderDetails"
        :key="item.orderDetailId"
        class="order-item-card"
      >
        <div class="d-flex align-items-center">
          <img
            :src="`http://localhost:8080/images/${item.imageUrl}`"
            :alt="item.productName"
            class="order-item-image me-3"
            @error="handleImageError"
          />
          <div class="order-item-details flex-grow-1">
            <p class="mb-0 fw-bold">{{ item.productName }}</p>
            <p class="mb-0">Size: {{ item.size }} | Màu: {{ item.color }}</p>
            <p class="mb-0">Số lượng: {{ item.quantity }}</p>
            <p class="mb-0">Giá: {{ formatPrice(item.price) }}</p>
          </div>
          <div class="order-item-actions ms-auto">
            <div class="fw-bold mb-2">{{ formatPrice(item.price * item.quantity) }}</div>
            <button
              v-if="order.status === 3 && !item.reviewed"
              class="order-management-action-btn review"
              @click="toggleReviewCollapse(item.orderDetailId)"
            >
              <i class="bi bi-star-fill me-1"></i> Đánh giá
            </button>
            <router-link
              :to="`/product-detail/${item.productId}`"
              class="order-management-action-btn buy-again"
            >
              <i class="bi bi-cart-plus me-1"></i> Mua lại
            </router-link>
          </div>
        </div>

        <!-- Collapse review -->
        <div
          v-if="order.status === 3 && !item.reviewed"
          class="collapse mt-3"
          :id="`review-collapse-${item.orderDetailId}`"
          :class="{ show: activeReviewCollapse === item.orderDetailId }"
        >
          <div class="review-form card p-3">
            <h5>Đánh giá sản phẩm {{ item.productName }}</h5>
            <div class="form-group mb-3">
              <label>Điểm đánh giá</label>
              <div class="review-stars">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="[
                    'bi',
                    n <= (reviewRatings[item.orderDetailId] || 0)
                      ? 'bi-star-fill filled'
                      : 'bi-star',
                    'review-star',
                  ]"
                  @click="setReviewRating(item.orderDetailId, n)"
                ></i>
              </div>
            </div>

            <div class="form-group mb-3">
              <label>Bình luận</label>
              <textarea
                v-model="reviewComments[item.orderDetailId]"
                class="form-control"
                placeholder="Nhập bình luận của bạn"
              ></textarea>
            </div>

            <div class="form-group mb-3">
              <label>Loại đánh giá</label>
              <select v-model="reviewTypes[item.orderDetailId]" class="form-control">
                <option value="text">Chỉ văn bản</option>
                <option value="image">Hình ảnh</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div
              v-if="reviewTypes[item.orderDetailId] !== 'text'"
              class="form-group mb-3"
            >
              <label
                >Upload
                {{
                  reviewTypes[item.orderDetailId] === "image" ? "hình ảnh" : "video"
                }}</label
              >
              <input
                type="file"
                class="form-control"
                :accept="
                  reviewTypes[item.orderDetailId] === 'image' ? 'image/*' : 'video/*'
                "
                @change="handleFileUpload($event, item.orderDetailId)"
              />
              <div v-if="filePreviews[item.orderDetailId]" class="file-preview mt-2">
                <img
                  v-if="reviewTypes[item.orderDetailId] === 'image'"
                  :src="filePreviews[item.orderDetailId]"
                  class="img-fluid"
                />
                <video
                  v-else
                  :src="filePreviews[item.orderDetailId]"
                  controls
                  class="img-fluid"
                ></video>
              </div>
            </div>

            <button
              class="btn btn-primary order-management-btn"
              @click="submitReview(item.orderDetailId, item.productName)"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="returnModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Yêu cầu trả hàng</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <label>Lý do</label>
          <textarea v-model="returnReason" class="form-control mb-3"></textarea>

          <label>Upload ảnh hoặc video (tùy chọn)</label>
          <input
            type="file"
            class="form-control"
            accept="image/*,video/*"
            @change="handleReturnFileUpload"
          />

          <div v-if="returnFilePreview" class="file-preview mt-2">
            <img
              v-if="returnFile?.type.startsWith('image')"
              :src="returnFilePreview"
              class="img-fluid"
            />
            <video v-else :src="returnFilePreview" controls class="img-fluid"></video>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button class="btn btn-danger" @click="submitReturn(order.orderId)">
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderDetails, requestReturn } from "@/api/user/orderAPI";
import { createReview, checkReviewsForOrderDetails } from "@/api/user/reviewAPI";
import iziToast from "izitoast";
import { Modal } from "bootstrap";
import axios from "axios";

export async function getProductIdByVariantId(variantId) {
  const res = await axios.get(`/api/public/variants/${variantId}/product-id`);
  return res.data.productId;
}

export default {
  data() {
    return {
      order: null,
      activeReviewCollapse: null,
      reviewRatings: {},
      reviewComments: {},
      reviewTypes: {},
      filePreviews: {},
      mediaFiles: {},
      showReturnForm: false,
      returnReason: "",
      returnFile: null,
      returnFilePreview: null,
    };
  },
  async mounted() {
    const orderId = this.$route.params.id;
    try {
      const data = await getOrderDetails(orderId);
      for (const item of data.orderDetails) {
        const productId = await getProductIdByVariantId(item.productVariantId);
        item.productId = productId;
      }

      const ids = data.orderDetails.map((i) => i.orderDetailId);
      const reviewMap = await checkReviewsForOrderDetails(ids);

      data.orderDetails = data.orderDetails.map((item) => ({
        ...item,
        reviewed: reviewMap[item.orderDetailId] || false,
      }));

      this.order = data;
    } catch (e) {
      iziToast.error({
        title: "Lỗi",
        message: "Không thể tải chi tiết đơn hàng.",
        position: "topRight",
      });
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    getStatusText(status) {
      const map = {
        0: "Chờ xác nhận",
        1: "Chờ lấy hàng",
        2: "Chờ giao hàng",
        3: "Đã giao",
        4: "Yêu cầu trả hàng",
        5: "Đã hủy",
        6: "Trả hàng",
        7: "Đã từ chối",
      };
      return map[status] || "Không xác định";
    },
    getStatusClass(status) {
      return {
        "status status-pending": status === 0,
        "status status-taking": status === 1,
        "status status-processing": status === 2,
        "status status-delivered": status === 3,
        "status status-return-requested": status === 4,
        "status status-cancelled": status === 5,
        "status status-refunded": status === 6,
        "status status-rejected": status === 7,
      };
    },
    getPaymentStatusText(status) {
      const map = {
        0: "Chưa thanh toán",
        1: "Đã thanh toán",
        2: "Hoàn tiền",
        3: "Đang xử lý",
      };
      return map[status] || "Không xác định";
    },
    getPaymentStatusClass(status) {
      return {
        "status status-unpaid": status === 0,
        "status status-paid": status === 1,
        "status status-failed": status === 2,
        "status status-processing": status === 3,
      };
    },
    toggleReviewCollapse(id) {
      this.activeReviewCollapse = this.activeReviewCollapse === id ? null : id;

      if (this.activeReviewCollapse) {
        this.reviewRatings[id] = 0;
        this.reviewComments[id] = "";
        this.reviewTypes[id] = "text";
        this.filePreviews[id] = null;
        this.mediaFiles[id] = null;

        this.$nextTick(() => {
          const el = document.getElementById(`review-collapse-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }
    },
    setReviewRating(id, rating) {
      this.reviewRatings[id] = rating;
    },
    handleFileUpload(event, id) {
      const file = event.target.files[0];
      if (!file) return;

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        iziToast.error({
          title: "Lỗi",
          message: "File quá lớn! Vui lòng chọn file dưới 5MB.",
          position: "topRight",
        });
        return;
      }

      this.mediaFiles[id] = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviews[id] = reader.result;
      };
      reader.readAsDataURL(file);
    },
    async submitReturn(orderId) {
      if (!this.returnReason.trim()) {
        return iziToast.error({
          title: "Lỗi",
          message: "Vui lòng nhập lý do trả hàng.",
          position: "topRight",
        });
      }

      const form = new FormData();
      form.append("reason", this.returnReason);
      if (this.returnFile) {
        const fileType = this.returnFile.type.startsWith("video")
          ? "videoUrls"
          : "imageUrls";
        form.append(fileType, this.returnFile);
      }

      try {
        await requestReturn(orderId, form);
        this.order.status = 4;
        this.returnReason = "";
        this.returnFile = null;
        this.returnFilePreview = null;
        iziToast.success({
          title: "Thành công",
          message: `Đã gửi yêu cầu trả hàng cho đơn hàng #${orderId}`,
          position: "topRight",
        });

        const modalEl = document.getElementById("returnModal");
        const modal = Modal.getOrCreateInstance(modalEl);
        modal.hide();
      } catch (err) {
        iziToast.error({
          title: "Lỗi",
          message: err.response?.data?.message || "Gửi yêu cầu trả hàng thất bại.",
          position: "topRight",
        });
      }
    },
    handleReturnFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        iziToast.error({
          title: "Lỗi",
          message: "File quá lớn! Vui lòng chọn file dưới 20MB.",
          position: "topRight",
        });
      }

      this.returnFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.returnFilePreview = reader.result;
      };
      reader.readAsDataURL(file);
    },
    async submitReview(id, productName) {
      if (!this.reviewRatings[id])
        return iziToast.error({
          title: "Lỗi",
          message: "Vui lòng chọn số sao.",
          position: "topRight",
        });
      if (!this.reviewComments[id]?.trim())
        return iziToast.error({
          title: "Lỗi",
          message: "Vui lòng nhập bình luận.",
          position: "topRight",
        });

      if (this.reviewTypes[id] !== "text" && !this.mediaFiles[id]) {
        return iziToast.error({
          title: "Lỗi",
          message: "Vui lòng tải lên media.",
          position: "topRight",
        });
      }

      try {
        const form = new FormData();
        form.append("rating", this.reviewRatings[id]);
        form.append("comment", this.reviewComments[id]);
        form.append("orderDetailId", id);
        form.append("reviewType", this.reviewTypes[id]);
        if (this.reviewTypes[id] !== "text") {
          form.append("media", this.mediaFiles[id]);
        }

        await createReview(form);
        this.order.orderDetails = this.order.orderDetails.map((i) =>
          i.orderDetailId === id ? { ...i, reviewed: true } : i
        );

        this.toggleReviewCollapse(id);
        iziToast.success({
          title: "Thành công",
          message: `Đã gửi đánh giá cho ${productName}`,
          position: "topRight",
        });
      } catch (e) {
        iziToast.error({
          title: "Lỗi",
          message: "Gửi đánh giá thất bại.",
          position: "topRight",
        });
      }
    },
    handleImageError(e) {
      e.target.src = "https://via.placeholder.com/50?text=No+Image";
    },
  },
};
</script>

<style src="@/assets/css/order-management.css"></style>
