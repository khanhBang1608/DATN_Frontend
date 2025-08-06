<template>
  <div class="order-detail-wrapper" v-if="order">
    <div class="order-card text-light p-4 rounded shadow">
      <h2 class="text-center mb-4">Chi tiết đơn hàng #{{ order.orderId }}</h2>

      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Tên người đặt</label>
          <input
            type="text"
            class="form-control"
            :value="order.userFullName || 'Không xác định'"
            disabled
          />
          <input
            type="text"
            class="form-control"
            :value="order.userFullName || 'Không xác định'"
            disabled
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Địa chỉ</label>
          <input type="text" class="form-control" :value="extractedAddress" disabled />
        </div>
        <div class="col-md-6">
          <label class="form-label">Số điện thoại</label>
          <input type="text" class="form-control" :value="extractedPhone" disabled />
        </div>
        <div class="col-md-6">
          <label class="form-label">Tổng tiền</label>
          <input
            type="text"
            class="form-control"
            :value="formatPrice(order.totalAmount)"
            disabled
          />
          <input
            type="text"
            class="form-control"
            :value="formatPrice(order.totalAmount)"
            disabled
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Phí vận chuyển</label>
          <input
            type="text"
            class="form-control"
            :value="formatPrice(order.shippingFee)"
            disabled
          />
          <input
            type="text"
            class="form-control"
            :value="formatPrice(order.shippingFee)"
            disabled
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Giảm giá</label>
          <input
            type="text"
            class="form-control"
            :value="formatPrice(order.discountAmount)"
            disabled
          />
          <input
            type="text"
            class="form-control"
            :value="formatPrice(order.discountAmount)"
            disabled
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Phương thức thanh toán</label>
          <input type="text" class="form-control" :value="order.paymentMethod" disabled />
        </div>
        <div class="col-md-6">
          <label class="form-label">Trạng thái thanh toán</label>
          <input

            type="text"

            class="form-control"

            :value="
              order.paymentStatus === 0
                ? 'Chưa thanh toán'
                : order.paymentStatus === 1
                ? 'Đã thanh toán'
                : 'Đã hoàn tiền'
            "

            disabled

          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <input
            type="text"
            class="form-control"
            :value="statusOptions[order.status]"
            disabled
          />
        </div>
      </div>

      <hr class="my-4 border-light" />

      <h5 class="text-center text-info">Chi tiết sản phẩm</h5>
      <div class="table-responsive mb-4">
        <table class="table table-bordered table-hover table-striped bg-light text-dark">
          <thead class="table-dark">
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Phân loại</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in order.orderDetails" :key="detail.orderDetailId">
              <td>
                <img
                  :src="
                    detail.imageUrl
                      ? `http://localhost:8080/images/${detail.imageUrl}`
                      : 'path/to/default.jpg'
                  "
                  alt=""
                  class="img-thumbnail"
                />
              </td>

              <td>{{ detail.productName }}</td>
              <td>Size: {{ detail.size }}, Màu: {{ detail.color }}</td>
              <td>{{ detail.quantity }}</td>
              <td>{{ formatPrice(detail.price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="[4, 6, 7].includes(order.status) && returnRequest" class="mt-4">
        <h5 class="text-info text-center">Lý do trả hàng:</h5>
        <p class="text-light">{{ returnRequest.reason }}</p>

        <div v-if="returnRequest.imageUrls?.length">
          <h6 class="text-warning">Ảnh đính kèm:</h6>
          <div class="d-flex flex-wrap gap-2">
            <img
              v-for="(url, i) in returnRequest.imageUrls"
              :key="i"
              :src="resolveFileUrl(url)"
              class="img-thumbnail"
              style="max-height: 150px"
            />
          </div>
        </div>

        <div v-if="returnRequest.videoUrls?.length" class="mt-3">
          <h6 class="text-warning">Video đính kèm:</h6>
          <div class="d-flex flex-wrap gap-3">
            <video
              v-for="(url, i) in returnRequest.videoUrls"
              :key="i"
              :src="resolveFileUrl(url)"
              class="rounded"
              style="max-height: 200px"
              controls
            />
          </div>
        </div>
      </div>

      <div class="d-flex flex-wrap justify-content-center gap-2">
        <button class="btn btn-outline-light" @click="exportToPDF">
          Xuất hóa đơn PDF
        </button>

        <button v-if="order.status === 4" class="btn btn-success" @click="approveReturn">
          Duyệt trả hàng
        </button>
        <button v-if="order.status === 4" class="btn btn-danger" @click="rejectReturn">
          Từ chối trả hàng
        </button>
        <button
          v-if="[0, 1, 2].includes(order.status)"
          class="btn btn-primary"
          @click="updateStatusFlow"
        >
        </button>
        <button
          v-if="[0, 1, 2].includes(order.status)"
          class="btn btn-primary"
          @click="updateStatusFlow"
        >
          Cập nhật trạng thái
        </button>
        <button v-if="order.status === 0" class="btn btn-danger" @click="cancelOrder">
          Hủy đơn
        </button>
        <router-link to="/admin/orders" class="btn btn-secondary">Quay lại</router-link>
        <button v-if="order.status === 0" class="btn btn-danger" @click="cancelOrder">
          Hủy đơn
        </button>
        <router-link to="/admin/order" class="btn btn-secondary">Quay lại</router-link>
      </div>

      <div v-if="error" class="alert alert-danger mt-3 text-center">{{ error }}</div>
    </div>
  </div>
</template>

<style scoped>
.order-detail-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}
.table td,
.table th {
  vertical-align: middle;
}
.img-thumbnail {
  max-height: 80px;
  object-fit: contain;
}
</style>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getOrderById,
  updateOrder,
  downloadInvoicePDF,
  approveReturnRequest,
  rejectReturnRequest,
  getReturnRequestByOrder,
} from '@/api/admin/orderAPI'
import { useToast } from 'vue-toastification'
const BASE_IMAGE_URL = 'http://localhost:8080'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const orderId = computed(() => parseInt(route.params.orderId))
const order = ref(null)
const error = ref(null)
const returnRequest = ref(null)

const statusOptions = [
  "Chờ xác nhận",
  "Chờ lấy hàng",
  "Chờ giao hàng",
  "Đã giao",
  "Yêu cầu trả hàng",
  "Đã hủy",
  "Trả hàng đã duyệt",
  "Từ chối trả hàng",
];

const extractedPhone = computed(() => order.value?.address?.split(' - ')[0] || 'Không xác định')
const extractedAddress = computed(
  () => order.value?.address?.split(' - ')[1] || order.value?.address || 'Không xác định',
)
const resolveFileUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return BASE_IMAGE_URL + url
}
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );
}

