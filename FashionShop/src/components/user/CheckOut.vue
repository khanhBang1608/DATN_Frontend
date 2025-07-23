
<script>
import { createOrder } from '@/api/user/orderAPI'
import { clearCart } from '@/api/user/cartAPI'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const toast = useToast()

export default {
  data() {
    return {
      provinces: [],
      districts: [],
      wards: [],
      cartDetails: [],
      form: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        country: 'Vietnam',
        city: '',
        district: '',
        ward: '',
      },

      paymentMethod: 'COD',
      discountCode: '',
      discountAmount: 0,
      discountError: '',
      shippingFee: 10000,
      isMobileOrderVisible: false,
      loading: false,
    }
  },
  watch: {
    'form.city'(provinceName) {
      const selectedProvince = this.provinces.find((p) => p.name === provinceName)
      if (selectedProvince) {
        axios
          .get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
          .then((res) => {
            this.districts = res.data.districts
            this.form.district = ''
            this.wards = []
            this.form.ward = ''
          })
      }
    },
    'form.district'(districtName) {
      const selectedDistrict = this.districts.find((d) => d.name === districtName)
      if (selectedDistrict) {
        axios
          .get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
          .then((res) => {
            this.wards = res.data.wards
            this.form.ward = ''
          })
      }
    },
  },
  computed: {
    subtotal() {
      return this.cartDetails.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    total() {
      return this.subtotal + this.shippingFee - this.discountAmount
    },
    toggleIcon() {
      return this.isMobileOrderVisible ? 'bi-chevron-up' : 'bi-chevron-down'
    },
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price)
    },
    toggleOrderCollapse() {
      this.isMobileOrderVisible = !this.isMobileOrderVisible
    },
    async applyDiscount() {
      this.discountError = ''
      // Giả định mã giảm giá được kiểm tra trong API createOrder
      // Nếu cần API riêng để kiểm tra discount, có thể thêm vào orderAPI.js
    },
    async placeOrder() {
      if (this.cartDetails.length === 0) {
        toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm.')
        return
      }
      this.loading = true
      try {
        const orderData = {
          address: `${this.form.address}, ${this.form.ward}, ${this.form.district}, ${this.form.city}, ${this.form.country}`,
          paymentMethod: this.paymentMethod,
          discountCode: this.discountCode || null,
          orderDetails: this.cartDetails.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
          })),
        }
        const response = await createOrder(orderData)
        await clearCart() // Xóa giỏ hàng sau khi đặt hàng thành công
        toast.success(`Đặt hàng thành công! Mã đơn hàng: #${response.orderId}`)
        this.$router.push('/user/order-management')
      } catch (error) {
        toast.error(error || 'Đặt hàng thất bại. Vui lòng thử lại.')
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    axios.get('https://provinces.open-api.vn/api/p/').then((res) => {
      this.provinces = res.data
    })
    if (!localStorage.getItem('token')) {
      toast.error('Vui lòng đăng nhập để tiếp tục.')
      this.$router.push('/login')
    } else {
      const cartDetails = localStorage.getItem('cartDetails')
      if (cartDetails) {
        this.cartDetails = JSON.parse(cartDetails)
      } else {
        toast.error('Không tìm thấy thông tin giỏ hàng.')
        this.$router.push('/user/cart')
      }
    }
  },
}
</script>

