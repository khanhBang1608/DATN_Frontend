<template>
  <div class="order-detail-wrapper" v-if="order">
    <div class="order-card p-4 rounded shadow">
      <h2 class="text-center mb-4 text-brand">Chi tiết đơn hàng #{{ order.orderId }}</h2>

      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label fw-bold">Tên người đặt</label>
          <input
            type="text"
            class="form-control"
            :value="order.userFullName || 'Không xác định'"
            disabled
          />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Người nhận</label>
          <input type="text" class="form-control" :value="extractedFullName" disabled />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Địa chỉ</label>
          <input type="text" class="form-control" :value="extractedAddress" disabled />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Số điện thoại</label>
          <input type="text" class="form-control" :value="extractedPhone" disabled />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Tổng tiền</label>
          <input
            type="text"
            class="form-control"
            :value="formatPrice(order.totalAmount)"
            disabled
          />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Phí vận chuyển</label>
          <input
            type="text"
            class="form-control"
            :value="formatPrice(order.shippingFee)"
            disabled
          />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Giảm giá</label>
          <input
            type="text"
            class="form-control"
            :value="formatPrice(order.discountAmount)"
            disabled
          />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Phương thức thanh toán</label>
          <input type="text" class="form-control" :value="order.paymentMethod" disabled />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Trạng thái thanh toán</label>
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
          <label class="form-label fw-bold">Trạng thái</label>
          <input
            type="text"
            class="form-control"
            :value="
              order.ghnOrderCode
                ? ghnStatusMap[order.ghnOrderStatus] || order.ghnOrderStatus
                : 'Chưa gửi GHN'
            "
            disabled
          />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold">Tên người nhận</label>
          <input type="text" class="form-control" :value="extractedCustomerName" disabled />
        </div>
      </div>

      <hr class="my-4 border-brand" />

      <h5 class="text-center text-brand">Chi tiết sản phẩm</h5>
      <div class="table-responsive mb-4">
        <table class="table table-bordered table-hover bg-white">
          <thead class="table-brand">
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Phân loại</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in order.orderDetails" :key="detail.orderDetailId">
              <td class="align-middle">
                <img
                  :src="
                    detail.imageUrl
                      ? `http://localhost:8080/images/${detail.imageUrl}`
                      : '/path/to/default.jpg'
                  "
                  alt=""
                  class="img-thumbnail"
                />
              </td>
              <td class="align-middle">{{ detail.productName }}</td>
              <td class="align-middle">Size: {{ detail.size }}, Màu: {{ detail.color }}</td>
              <td class="align-middle text-center">{{ detail.quantity }}</td>
              <td class="align-middle text-end">{{ formatPrice(detail.price) }}</td>
              <td class="align-middle text-end">
                {{ formatPrice(detail.price * detail.quantity) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="[4, 6, 7].includes(order.status) && returnRequest" class="mt-4">
        <h5 class="text-center text-brand">Lý do trả hàng</h5>
        <p class="text-dark">{{ returnRequest.reason }}</p>

        <div v-if="returnRequest.imageUrls?.length" class="mt-3">
          <h6 class="text-warning">Ảnh đính kèm</h6>
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
          <h6 class="text-warning">Video đính kèm</h6>
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

      <div class="d-flex flex-wrap justify-content-center gap-3 mt-4">
        <button class="btn btn-brand" :disabled="loading" @click="exportToPDF">
          <i class="bi bi-file-earmark-pdf me-2"></i>
          {{ loading ? 'Đang tải...' : 'Xuất hóa đơn PDF' }}
        </button>
        <button
          v-if="order.status === 0"
          class="btn btn-success"
          @click="approveOrder(order.orderId)"
        >
          Duyệt
        </button>
        <button
          v-if="order.ghnOrderCode"
          class="btn btn-info"
          :disabled="loading"
          @click="printGhnLabel"
        >
          <i class="bi bi-printer me-2"></i>In nhãn vận chuyển
        </button>
        <button
          v-if="order.status === 4"
          class="btn btn-success"
          :disabled="loading"
          @click="approveReturn"
        >
          Duyệt trả hàng
        </button>
        <button
          v-if="order.status === 4"
          class="btn btn-danger"
          :disabled="loading"
          @click="rejectReturn"
        >
          Từ chối trả hàng
        </button>
        <button
          v-if="order.ghnOrderCode"
          class="btn btn-warning"
          :disabled="loading"
          @click="syncGhnStatus"
        >
          <i class="bi bi-arrow-repeat me-2"></i>Đồng bộ trạng thái GHN
        </button>
        <button
          v-if="order.status === 0"
          class="btn btn-outline-danger"
          :disabled="loading"
          @click="cancelOrder"
        >
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
.order-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: none;
}
.text-brand {
  color: #0066cc;
  font-weight: bold;
}
.border-brand {
  border-color: #0066cc;
}
.table-brand {
  background-color: #0066cc;
  color: white;
}
.table th,
.table td {
  vertical-align: middle;
}
.img-thumbnail {
  max-height: 80px;
  object-fit: contain;
  border-radius: 8px;
}
.btn-brand {
  background-color: #0066cc;
  color: white;
  border: none;
}
.btn-brand:hover {
  background-color: #0055aa;
}
</style>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  getOrderById,
  updateOrder,
  downloadInvoicePDF,
  approveReturnRequest,
  rejectReturnRequest,
  getReturnRequestByOrder,
  syncGhnStatusAPI,
  approveOrderAPI
} from '@/api/admin/orderAPI'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const BASE_IMAGE_URL = 'http://localhost:8080'