async function fetchOrder() {
  try {
    const response = await getOrderById(orderId.value)
    order.value = response

    if (order.value.status === 4) {
      const returnData = await getReturnRequestByOrder(orderId.value)
      returnRequest.value = returnData
    } else {
      returnRequest.value = null
    }
  } catch (err) {
    console.error("Fetch error:", err);
    error.value = "Không thể tải chi tiết đơn hàng.";
  }
}

async function updateStatusFlow() {
  const flow = {
    0: 1,
    1: 2,
    2: 3,
  };
  const current = order.value.status;
  const next = flow[current];

  if (next === undefined) {
    toast.error("Không thể cập nhật trạng thái ở bước hiện tại.");
    return;
  }

  const confirmMsg = `Bạn có muốn cập nhật trạng thái đơn hàng từ "${statusOptions[current]}" lên "${statusOptions[next]}"?`;
  if (!window.confirm(confirmMsg)) return;

  try {
    order.value.status = next;
    await updateOrder(orderId.value, order.value);
    toast.success("Cập nhật trạng thái thành công");
  } catch (err) {
    toast.error("Không thể cập nhật trạng thái đơn hàng.");
  }
}

async function cancelOrder() {
  if (order.value.status !== 0) {
    toast.error('Chỉ có thể hủy đơn hàng khi trạng thái là "Chờ xác nhận".');
    return;
  }
  order.value.status = 5;
  try {
    await updateOrder(orderId.value, order.value);
    toast.success("Đơn hàng đã được hủy");
  } catch (err) {
    toast.error("Không thể hủy đơn hàng.");
  }
}

async function fetchReturnReason() {
  try {
    if ([4, 6, 7].includes(order.value?.status)) {
      returnRequest.value = await getReturnRequestByOrder(orderId.value)
    }
  } catch (err) {
    console.warn('Không tìm thấy lý do trả hàng:', err)
  }
}

onMounted(() => {
  if (!isNaN(orderId.value)) {
    fetchOrder().then(fetchReturnReason)
  }
})

async function approveReturn() {
  try {
    await approveReturnRequest(orderId.value);
    order.value.status = 6;
    toast.success("Đã duyệt yêu cầu trả hàng");
  } catch (err) {
    toast.error("Không thể duyệt yêu cầu trả hàng.");
  }
}

async function rejectReturn() {
  try {
    await rejectReturnRequest(orderId.value);
    order.value.status = 7;
    toast.info("Đã từ chối yêu cầu trả hàng");
  } catch (err) {
    toast.error("Không thể từ chối yêu cầu trả hàng.");
  }
}

async function exportToPDF() {
  try {
    await downloadInvoicePDF(orderId.value);
    toast.success("Tải hóa đơn PDF thành công");
  } catch (err) {
    toast.error("Không thể xuất hóa đơn PDF.");
  }
}

onMounted(() => {
  if (!isNaN(orderId.value)) fetchOrder();
});

watch(
  () => orderId.value,
  (newVal) => {
    if (!isNaN(newVal)) fetchOrder()
  },
)
</script>
