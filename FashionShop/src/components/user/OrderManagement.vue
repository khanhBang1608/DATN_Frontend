<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="/user/account" class="custom-breadcrumb-link">Tổng quan tài khoản</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Quản lý đơn hàng</a
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
        <a href="/user/review-history">Đánh giá của tôi</a><br />
        <a href="#" class="active">Mua hàng & Trả hàng</a><br />
        <a href="/user/favorite">Danh sách yêu thích</a>
      </div>
      <div class="container order-management col-md-10">
        <div class="text-center mb-3">
          <h3 class="order-management-title text-center fw-bold">Quản Lý Đơn Hàng</h3>
          <p class="text-muted">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

        <div class="row my-3">
          <div class="col-md-9">
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
                :class="{ active: selectedStatus === 'taking' }"
                @click="selectedStatus = 'taking'"
              >
                Chờ lấy hàng
              </div>

              <div
                class="order-management-tab"
                :class="{ active: selectedStatus === 'processing' }"
                @click="selectedStatus = 'processing'"
              >
                Chờ giao hàng
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
                :class="{ active: selectedStatus === 'returnRequested' }"
                @click="selectedStatus = 'returnRequested'"
              >
                Yêu cầu trả hàng
              </div>

              <div
                class="order-management-tab"
                :class="{ active: selectedStatus === 'refund' }"
                @click="selectedStatus = 'refund'"
              >
                Trả hàng
              </div>
              <div
                class="order-management-tab"
                :class="{ active: selectedStatus === 'cancelled' }"
                @click="selectedStatus = 'cancelled'"
              >
                Đã hủy
              </div>

              <div
                class="order-management-tab"
                :class="{ active: selectedStatus === 'rejected' }"
                @click="selectedStatus = 'rejected'"
              >
                Từ chối trả hàng
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <label for="dateFilter">Ngày đặt hàng:</label>
            <input
              id="dateFilter"
              type="date"
              class="form-control"
              v-model="selectedDate"
            />
          </div>
        </div>
        <div v-if="loading" class="text-center">
          <p>Đang tải đơn hàng...</p>
        </div>
        <div v-else-if="filteredOrders.length === 0" class="order-management-empty">
          <div class="order-management-empty-icon">
            <i class="bi bi-box text-secondary fs-3"></i>
          </div>
          <h2 class="order-management-empty-title">Chưa có đơn hàng</h2>
          <p class="order-management-empty-message">Hãy đặt hàng để bắt đầu!</p>
          <router-link to="/" class="order-management-start-btn">
            <i class="bi bi-bag me-2"></i>
            Bắt đầu mua sắm
          </router-link>
        </div>

        <div v-else class="order-management-table-wrapper">
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
              <tr v-for="order in filteredOrders" :key="order.orderId">
                <td>#{{ order.orderId }}</td>
                <td>{{ formatDate(order.orderDate) }}</td>
                <td>{{ formatPrice(order.totalAmount) }}</td>
                <td>
                  <span :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td>
                  <router-link
                    class="order-management-action-btn view"
                    :to="`/user/order-detail/${order.orderId}`"
                  >
                    <i class="bi bi-eye me-1"></i> Xem
                  </router-link>

                  <button
                    v-if="order.status === 3"
                    class="order-management-action-btn return"
                    @click="openReturnModal(order.orderId)"
                  >
                    <i class="bi bi-box-arrow-left me-1"></i> Yêu cầu trả hàng
                  </button>

                  <button
                    v-if="order.status === 0"
                    class="order-management-action-btn cancel"
                    @click="cancelOrder(order.orderId)"
                  >
                    <i class="bi bi-x-lg me-1"></i> Hủy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
          <button class="btn btn-danger" @click="submitReturn">Gửi yêu cầu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserOrders, cancelOrder, requestReturn } from "@/api/user/orderAPI";
import { createReview, checkReviewsForOrderDetails } from "@/api/user/reviewAPI";
import axios from "axios";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export async function getProductIdByVariantId(variantId) {
  const res = await axios.get(`/api/public/variants/${variantId}/product-id`);
  return res.data.productId;
}

