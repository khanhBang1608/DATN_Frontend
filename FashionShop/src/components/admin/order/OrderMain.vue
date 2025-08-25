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
      <div class="mb-3 admin-date-filter">
        <label class="form-label">Ngày đặt hàng</label>
        <div class="d-flex gap-2 flex-wrap">
          <Datepicker
            v-model="filters.startDate"
            format="yyyy-MM-dd"
            placeholder="Ngày"
            class="admin-date-input"
            style="max-width: 180px"
          />
          Đến
          <Datepicker
            v-model="filters.endDate"
            format="yyyy-MM-dd"
            placeholder="Ngày"
            class="admin-date-input"
            style="max-width: 180px"
          />
        </div>
      </div>

      <!-- Tên người đặt -->
      <div class="mb-3 w-50">
        <label class="form-label">Tìm kiếm</label>
        <div class="admin-search-box">
          <input
            type="text"
            class="admin-search-text"
            v-model="filters.userFullName"
            placeholder="Nhập tên người đặt..."
          />
          <i class="bi bi-search admin-search-icon"></i>
        </div>
      </div>

      <!-- Nút lọc -->
      <div>
        <button class="btn btn-secondary" @click="clearFilters">Xóa tất cả bộ lọc</button>
      </div>
    </div>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Tên người đặt</th>
            <th>Ngày đặt hàng</th>
            <th>Số điện thoại</th>
            <th>Tổng tiền</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredOrders.length === 0">
            <td colspan="8" class="text-center text-white fs-5 py-4">
              <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i> Không có
              đơn hàng nào được tìm thấy.
            </td>
          </tr>
          <tr v-for="order in filteredOrders" :key="order.orderId">
            <td>{{ order.orderId }}</td>
            <td>{{ order.userFullName || "Không xác định" }}</td>
            <td>{{ new Date(order.orderDate).toLocaleDateString("vi-VN") }}</td>
            <td>{{ extractPhone(order.address) }}</td>
            <td>{{ formatPrice(order.totalAmount) }}</td>
            <td>{{ order.paymentMethod }}</td>
            <td
              :class="{
                'text-warning': order.status === 0,
                'text-info': order.status === 1 || order.status === 2,
                'text-success': order.status === 3 || order.status === 6,
                'text-danger':
                  order.status === 4 || order.status === 5 || order.status === 7,
              }"
            >
              {{ orderStatus(order.status) }}
            </td>
            <td class="text-center">
              <router-link
                :to="`/admin/order/${order.orderId}`"
                class="btn btn-primary btn-sm me-2"
                >Xem</router-link
              >
              <button
                v-if="
                  (order.status === 0 || order.status === 1) &&
                  order.paymentMethod !== 'VNPAY'
                "
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
    <div v-if="totalPages > 1" class="admin-pagination">
      <div
        class="admin-button admin-prev"
        :class="{ disabled: currentPage === 0 }"
        @click="changePage(currentPage - 1)"
      >
        &lt; Trước
      </div>
      <div
        v-for="page in displayedPages"
        :key="page"
        class="admin-page"
        :class="{ active: currentPage === page - 1, ellipsis: page === '...' }"
        @click="page !== '...' && changePage(page - 1)"
      >
        {{ page }}
      </div>
      <div
        class="admin-button admin-next"
        :class="{ disabled: currentPage === totalPages - 1 }"
        @click="changePage(currentPage + 1)"
      >
        Sau &gt;
      </div>
    </div>
  </div>
</template>
<script>
import { getAllOrders, getOrderById, updateOrder } from "@/api/admin/orderAPI";
import Datepicker from "vue3-datepicker";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { ref, computed, watch, onMounted } from "vue";