const toast = useToast()
const route = useRoute()
const orderId = computed(() => parseInt(route.params.orderId))
const order = ref(null)
const error = ref(null)
const returnRequest = ref(null)
const loading = ref(false)
const statusOptions = [
  'Chờ xác nhận',
  'Chờ lấy hàng',
  'Chờ giao hàng',
  'Đã giao',
  'Yêu cầu trả hàng',
  'Đã hủy',
  'Trả hàng đã duyệt',
  'Từ chối trả hàng',
]
const ghnStatusMap = {
  ready_to_pick: 'Chờ GHN lấy hàng',
  picking: 'Nhân viên đang lấy hàng',
  storing: 'Đang lưu kho GHN',
  transporting: 'Đang luân chuyển',
  delivering: 'Đang giao hàng',
  delivered: 'Đã giao thành công',
  return: 'Đang hoàn trả',
  returning: 'Đang chuyển hoàn',
  returned: 'Đã hoàn trả',
  cancel: 'Đơn bị hủy',
}

const extractedFullName = computed(() => {
  if (!order.value?.address) return 'Không xác định'
  const parts = order.value.address.split(' - ')
  return parts.length > 0 ? parts[0] : 'Không xác định'
})

const extractedPhone = computed(() => {
  if (!order.value?.address) return 'Không xác định'
  const parts = order.value.address.split(' - ')
  return parts.length > 1 ? parts[1] : 'Không xác định'
})

const extractedAddress = computed(() => {
  if (!order.value?.address) return 'Không xác định'
  const parts = order.value.address.split(' - ')
  return parts.length > 1 ? parts[2] : order.value.address
})

const extractedCustomerName = computed(() => {
  if (!order.value?.address) return 'Không xác định'
  const parts = order.value.address.split(' - ')
  return parts.length > 2 ? parts[2] : 'Không xác định'
})

const resolveFileUrl = (url) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `${BASE_IMAGE_URL}${url}`
}

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

