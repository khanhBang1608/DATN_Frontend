<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🛍️ Quản lý đơn hàng</h2>
    </div>
    <div class="mb-4">
      <div class="mb-3">
        <label class="form-label">Trạng thái</label>
        <div class="d-flex flex-wrap gap-3">
          <div
            v-for="(status, index) in statusOptions"
            :key="index"
            class="form-check form-check-inline"
          >
            <input
              type="checkbox"
              class="form-check-input"
              :id="`status-${index}`"
              :value="index"
              v-model="filters.status"
            />
            <label :for="`status-${index}`" class="form-check-label">{{ status }}</label>
          </div>
        </div>
      </div>

      <!-- Ngày đặt hàng (ngang hàng) -->
      <div class="mb-3">
        <label class="form-label">Ngày đặt hàng</label>
        <div class="d-flex gap-2 flex-wrap">
          <Datepicker
            v-model="filters.startDate"
            format="yyyy-MM-dd"
            placeholder="Ngày"
            class="form-control"
            style="max-width: 180px"
          />
          Đến
          <Datepicker
            v-model="filters.endDate"
            format="yyyy-MM-dd"
            placeholder="Ngày"
            class="form-control"
            style="max-width: 180px"
          />
        </div>
      </div>

      <!-- Tên người đặt -->
      <div class="mb-3 w-50">
        <label class="form-label">Tên người đặt</label>
        <input
          type="text"
          class="form-control"
          v-model="filters.userFullName"
          placeholder="Nhập tên..."
        />
      </div>

      <!-- Nút lọc -->
      <div>
        <button class="btn btn-primary me-2" @click="applyFilters">Áp dụng bộ lọc</button>
        <button class="btn btn-secondary" @click="clearFilters">Xóa tất cả bộ lọc</button>
      </div>
    </div>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="table-responsive mt-3">
      <table class="table table-hover align-middle text-light custom-table">
        <thead class="table-dark">
          <tr>
            <th>Mã đơn hàng</th>
            <th>Tên người đặt</th>
            <th>Ngày đặt hàng</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Tổng tiền</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.orderId">
            <td>{{ order.orderId }}</td>
            <td>{{ order.userFullName || "Không xác định" }}</td>
            <td>{{ new Date(order.orderDate).toLocaleDateString("vi-VN") }}</td>
            <td>{{ order.address }}</td>
            <td>{{ order.phoneNumber || "Không xác định" }}</td>
            <td>{{ formatPrice(order.totalAmount) }}</td>
            <td>{{ order.paymentMethod }}</td>
            <td
              :class="{
                'text-warning': order.status === 0,
                'text-info': order.status === 1 || order.status === 2,
                'text-success': order.status === 3,
                'text-danger': order.status === 4 || order.status === 5,
              }"
            >
              {{ orderStatus(order.status) }}
            </td>
            <td class="text-center">
              <button
                class="btn btn-primary btn-sm me-2"
                @click="viewOrder(order.orderId)"
              >
                Xem
              </button>
              <button
                v-if="order.status === 0"
                class="btn btn-danger btn-sm"
                @click="cancelOrder(order.orderId)"
              >
                Hủy
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getAllOrders, getOrderById, updateOrder } from "@/api/admin/orderAPI";
import Datepicker from "vue3-datepicker";
import { useToast } from "vue-toastification";

export default {
  name: "OrderMain",
  components: { Datepicker },
  data() {
    return {
      orders: [],
      filteredOrders: [],
      loading: false,
      filters: {
        status: [],
        startDate: null,
        endDate: null,
        userFullName: "",
      },
      statusOptions: [
        "Chờ xác nhận",
        "Chờ lấy hàng",
        "Chờ giao hàng",
        "Đã giao",
        "Trả hàng",
        "Đã hủy",
      ],
      toast: useToast(),
    };
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    orderStatus(status) {
      return this.statusOptions[status] || "Không xác định";
    },
    async fetchOrders() {
      this.loading = true;
      try {
        this.orders = await getAllOrders();
        this.applyFilters();
        this.toast.success("Tải đơn hàng thành công!");
      } catch (err) {
        if (err.message.includes("Access denied")) {
          this.toast.error(
            "Bạn không có quyền truy cập. Vui lòng đăng nhập tài khoản admin."
          );
          this.$router.push("/login");
        } else {
          this.toast.error("Không thể tải danh sách đơn hàng.");
        }
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      let result = [...this.orders];

      if (this.filters.status.length > 0) {
        result = result.filter((o) => this.filters.status.includes(o.status));
      }

      if (this.filters.startDate && this.filters.endDate) {
        const start = new Date(this.filters.startDate);
        const end = new Date(this.filters.endDate);
        end.setHours(23, 59, 59, 999);
        result = result.filter((o) => {
          const orderDate = new Date(o.orderDate);
          return orderDate >= start && orderDate <= end;
        });
      }

      if (this.filters.userFullName.trim()) {
        const search = this.filters.userFullName.trim().toLowerCase();
        result = result.filter((o) =>
          (o.userFullName || "").toLowerCase().includes(search)
        );
      }

      this.filteredOrders = result;
    },
    clearFilters() {
      this.filters = {
        status: [],
        startDate: null,
        endDate: null,
        userFullName: "",
      };
      this.applyFilters();
      this.toast.info("Đã xóa tất cả bộ lọc.");
    },
    viewOrder(orderId) {
      this.$emit("view-order", orderId);
    },
    async cancelOrder(orderId) {
      if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
      this.loading = true;
      try {
        const order = await getOrderById(orderId);
        if (order.status !== 0) {
          this.toast.warning('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận".');
          return;
        }
        await updateOrder(orderId, { ...order, status: 5 });
        await this.fetchOrders();
        this.toast.success("Đơn hàng đã được hủy.");
        this.$emit("order-updated");
      } catch (err) {
        this.toast.error(err.message || "Lỗi khi hủy đơn hàng.");
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.toast.error("Vui lòng đăng nhập tài khoản admin.");
      this.$router.push("/login");
    } else {
      this.fetchOrders();
    }
  },
};
</script>

<style scoped>
.card {
  background-color: #2c3e50;
  color: #ecf0f1;
}
.custom-table {
  background-color: #34495e;
  border-radius: 6px;
}
.table-dark {
  background-color: #1a252f;
}
.table-hover tbody tr:hover {
  background-color: #3e5c76;
}
.btn-primary {
  background-color: #3498db;
  border-color: #3498db;
}
.btn-danger {
  background-color: #e74c3c;
  border-color: #e74c3c;
}
.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}
.custom-select {
  background-color: #ecf0f1;
  color: #2c3e50;
  min-height: 90px;
  padding: 6px;
}
.filter-container {
  display: flex;
  flex-direction: column;
  max-width: 350px;
}
</style>