export default {
  data() {
    return {
      selectedDate: "",
      orders: [],
      selectedStatus: "",
      selectedOrder: null,
      loading: false,
      activeReviewCollapse: null,
      reviewRatings: {},
      reviewComments: {},
      reviewTypes: {},
      filePreviews: {},
      mediaFiles: {},
      returnReason: "",
      returnFile: null,
      returnFilePreview: null,
      returnOrderId: null,
    };
  },
  computed: {
    filteredOrders() {
      const statusMap = {
        pending: 0,
        taking: 1,
        processing: 2,
        delivered: 3,
        returnRequested: 4,
        cancelled: 5,
        refund: 6,
        rejected: 7,
      };

      let result = this.orders.filter((order) => {
        const status = Number(order.status);
        let matchesStatus = true;

        if (this.selectedStatus) {
          matchesStatus = status === statusMap[this.selectedStatus];
        } else {
          matchesStatus = status >= 0 && status <= 7;
        }

        const matchesDate =
          !this.selectedDate ||
          new Date(order.orderDate).toISOString().slice(0, 10) === this.selectedDate;

        return matchesStatus && matchesDate;
      });

      return result.sort((a, b) => a.status - b.status);
    },
  },

  methods: {
    openReturnModal(orderId) {
      this.returnOrderId = orderId;
      this.returnReason = "";
      this.returnFile = null;
      this.returnFilePreview = null;

      const modalEl = document.getElementById("returnModal");
      const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
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
        return;
      }

      this.returnFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.returnFilePreview = reader.result;
      };
      reader.readAsDataURL(file);
    },

    async submitReturn() {
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
        await requestReturn(this.returnOrderId, form);
        this.orders = this.orders.map((order) =>
          order.orderId === this.returnOrderId ? { ...order, status: 4 } : order
        );
        iziToast.success({
          title: "Thành công",
          message: `Đã gửi yêu cầu trả hàng cho đơn hàng #${this.returnOrderId}`,
          position: "topRight",
        });

        const modalEl = document.getElementById("returnModal");
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
      } catch (err) {
        iziToast.error({
          title: "Lỗi",
          message: err.response?.data?.message || "Gửi yêu cầu trả hàng thất bại.",
          position: "topRight",
        });
      }
    },

    async requestReturn(orderId) {
      try {
        await requestReturn(orderId);
        this.orders = this.orders.map((order) =>
          order.orderId === orderId ? { ...order, status: 4 } : order
        );
        iziToast.success({
          title: "Thành công",
          message: `Đã gửi yêu cầu trả hàng cho đơn hàng #${orderId}`,
          position: "topRight",
        });
      } catch (error) {
        iziToast.error({
          title: "Lỗi",
          message: error.message || "Gửi yêu cầu trả hàng thất bại.",
          position: "topRight",
        });
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    getStatusText(status) {
      const statusMap = {
        0: "Chờ xác nhận",
        1: "Chờ lấy hàng",
        2: "Chờ giao hàng",
        3: "Đã giao",
        4: "Yêu cầu trả hàng",
        5: "Đã hủy",
        6: "Trả hàng",
        7: "Đã từ chối",
      };
      return statusMap[status] || "Không xác định";
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

    async fetchOrders() {
      this.loading = true;
      try {
        this.orders = await getUserOrders();
        const orderDetailIds = this.orders
          .filter((order) => order.status === 3)
          .flatMap((order) => order.orderDetails.map((item) => item.orderDetailId));

        if (orderDetailIds.length > 0) {
          try {
            const reviewStatus = await checkReviewsForOrderDetails(orderDetailIds);
            this.orders = this.orders.map((order) => ({
              ...order,
              orderDetails: order.orderDetails.map((item) => ({
                ...item,
                reviewed: reviewStatus[item.orderDetailId] || false,
              })),
            }));
          } catch (error) {
            iziToast.error({
              title: "Lỗi",
              message: "Không thể kiểm tra trạng thái đánh giá.",
              position: "topRight",
            });
          }
        }
        // iziToast.success({
        //   title: "Thành công",
        //   message: "Tải danh sách đơn hàng thành công!",
        //   position: "topRight",
        // });
      } catch (error) {
        iziToast.error({
          title: "Lỗi",
          message: error.message || "Không thể tải danh sách đơn hàng.",
          position: "topRight",
        });
      } finally {
        this.loading = false;
      }
    },

    async cancelOrder(orderId) {
      try {
        const result = await Swal.fire({
          title: "Bạn có chắc chắn?",
          text: `Bạn có chắc muốn hủy đơn hàng #${orderId}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Có, hủy ngay!",
          cancelButtonText: "Không",
        });

        if (result.isConfirmed) {
          await cancelOrder(orderId);
          this.orders = this.orders.map((o) =>
            o.orderId === orderId ? { ...o, status: 5 } : o
          );

          iziToast.success({
            title: "Thành công",
            message: `Đã hủy đơn hàng #${orderId}`,
            position: "topRight",
          });
        }
      } catch (error) {
        iziToast.error({
          title: "Lỗi",
          message: error.message || "Hủy đơn hàng thất bại.",
          position: "topRight",
        });
      }
    },

    toggleReviewCollapse(orderDetailId) {
      this.activeReviewCollapse =
        this.activeReviewCollapse === orderDetailId ? null : orderDetailId;
      if (this.activeReviewCollapse) {
        this.reviewRatings[orderDetailId] = 0;
        this.reviewComments[orderDetailId] = "";
        this.reviewTypes[orderDetailId] = "text";
        this.filePreviews[orderDetailId] = null;
        this.mediaFiles[orderDetailId] = null;
      }
    },

    setReviewRating(orderDetailId, rating) {
      this.reviewRatings = { ...this.reviewRatings, [orderDetailId]: rating };
    },

    handleFileUpload(event, orderDetailId) {
      const file = event.target.files[0];
      if (!file) return;

      const maxSize = 5 * 1024 * 1024;
      const imageTypes = ["image/jpeg", "image/png", "image/gif"];
      const videoTypes = ["video/mp4", "video/webm", "video/ogg"];

      if (file.size > maxSize) {
        iziToast.error({
          title: "Lỗi",
          message: "File quá lớn! Vui lòng chọn file dưới 5MB.",
          position: "topRight",
        });
        return;
      }

      if (
        this.reviewTypes[orderDetailId] === "image" &&
        !imageTypes.includes(file.type)
      ) {
        iziToast.error({
          title: "Lỗi",
          message: "Vui lòng chọn file hình ảnh (jpg, png, gif)!",
          position: "topRight",
        });
        return;
      }

      if (
        this.reviewTypes[orderDetailId] === "video" &&
        !videoTypes.includes(file.type)
      ) {
        iziToast.error({
          title: "Lỗi",
          message: "Vui lòng chọn file video (mp4, webm, ogg)!",
          position: "topRight",
        });
        return;
      }

      this.mediaFiles = { ...this.mediaFiles, [orderDetailId]: file };
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviews = { ...this.filePreviews, [orderDetailId]: reader.result };
      };
      reader.readAsDataURL(file);
    },

    async submitReview(orderDetailId, productName) {
      if (!this.reviewRatings[orderDetailId]) {
        return iziToast.error({
          title: "Lỗi",
          message: "Vui lòng chọn số sao đánh giá",
          position: "topRight",
        });
      }
      if (!this.reviewComments[orderDetailId]?.trim()) {
        return iziToast.error({
          title: "Lỗi",
          message: "Vui lòng nhập bình luận",
          position: "topRight",
        });
      }
      if (this.reviewTypes[orderDetailId] !== "text" && !this.mediaFiles[orderDetailId]) {
        return iziToast.error({
          title: "Lỗi",
          message: `Vui lòng tải lên ${
            this.reviewTypes[orderDetailId] === "image" ? "hình ảnh" : "video"
          }`,
          position: "topRight",
        });
      }

      try {
        const formData = new FormData();
        formData.append("rating", this.reviewRatings[orderDetailId]);
        formData.append("comment", this.reviewComments[orderDetailId]);
        formData.append("orderDetailId", orderDetailId);
        if (this.reviewTypes[orderDetailId] !== "text") {
          formData.append("media", this.mediaFiles[orderDetailId]);
          formData.append("reviewType", this.reviewTypes[orderDetailId]);
        } else {
          formData.append("reviewType", "text");
        }

        await createReview(formData);

        this.orders = this.orders.map((o) =>
          o.orderId === this.selectedOrder.orderId
            ? {
                ...o,
                orderDetails: o.orderDetails.map((item) =>
                  item.orderDetailId === orderDetailId
                    ? { ...item, reviewed: true }
                    : item
                ),
              }
            : o
        );
        this.selectedOrder = {
          ...this.selectedOrder,
          orderDetails: this.selectedOrder.orderDetails.map((item) =>
            item.orderDetailId === orderDetailId ? { ...item, reviewed: true } : item
          ),
        };

        const orderDetailIds = this.selectedOrder.orderDetails.map(
          (item) => item.orderDetailId
        );
        if (orderDetailIds.length > 0) {
          const reviewStatus = await checkReviewsForOrderDetails(orderDetailIds);
          this.orders = this.orders.map((o) =>
            o.orderId === this.selectedOrder.orderId
              ? {
                  ...o,
                  orderDetails: o.orderDetails.map((item) => ({
                    ...item,
                    reviewed: reviewStatus[item.orderDetailId] || false,
                  })),
                }
              : o
          );
          this.selectedOrder = {
            ...this.selectedOrder,
            orderDetails: this.selectedOrder.orderDetails.map((item) => ({
              ...item,
              reviewed: reviewStatus[item.orderDetailId] || false,
            })),
          };
        }

        this.activeReviewCollapse = null;
        this.reviewRatings = { ...this.reviewRatings, [orderDetailId]: 0 };
        this.reviewComments = { ...this.reviewComments, [orderDetailId]: "" };
        this.reviewTypes = { ...this.reviewTypes, [orderDetailId]: "text" };
        this.filePreviews = { ...this.filePreviews, [orderDetailId]: null };
        this.mediaFiles = { ...this.mediaFiles, [orderDetailId]: null };

        iziToast.success({
          title: "Thành công",
          message: `Đã gửi đánh giá cho sản phẩm ${productName}`,
          position: "topRight",
        });
      } catch (error) {
        iziToast.error({
          title: "Lỗi",
          message: error.message || "Gửi đánh giá thất bại.",
          position: "topRight",
        });
      }
    },

    handleImageError(event) {
      event.target.src = "https://via.placeholder.com/50?text=No+Image";
    },
  },

  mounted() {
    if (!localStorage.getItem("token")) {
      iziToast.error({
        title: "Lỗi",
        message: "Vui lòng đăng nhập để xem đơn hàng.",
        position: "topRight",
      });
      this.$router.push("/login");
    } else {
      this.fetchOrders();
    }
  },
};
</script>

<style src="@/assets/css/order-management.css"></style>
