<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🛍️ Danh sách đơn hàng</h2>
    </div>
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else>
      <div v-for="order in orders" :key="order.orderId" class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <strong>Mã đơn:</strong> {{ order.orderId }}
            <span class="badge bg-info ms-2">{{ formatStatus(order.status) }}</span>
          </div>
          <small>{{ formatDate(order.orderDate) }}</small>
        </div>

        <div class="card-body">
          <p><strong>Khách hàng:</strong> {{ order.userFullName }}</p>
          <p><strong>Địa chỉ:</strong> {{ order.address }}</p>
          <p>
            <strong>Thanh toán:</strong> {{ order.paymentMethod }} -
            <span :class="order.paymentStatus === 1 ? 'text-success' : 'text-danger'">
              {{ order.paymentStatus === 1 ? "Đã thanh toán" : "Chưa thanh toán" }}
            </span>
          </p>
          <p><strong>Tổng tiền:</strong> {{ formatPrice(order.totalAmount) }}</p>

          <!-- Nút bấm -->
          <button
            class="btn btn-sm btn-outline-primary"
            @click="toggleDetails(order.orderId)"
          >
            {{
              expandedOrders.includes(order.orderId)
                ? "Ẩn chi tiết"
                : "Xem chi tiết sản phẩm"
            }}
          </button>

          <!-- Bảng chi tiết -->
          <div
            v-if="expandedOrders.includes(order.orderId)"
            class="mt-3 table-responsive"
          >
            <table class="table table-hover align-middle text-light custom-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Màu</th>
                  <th>Size</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detail in order.orderDetails" :key="detail.orderDetailId">
                  <td>
                    <img :src="getImageUrl(detail.imageUrl)" alt="product" width="80" />
                  </td>
                  <td>{{ detail.productName }}</td>
                  <td>{{ detail.color }}</td>
                  <td>{{ detail.size }}</td>
                  <td>{{ detail.quantity }}</td>
                  <td>{{ formatPrice(detail.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <div class="admin-pagination" v-if="totalPages > 1">
      <!-- Prev -->
      <div
        class="admin-button admin-prev"
        :class="{ disabled: page === 0 }"
        @click="changePage(page - 1)"
      >
        &lt; prev
      </div>

      <div
        class="admin-page"
        v-for="p in totalPages"
        :key="p"
        :class="{ active: p - 1 === page }"
        @click="changePage(p - 1)"
      >
        {{ p }}
      </div>
      <!-- Next -->
      <div
        class="admin-button admin-next"
        :class="{ disabled: page >= totalPages - 1 }"
        @click="changePage(page + 1)"
      >
        next &gt;
      </div>
    </div>
  </div>
</template>

<script>
import { getOrdersByUserId } from "@/api/admin/orderAPI";

export default {
  name: "OrderTable",
  data() {
    return {
      orders: [],
      page: 0,
      totalPages: 0,
      loading: true,
      userId: null,
      expandedOrders: [], // lưu danh sách các order đang mở chi tiết
    };
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const res = await getOrdersByUserId(this.userId, this.page, 2);
        this.orders = res.content;
        this.totalPages = res.totalPages;
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      } finally {
        this.loading = false;
      }
    },
    changePage(newPage) {
      if (newPage >= 0 && newPage < this.totalPages) {
        this.page = newPage;
        this.fetchOrders();
      }
    },
    toggleDetails(orderId) {
      if (this.expandedOrders.includes(orderId)) {
        this.expandedOrders = this.expandedOrders.filter((id) => id !== orderId);
      } else {
        this.expandedOrders.push(orderId);
      }
    },
    formatPrice(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString("vi-VN");
    },
    formatStatus(status) {
      const statusOptions = [
        "Chờ xác nhận", // 0
        "Chờ lấy hàng", // 1
        "Chờ giao hàng", // 2
        "Đã giao", // 3
        "Yêu cầu trả hàng", // 4
        "Đã hủy", // 5
        "Trả hàng đã duyệt", // 6
        "Từ chối trả hàng", // 7
      ];
      return statusOptions[status] || "Không xác định";
    },

    getImageUrl(fileName) {
      return `http://localhost:8080/images/${fileName}`;
    },
  },
  mounted() {
    this.userId = this.$route.params.userId;
    this.fetchOrders();
  },
};
</script>
