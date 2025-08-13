<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-white">Danh sách đơn hàng</h2>
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

          <!-- Accordion chi tiết đơn hàng -->
          <div class="accordion" :id="'accordion-' + order.orderId">
            <div class="accordion-item">
              <h2 class="accordion-header" :id="'heading-' + order.orderId">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#collapse-' + order.orderId"
                  aria-expanded="false"
                >
                  Xem chi tiết sản phẩm
                </button>
              </h2>
              <div
                :id="'collapse-' + order.orderId"
                class="accordion-collapse collapse"
                :aria-labelledby="'heading-' + order.orderId"
                :data-bs-parent="'#accordion-' + order.orderId"
              >
                <div class="accordion-body p-0">
                  <table class="table table-striped mb-0">
                    <thead class="table-light">
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
                      <tr
                        v-for="detail in order.orderDetails"
                        :key="detail.orderDetailId"
                      >
                        <td>
                          <img
                            :src="getImageUrl(detail.imageUrl)"
                            alt="product"
                            width="50"
                            class="img-thumbnail"
                          />
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
        </div>
      </div>

      <!-- Phân trang -->
      <nav class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page === 0 }">
            <button class="page-link" @click="changePage(page - 1)">Trước</button>
          </li>
          <li
            class="page-item"
            v-for="p in totalPages"
            :key="p"
            :class="{ active: p - 1 === page }"
          >
            <button class="page-link" @click="changePage(p - 1)">{{ p }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page >= totalPages - 1 }">
            <button class="page-link" @click="changePage(page + 1)">Sau</button>
          </li>
        </ul>
      </nav>
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
    };
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const res = await getOrdersByUserId(this.userId, this.page, 10);
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
      const map = { 0: "Chờ xử lý", 1: "Hoàn tất" };
      return map[status] || "Không xác định";
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
