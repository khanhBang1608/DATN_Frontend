<script>
import { createOrder } from '@/api/user/orderAPI'
import { clearCart } from '@/api/user/cartAPI'
import { useToast } from 'vue-toastification'
import { getDiscount } from '@/api/user/discountAPI'
import axios from 'axios'

const toast = useToast()

export default {
  data() {
    return {
      // Địa chỉ hành chính
      provinces: [],
      districts: [],
      wards: [],
      addressList: [],
      selectedAddressId: '',

      // Form người dùng
      form: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        country: 'Vietnam',
        city: '',
        district: '',
        ward: '',
        province: '',
      },

      cartDetails: [],
      paymentMethod: 'COD',
      shippingFee: 10000,
      isMobileOrderVisible: false,
      loading: false,

      // Giảm giá
      discountList: [],
      selectedDiscount: null,
      discountCode: '',
      discountAmount: 0,
      discountError: '',
    }
  },

  watch: {
    'form.province'(provinceName) {
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

    applyDiscount() {
      this.discountAmount = 0
      this.discountCode = ''
      this.discountError = ''

      const discount = this.selectedDiscount
      if (!discount) return

      if (this.subtotal < (discount.minOrderAmount || 0)) {
        this.discountError = `Cần mua tối thiểu ${this.formatPrice(
          discount.minOrderAmount,
        )} để dùng mã này.`
        return
      }

      const percentDiscount = (this.subtotal * discount.discountPercent) / 100
      const maxDiscount = discount.maxDiscountAmount || percentDiscount
      this.discountAmount = Math.min(percentDiscount, maxDiscount)
      this.discountCode = discount.discountCode

      toast.success(`Áp dụng mã ${this.discountCode} thành công!`)
    },

    async placeOrder() {
      if (this.cartDetails.length === 0) {
        toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm.')
        return
      }

      this.loading = true

      try {
        const fullAddress = `${this.form.phone} - ${this.form.address}, ${this.form.ward}, ${this.form.district}, ${this.form.province}, ${this.form.country}`

        const orderData = {
          address: fullAddress,
          paymentMethod: this.paymentMethod,
          discountCode: this.discountCode || null,
          discountAmount: this.discountAmount || 0,
          orderDetails: this.cartDetails.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.discountedPrice || item.price,
          })),
        }

        if (this.paymentMethod === 'COD') {
          const response = await createOrder(orderData)
          await clearCart()

          toast.success(`Đặt hàng thành công! Mã đơn hàng: #${response.orderId}`)
          this.$router.push('/user/order-management')
        } else if (this.paymentMethod === 'VNPAY') {
          const total = this.total
          const tempOrderData = {
            address: fullAddress,
            email: this.form.email || 'default@example.com', // Ensure email is included
            paymentMethod: this.paymentMethod,
            paymentStatus: 1,
            discountCode: this.discountCode || null,
            discountAmount: this.discountAmount || 0,
            orderDetails: this.cartDetails.map((item) => ({
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              price: item.discountedPrice || item.price,
            })),
          }

          // Save to localStorage
          localStorage.setItem('pendingOrder', JSON.stringify(tempOrderData))

          // Lưu email vào orderInfo
          const orderInfo = `email=${encodeURIComponent(tempOrderData.email)}`
          const res = await axios.get('/api/user/payment/create', {
            params: { total, orderInfo },
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          })
          window.location.href = res.data.paymentUrl
        }
      } catch (error) {
        console.error(error)
        toast.error('Có lỗi xảy ra khi đặt hàng.')
      } finally {
        this.loading = false
      }
    },

    async fetchAddresses() {
      try {
        const res = await axios.get('/api/user/address/list', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        this.addressList = res.data

        if (this.addressList.length === 0) {
          this.$toast.warning('Bạn chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ trước.')
          this.$router.push('/user/address')
        }
      } catch (err) {
        console.error('Lỗi khi lấy địa chỉ:', err)
      }
    },

    onSelectAddress() {
      const selected = this.addressList.find((a) => a.addressId === this.selectedAddressId)
      if (!selected) return

      this.form.fullName = selected.customerName
      this.form.phone = selected.phone
      this.form.address = selected.address
      this.form.province = selected.provinceName
      this.form.district = selected.districtName
      this.form.ward = selected.wardName
    },
  },
  mounted() {
    axios.get('https://provinces.open-api.vn/api/p/').then((res) => {
      this.provinces = res.data
    })

    getDiscount()
      .then((res) => {
        this.discountList = res
      })
      .catch(() => {
        this.discountError = 'Không thể tải mã giảm giá.'
      })

    this.fetchAddresses()

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

      // Fetch user email from profile API
      axios
        .get('/api/user/profile', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((res) => {
          this.form.email = res.data.email || ''
        })
        .catch((err) => {
          console.error('Lỗi khi lấy thông tin người dùng:', err)
          toast.error('Không thể lấy thông tin người dùng.')
        })
    }
  },
}
</script>