async function fetchOrderData() {
  try {
    loading.value = true
    const response = await getOrderById(orderId.value)
    order.value = response

    if ([4, 6, 7].includes(order.value.status)) {
      returnRequest.value = await getReturnRequestByOrder(orderId.value)
    } else {
      returnRequest.value = null
    }
  } catch (err) {
    console.error('Fetch error:', err)
    error.value = err.response?.data?.message || 'Không thể tải chi tiết đơn hàng.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

async function approveOrder(orderId) {
  const result = await Swal.fire({
    title: 'Bạn chắc chắn?',
    text: `Bạn có muốn duyệt đơn hàng #${orderId}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Duyệt',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })

  if (!result.isConfirmed) return

  try {
    loading.value = true
    await approveOrderAPI(orderId)
    fetchOrderData()
    toast.success(`Đã duyệt đơn hàng #${orderId}`)
  } catch (error) {
    toast.error(error.response?.data?.message || 'Duyệt đơn hàng thất bại.')
  } finally {
    loading.value = false
  }
}

async function updateStatusFlow() {
  const flow = { 0: 1, 1: 2, 2: 3 }
  const current = order.value.status
  const next = flow[current]

  if (next === undefined) {
    toast.error('Không thể cập nhật trạng thái ở bước hiện tại.')
    return
  }

  const result = await Swal.fire({
    title: 'Bạn chắc chắn?',
    text: `Bạn có muốn cập nhật trạng thái đơn hàng từ "${statusOptions[current]}" lên "${statusOptions[next]}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Cập nhật',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })

  if (!result.isConfirmed) return

  try {
    loading.value = true
    order.value.status = next
    await updateOrder(orderId.value, order.value)
    toast.success('Cập nhật trạng thái thành công')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng.')
  } finally {
    loading.value = false
  }
}

async function cancelOrder() {
  if (order.value.status !== 0) {
    toast.error('Chỉ có thể hủy đơn hàng khi trạng thái là "Chờ xác nhận".')
    return
  }

  const result = await Swal.fire({
    title: 'Bạn chắc chắn?',
    text: 'Đơn hàng sẽ bị hủy vĩnh viễn!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hủy đơn',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  })

  if (!result.isConfirmed) return

  try {
    loading.value = true
    order.value.status = 5
    await updateOrder(orderId.value, order.value)
    toast.success('Đơn hàng đã được hủy')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Không thể hủy đơn hàng.')
  } finally {
    loading.value = false
  }
}

async function approveReturn() {
  const result = await Swal.fire({
    title: 'Bạn chắc chắn?',
    text: 'Bạn có muốn duyệt yêu cầu trả hàng này?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Duyệt',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })

  if (!result.isConfirmed) return

  try {
    loading.value = true
    await approveReturnRequest(orderId.value)
    order.value.status = 6
    toast.success('Đã duyệt yêu cầu trả hàng')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Không thể duyệt yêu cầu trả hàng.')
  } finally {
    loading.value = false
  }
}

async function rejectReturn() {
  const result = await Swal.fire({
    title: 'Bạn chắc chắn?',
    text: 'Bạn có muốn từ chối yêu cầu trả hàng này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Từ chối',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  })

  if (!result.isConfirmed) return

  try {
    loading.value = true
    await rejectReturnRequest(orderId.value)
    order.value.status = 7
    toast.info('Đã từ chối yêu cầu trả hàng')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Không thể từ chối yêu cầu trả hàng.')
  } finally {
    loading.value = false
  }
}

async function syncGhnStatus() {
  try {
    loading.value = true
    await syncGhnStatusAPI(orderId.value)
    toast.success('Đồng bộ trạng thái GHN thành công')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Không thể đồng bộ trạng thái GHN.')
  } finally {
    loading.value = false
  }
}

async function exportToPDF() {
  try {
    await downloadInvoicePDF(orderId.value)
    toast.success('Tải hóa đơn PDF thành công')
  } catch (err) {
    let errorMessage = 'Không thể xuất hóa đơn PDF.'
    if (err.response) {
      try {
        const text = await err.response.data.text()
        errorMessage = text || errorMessage
      } catch {
        errorMessage = err.message || errorMessage
      }
    } else {
      errorMessage = err.message || errorMessage
    }
    console.error('Export PDF Error:', {
      message: err.message,
      code: err.code,
      response: err.response,
    })
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
}

async function printGhnLabel() {
  try {
    loading.value = true
    toast.success('In nhãn vận chuyển thành công')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Không thể in nhãn vận chuyển.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!isNaN(orderId.value)) fetchOrderData()
})

watch(
  () => orderId.value,
  (newVal) => {
    if (!isNaN(newVal)) fetchOrderData()
  },
)
</script>
