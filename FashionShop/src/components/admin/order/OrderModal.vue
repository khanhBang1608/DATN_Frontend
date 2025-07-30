<template>
  <div class="modal fade" :id="'orderModal' + orderId" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <form v-if="order" class="modal-content" @submit.prevent="saveOrder">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">➕ Chi tiết đơn hàng #{{ order.orderId }}</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body row g-3">
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
            <button @click="error = null" class="btn btn-sm btn-outline-danger">Đóng</button>
          </div>
          <div ref="invoiceContent" class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Mã đơn hàng</label>
              <input type="text" class="form-control" :value="order.orderId" disabled />
            </div>
            <div class="col-md-6">
              <label class="form-label">Tên người đặt</label>
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
              <label class="form-label">Tổng số tiền</label>
              <input
                type="text"
                class="form-control"
                :value="formatPrice(order.totalAmount)"
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
            <div class="col-12">
              <label class="form-label">Chi tiết sản phẩm</label>
              <ul class="list-group">
                <li
                  v-for="detail in order.orderDetails"
                  :key="detail.orderDetailId"
                  class="list-group-item"
                >
                  {{ detail.productName }} (Size: {{ detail.size }}, Màu: {{ detail.color }}) - Số
                  lượng: {{ detail.quantity }} - Giá: {{ formatPrice(detail.price) }}
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <label class="form-label">Phí vận chuyển</label>
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
                :value="order.paymentStatus === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'"
                disabled
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-primary" @click="exportToPDF">
            Xuất hóa đơn PDF
          </button>
          <button v-if="order.status === 4" class="btn btn-success" @click="approveReturn">
            Duyệt yêu cầu trả hàng
          </button>

          <button v-if="order.status === 4" class="btn btn-danger" @click="rejectReturn">
            Từ chối yêu cầu trả hàng
          </button>

          <button
            v-if="[0, 1, 2].includes(order.status)"
            class="btn btn-success"
            @click="updateStatusFlow"
          >
            Cập nhật trạng thái
          </button>

          <button v-if="order.status === 0" class="btn btn-danger" @click="cancelOrder">
            Hủy đơn
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="closeModal"
          >
            Đóng
          </button>
        </div>
      </form>
      <div v-else class="modal-content">
        <div class="modal-body text-center">
          <p v-if="loading">Đang tải chi tiết đơn hàng...</p>
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
            <button @click="error = null" class="btn btn-sm btn-outline-danger">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getOrderById,
  updateOrder,
  downloadInvoicePDF,
  approveReturnRequest,
  rejectReturnRequest,
} from '@/api/admin/orderAPI'
import { Modal } from 'bootstrap'
import { nextTick } from 'vue'

export default {
  name: 'OrderModal',
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      order: null,
      originalStatus: null,
      loading: false,
      error: null,
      modalInstance: null,
      statusOptions: [
        'Chờ xác nhận', // 0
        'Chờ lấy hàng', // 1
        'Chờ giao hàng', // 2
        'Đã giao',
        'Yêu cầu trả hàng',
        'Đã hủy',
        'Trả hàng đã duyệt',
        'Từ chối trả hàng',
      ],
    }
  },

  computed: {
    extractedPhone() {
      return this.order?.address?.split(' - ')[0] || 'Không xác định'
    },
    extractedAddress() {
      return this.order?.address?.split(' - ')[1] || this.order?.address || 'Không xác định'
    },
  },
  methods: {
    async approveReturn() {
      try {
        await approveReturnRequest(this.orderId)
        this.order.status = 6 // 'Trả hàng đã duyệt'
        this.$emit('order-updated')
        this.closeModal()
      } catch (error) {
        this.error = error || 'Không thể duyệt yêu cầu trả hàng.'
      }
    },

    async rejectReturn() {
      try {
        await rejectReturnRequest(this.orderId)
        this.order.status = 7 // 'Từ chối trả hàng'
        this.$emit('order-updated')
        this.closeModal()
      } catch (error) {
        this.error = error || 'Không thể từ chối yêu cầu trả hàng.'
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    },
    async fetchOrder() {
      this.loading = true
      this.error = null
      try {
        this.order = await getOrderById(this.orderId)
        this.originalStatus = this.order.status
        await nextTick()
        this.showModal()
      } catch (error) {
        this.error = 'Không thể tải chi tiết đơn hàng.'
      } finally {
        this.loading = false
      }
    },
    async saveOrder() {
      this.loading = true
      this.error = null
      try {
        const payload = {
          ...this.order,
          orderDetails: this.order.orderDetails || [],
        }
        await updateOrder(this.orderId, payload)
        this.$emit('order-updated')
        this.closeModal()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    updateStatusFlow() {
      const nextFlow = {
        0: 1,
        1: 2,
        2: 3,
      }
      const current = this.order.status
      const nextStatus = nextFlow[current]

      if (nextStatus === undefined) {
        this.error = 'Không thể cập nhật trạng thái ở bước hiện tại.'
        return
      }

      this.order.status = nextStatus
      this.saveOrder()
    },
    cancelOrder() {
      if (this.order.status !== 0) {
        this.error = 'Chỉ có thể hủy đơn hàng khi trạng thái là "Chờ xác nhận".'
        return
      }
      this.order.status = 5
      this.saveOrder()
    },
    showModal() {
      const modalElement = document.getElementById('orderModal' + this.orderId)
      if (modalElement) {
        if (this.modalInstance) {
          this.modalInstance.dispose?.()
        }
        this.modalInstance = new Modal(modalElement, {
          backdrop: 'static',
          keyboard: false,
        })
        this.modalInstance.show()
      }
    },
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide()
        setTimeout(() => {
          this.modalInstance.dispose?.()
          this.modalInstance = null
          document.body.classList.remove('modal-open')
          document.body.style.overflow = ''
        }, 300)
      }
      this.order = null
      this.$emit('close')
    },
    async exportToPDF() {
      this.loading = true
      try {
        await downloadInvoicePDF(this.orderId)
      } catch (error) {
        this.error = 'Không thể tải hóa đơn PDF. Vui lòng thử lại.'
      } finally {
        this.loading = false
      }
    },
  },
  watch: {
    orderId: {
      immediate: true,
      async handler(newId) {
        if (newId) {
          await this.fetchOrder()
        }
      },
    },
  },
}
</script>

<style scoped>
.modal-content {
  background-color: #f8f9fa;
}
.bg-primary {
  background-color: #3498db !important;
}
.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}
.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}
.btn-outline-primary {
  color: #3498db;
  border-color: #3498db;
}
.btn-outline-primary:hover {
  background-color: #3498db;
  color: #fff;
}
.list-group-item {
  background-color: #fff;
}
</style>