export default {
  name: "OrderMain",
  components: { Datepicker },
  setup() {
    const token = localStorage.getItem("token") || "";

    // Data
    const orders = ref([]);
    const loading = ref(false);
    const totalPages = ref(0);
    const currentPage = ref(0);
    const pageSize = ref(8);

    const filters = ref({
      status: [],
      startDate: null,
      endDate: null,
      userFullName: "",
    });

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

    // Fetch orders
    const fetchOrders = async (page = 0) => {
      loading.value = true;
      try {
        const res = await getAllOrders(page, pageSize.value);
        orders.value = res.content;
        totalPages.value = res.totalPages;
        currentPage.value = res.currentPage || page;
      } catch (err) {
        if (err.message.includes("Access denied")) {
          iziToast.error({
            title: "Lỗi",
            message: "Bạn không có quyền truy cập. Vui lòng đăng nhập tài khoản admin.",
            position: "topRight",
          });
          this.$router.push("/login");
        } else {
          iziToast.error({
            title: "Lỗi",
            message: "Không thể tải danh sách đơn hàng.",
            position: "topRight",
          });
        }
      } finally {
        loading.value = false;
      }
    };

    // Change page
    const changePage = (page) => {
      if (page >= 0 && page < totalPages.value) {
        fetchOrders(page);
      }
    };

    // Filtered orders
    const filteredOrders = computed(() => {
      let result = [...orders.value];

      if (filters.value.status.length > 0) {
        result = result.filter((o) => filters.value.status.includes(o.status));
      }

      if (filters.value.startDate && filters.value.endDate) {
        const start = new Date(filters.value.startDate);
        const end = new Date(filters.value.endDate);
        end.setHours(23, 59, 59, 999);
        result = result.filter((o) => {
          const orderDate = new Date(o.orderDate);
          return orderDate >= start && orderDate <= end;
        });
      }

      if (filters.value.userFullName.trim()) {
        const search = filters.value.userFullName.trim().toLowerCase();
        result = result.filter((o) =>
          (o.userFullName || "").toLowerCase().includes(search)
        );
      }

      // Sort theo trạng thái tăng dần
      result.sort((a, b) => a.status - b.status);

      return result;
    });

    // Displayed pages for pagination
    const displayedPages = computed(() => {
      const pages = [];
      const maxPagesToShow = 5;

      if (totalPages.value <= maxPagesToShow) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        if (currentPage.value < 3) {
          pages.push(2, 3, 4);
          if (totalPages.value > 4) {
            pages.push("...");
          }
          pages.push(totalPages.value);
        } else if (currentPage.value >= totalPages.value - 2) {
          if (totalPages.value > 4) {
            pages.push("...");
          }
          pages.push(
            totalPages.value - 3,
            totalPages.value - 2,
            totalPages.value - 1,
            totalPages.value
          );
        } else {
          pages.push("...");
          const startPage = currentPage.value + 1;
          const endPage = Math.min(currentPage.value + 3, totalPages.value - 1);
          for (let i = startPage; i <= endPage; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
          if (endPage < totalPages.value) {
            pages.push(totalPages.value);
          }
        }
      }

      return pages;
    });

    // Clear filters
    const clearFilters = () => {
      filters.value = {
        status: [],
        startDate: null,
        endDate: null,
        userFullName: "",
      };
      // iziToast.info({
      //   title: "Thông báo",
      //   message: "Đã xóa tất cả bộ lọc.",
      //   position: "topRight",
      // });
    };

    // Extract phone
    const extractPhone = (address) => {
      return address?.split(" - ")[0] || "Không xác định";
    };

    // Format price
    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };

    // Order status
    const orderStatus = (status) => {
      return statusOptions[status] || "Không xác định";
    };

    // Cancel order
    const cancelOrder = async (orderId) => {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Đơn hàng sẽ bị hủy vĩnh viễn!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (result.isConfirmed) {
        loading.value = true;
        try {
          const order = await getOrderById(orderId);
          if (![0, 1].includes(order.status)) {
            iziToast.warning({
              title: "Cảnh báo",
              message:
                'Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận" hoặc "Chờ lấy hàng".',
              position: "topRight",
            });
            return;
          }
          if (order.paymentMethod && order.paymentMethod.toUpperCase() === "VNPAY") {
            iziToast.warning({
              title: "Cảnh báo",
              message:
                "Đơn hàng thanh toán qua VNPAY không thể tự hủy. Vui lòng liên hệ hỗ trợ.",
              position: "topRight",
            });
            return;
          }

          await updateOrder(orderId, { ...order, status: 5 });
          await fetchOrders(currentPage.value);
          iziToast.success({
            title: "Thành công",
            message: "Đơn hàng đã được hủy.",
            position: "topRight",
          });
        } catch (err) {
          iziToast.error({
            title: "Lỗi",
            message: err.message || "Lỗi khi hủy đơn hàng.",
            position: "topRight",
          });
        } finally {
          loading.value = false;
        }
      }
    };

    // Watch filters
    watch(
      filters,
      () => {
        currentPage.value = 0;
        fetchOrders(0);
      },
      { deep: true }
    );

    // Mounted
    onMounted(() => {
      if (!token) {
        iziToast.error({
          title: "Lỗi",
          message: "Vui lòng đăng nhập tài khoản admin.",
          position: "topRight",
        });
        this.$router.push("/login");
      } else {
        fetchOrders(0);
      }
    });

    return {
      orders,
      filteredOrders,
      loading,
      filters,
      statusOptions,
      totalPages,
      currentPage,
      displayedPages,
      fetchOrders,
      changePage,
      clearFilters,
      extractPhone,
      formatPrice,
      orderStatus,
      cancelOrder,
    };
  },
};
</script>

<style scoped>
.card {
  background-color: #2c3e50;
  color: #ecf0f1;
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