<template>
  <div class="checkout-container container">
    <div class="row g-0">
      <!-- Thông tin đơn hàng mobile -->
      <div class="col-md-5 bg-light px-4 py-3 d-md-none">
        <div class="checkout-sidebar">
          <div
            class="checkout-toggle mb-3 d-flex justify-content-between align-items-center"
            @click="toggleOrderCollapse"
          >
            <button
              class="btn btn-link w-100 p-0 text-decoration-none text-dark d-flex justify-content-between align-items-center"
            >
              <span><i class="bi bi-cart"></i> Hiển thị thông tin đơn hàng</span>
              <i :class="toggleIcon"></i>
            </button>
          </div>

          <!-- Mã giảm giá -->
          <div class="checkout-discount mb-3">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Mã giảm giá"
                v-model="discountCode"
              />
              <button class="btn btn-secondary" @click="applyDiscount">Sử dụng</button>
            </div>
            <div v-if="discountError" class="text-danger mt-2">{{ discountError }}</div>
          </div>

          <!-- Collapse đơn hàng -->
          <div
            id="orderCollapse"
            class="collapse checkout-summary rounded"
            :class="{ show: isMobileOrderVisible }"
          >
            <div
              v-for="item in cartDetails"
              :key="item.cartDetailId"
              class="checkout-product d-flex align-items-center mb-3"
            >
              <img
                :src="`http://localhost:8080/images/${item.imageUrl}`"
                :alt="item.productName"
                width="40"
                height="40"
                class="me-3 rounded"
              />
              <div class="flex-grow-1">
                <p class="mb-0 fw-bold">{{ item.productName }}</p>
                <small
                  >Size: {{ item.size }} | Màu: {{ item.color }} | Số lượng:
                  {{ item.quantity }}</small
                >
              </div>
              <div class="ms-auto fw-bold">{{ formatPrice(item.price * item.quantity) }}</div>
            </div>

            <div class="checkout-subtotal d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="checkout-shipping-fee d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>{{ formatPrice(shippingFee) }}</span>
            </div>
            <div
              class="checkout-discount-amount d-flex justify-content-between mb-2"
              v-if="discountAmount > 0"
            >
              <span>Giảm giá</span>
              <span>-{{ formatPrice(discountAmount) }}</span>
            </div>
            <hr />
            <div class="checkout-total d-flex justify-content-between fw-bold fs-5">
              <span>Tổng cộng</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form điền thông tin -->
      <div class="col-md-7 border-end bg-white px-4 py-3">
        <div class="checkout-form-container">
          <nav class="checkout-breadcrumb mb-3">
            <router-link to="/cart" class="text-muted text-decoration-none">Giỏ hàng</router-link> >
            <span class="text-muted">Thông tin giao hàng</span>
          </nav>

          <div class="checkout-header">
            <h2>Thông tin giao hàng</h2>
            <p>Bạn đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
          </div>

          <form class="checkout-form" @submit.prevent="placeOrder">
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Họ và tên"
                v-model="form.fullName"
                required
              />
            </div>
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <input
                  type="email"
                  class="form-control"
                  placeholder="Email"
                  v-model="form.email"
                  required
                />
              </div>
              <div class="col-md-6">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Số điện thoại"
                  v-model="form.phone"
                  required
                />
              </div>
            </div>
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Địa chỉ"
                v-model="form.address"
                required
              />
            </div>
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <select class="form-select" v-model="form.country" required>
                  <option value="Vietnam">Vietnam</option>
                </select>
              </div>
              <div class="col-md-6">
                <select class="form-select" v-model="form.city" required>
                  <option value="" disabled>Chọn tỉnh / thành</option>
                  <option v-for="province in provinces" :key="province.code" :value="province.name">
                    {{ province.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <select
                  class="form-select"
                  v-model="form.district"
                  :disabled="!districts.length"
                  required
                >
                  <option value="" disabled>Chọn quận / huyện</option>
                  <option v-for="district in districts" :key="district.code" :value="district.name">
                    {{ district.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <select class="form-select" v-model="form.ward" :disabled="!wards.length" required>
                  <option value="" disabled>Chọn phường / xã</option>
                  <option v-for="ward in wards" :key="ward.code" :value="ward.name">
                    {{ ward.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Phương thức vận chuyển -->
            <div class="checkout-section-title">Phương thức vận chuyển</div>
            <div class="checkout-shipping-method mb-4 text-center">
              <i class="bi bi-box" style="font-size: 32px"></i>
              <p class="mt-2">Phí vận chuyển: {{ formatPrice(shippingFee) }}</p>
            </div>

            <!-- Phương thức thanh toán -->
            <div class="checkout-section-title">Phương thức thanh toán</div>
            <div class="checkout-payment-methods my-4">
              <div class="card border-0 shadow-none bg-transparent">
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <label class="list-group-item border-0 d-flex align-items-center gap-3">
                      <input
                        class="form-check-input mt-0"
                        type="radio"
                        name="payment"
                        value="COD"
                        v-model="paymentMethod"
                      />
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/484/484167.png"
                        alt="COD"
                        width="24"
                      />
                      <span class="fw-medium">Thanh toán khi giao hàng (COD)</span>
                    </label>
                    <label class="list-group-item border-0 d-flex align-items-center gap-3">
                      <input
                        class="form-check-input mt-0"
                        type="radio"
                        name="payment"
                        value="VNPAY"
                        v-model="paymentMethod"
                      />
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/196/196565.png"
                        alt="VNPay"
                        width="24"
                      />
                      <span class="fw-medium">Ví VNPay</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="checkout-actions d-flex justify-content-between align-items-center gap-3">
              <router-link to="/cart" class="link-cart text-center">Giỏ hàng</router-link>
              <button type="submit" class="btn btn-complete" :disabled="loading">
                {{ loading ? 'Đang xử lý...' : 'Hoàn tất đơn hàng' }}
              </button>
            </div>
          </form>

          <footer class="checkout-footer text-center text-muted mt-5 small fw-light">
            <hr class="mb-3" />
            Powered by Haravan
          </footer>
        </div>
      </div>

      <!-- Thông tin đơn hàng desktop -->
      <div class="col-md-5 bg-light px-4 py-3">
        <div class="checkout-sidebar">
          <div class="checkout-summary d-none d-md-block mt-5 p-4 rounded">
            <div
              v-for="item in cartDetails"
              :key="item.cartDetailId"
              class="checkout-product d-flex align-items-center mb-3"
            >
              <img
                :src="`http://localhost:8080/images/${item.imageUrl}`"
                :alt="item.productName"
                width="80"
                height="90"
                class="me-3 rounded"
              />
              <div class="flex-grow-1">
                <p class="mb-0 fw-bold">{{ item.productName }}</p>
                <small
                  >Size: {{ item.size }} | Màu: {{ item.color }} | Số lượng:
                  {{ item.quantity }}</small
                >
              </div>
              <div class="ms-auto fw-bold">{{ formatPrice(item.price * item.quantity) }}</div>
            </div>

            <div class="checkout-discount mb-3">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Mã giảm giá"
                  v-model="discountCode"
                />
                <button class="btn btn-secondary" @click="applyDiscount">Sử dụng</button>
              </div>
              <div v-if="discountError" class="text-danger mt-2">{{ discountError }}</div>
            </div>

            <div class="checkout-subtotal d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="checkout-shipping-fee d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>{{ formatPrice(shippingFee) }}</span>
            </div>
            <div
              class="checkout-discount-amount d-flex justify-content-between mb-2"
              v-if="discountAmount > 0"
            >
              <span>Giảm giá</span>
              <span>-{{ formatPrice(discountAmount) }}</span>
            </div>
            <hr />
            <div class="checkout-total d-flex justify-content-between fw-bold fs-5">
              <span>Tổng cộng</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/checkout.css"></style>