<!-- Template giữ nguyên -->
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
              <div class="ms-auto fw-bold">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
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

      <!-- Form thông tin giao hàng -->
      <div class="col-md-7 border-end bg-white px-4 py-3">
        <div class="checkout-form-container">
          <nav class="checkout-breadcrumb mb-3">
            <router-link to="/cart" class="text-muted text-decoration-none">Giỏ hàng</router-link>
            >
            <span class="text-muted">Thông tin giao hàng</span>
          </nav>

          <div class="checkout-header">
            <h2>Thông tin giao hàng</h2>
            <p>Bạn đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
          </div>

          <form class="checkout-form" @submit.prevent="placeOrder">
            <!-- Dropdown địa chỉ -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Chọn địa chỉ giao hàng:</label>
              <select v-model="selectedAddressId" @change="onSelectAddress" class="form-select">
                <option disabled value="">-- Chọn địa chỉ đã lưu --</option>
                <option
                  v-for="address in addressList"
                  :key="address.addressId"
                  :value="address.addressId"
                >
                  {{ address.customerName }} - {{ address.fullAddress || address.address }} -
                  {{ address.phone }}
                </option>
              </select>

              <!-- Nút thêm địa chỉ -->
              <div class="mt-2">
                <router-link to="/user/address" class="btn btn-outline-primary btn-sm">
                  ➕ Thêm địa chỉ mới
                </router-link>
              </div>
            </div>

            <!-- Input tên, SĐT, địa chỉ -->
            <div class="mb-3">
              <h5>Họ tên người nhận :</h5>
              <input
                type="text"
                class="form-control"
                placeholder="Họ tên người nhận"
                v-model="form.fullName"
                required
              />
            </div>
            <div class="mb-3">
              <h5>Số điện thoại :</h5>
              <input
                type="text"
                class="form-control"
                placeholder="Số điện thoại"
                v-model="form.phone"
                required
              />
            </div>
            <div class="mb-3">
              <h5>Địa chỉ chi tiết :</h5>
              <input
                type="text"
                class="form-control"
                placeholder="Địa chỉ chi tiết"
                v-model="form.address"
                required
              />
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
              <div class="list-group">
                <label class="list-group-item d-flex align-items-center gap-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="COD"
                    v-model="paymentMethod"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/484/484167.png"
                    alt="COD"
                    width="24"
                  />
                  <span>Thanh toán khi giao hàng (COD)</span>
                </label>
                <label class="list-group-item d-flex align-items-center gap-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="VNPAY"
                    v-model="paymentMethod"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/196/196565.png"
                    alt="VNPAY"
                    width="24"
                  />
                  <span>Ví VNPAY</span>
                </label>
              </div>
            </div>

            <!-- Nút hoàn tất -->
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
              <div class="ms-auto fw-bold">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Mã giảm giá:</label>
              <select class="form-select" v-model="selectedDiscount" @change="applyDiscount">
                <option
                  v-for="d in discountList"
                  :key="d.discountId"
                  :value="d"
                  :disabled="d.quantityLimit === 0"
                >
                  {{ d.discountCode }} - Giảm {{ d.discountPercent }}% (Tối đa
                  {{ formatPrice(d.maxDiscountAmount || 0) }}) - Số lượng:
                  {{ d.quantityLimit === 0 ? '0' : d.quantityLimit }}
                </option>
              </select>

              <div v-if="discountError" class="text-danger mt-1">{{ discountError }}</div>
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
