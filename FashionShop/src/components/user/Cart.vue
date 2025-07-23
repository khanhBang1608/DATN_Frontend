<template>
  <div class="cart-container">
    <div class="custom-breadcrumb-wrapper">
      <nav class="custom-breadcrumb container">
        <router-link to="/" class="custom-breadcrumb-link">Trang chủ</router-link>
        <span class="custom-breadcrumb-separator">/</span>
        <span class="custom-breadcrumb-link custom-breadcrumb-current">
          Giỏ hàng ({{ cart.details.length }})
        </span>
      </nav>
    </div>
    <div class="container mt-3 cart-page">
      <!-- Tiêu đề -->
      <div class="text-center">
        <div class="cart-title">Giỏ Hàng Của Bạn</div>
        <div class="cart-subtitle">Có {{ cart.details.length }} sản phẩm trong giỏ hàng</div>
        <div class="cart-divider"></div>
      </div>

      <div class="row g-4">
        <!-- Cột trái: Danh sách sản phẩm -->
        <div class="col-md-8 cart-items">
          <div v-if="cart.details.length === 0" class="text-center">
            <p>Giỏ hàng trống</p>
          </div>
          <div v-for="item in cart.details" :key="item.cartDetailId" class="d-flex p-3 cart-item">
            <!-- Ảnh -->
            <div class="me-5 d-flex align-items-center">
              <input type="checkbox" :value="item.cartDetailId" v-model="selectedItems" style="transform: scale(1.5); width: 15px; height: 15px;"/>
            </div>

            <img
              :src="`http://localhost:8080/images/${item.imageUrl}`"
              :alt="item.productName"
              class="me-3 cart-item-img"
            />
            <!-- Thông tin -->
            <div class="flex-grow-1">
              <h5 class="mb-1">{{ item.productName }}</h5>
              <p class="mb-1">{{ formatPrice(item.price) }}</p>
              <p class="mb-1">Size: {{ item.size }}</p>
              <p class="mb-2">Màu: {{ item.color }}</p>

              <!-- Số lượng -->
              <div class="input-group w-auto cart-quantity">
                <button
                  class="btn btn-outline-secondary"
                  @click="updateQuantity(item.cartDetailId, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                >
                  -
                </button>
                <input
                  type="text"
                  class="form-control text-center"
                  v-model.number="item.quantity"
                  style="max-width: 60px"
                  readonly
                />
                <button
                  class="btn btn-outline-secondary"
                  @click="updateQuantity(item.cartDetailId, item.quantity + 1)"
                  :disabled="item.quantity >= item.stock"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Nút xóa -->
            <span class="cart-remove-btn" @click="removeItem(item.cartDetailId)"> × </span>
          </div>

          <!-- Nút xóa toàn bộ giỏ hàng -->
          <button v-if="cart.details.length > 0" class="btn btn-danger mt-3" @click="clearCart">
            Xóa toàn bộ giỏ hàng
          </button>

          <!-- Ghi chú -->
          <div class="mt-4 cart-note">
            <label for="note" class="form-label fw-bold">Ghi chú đơn hàng</label>
            <textarea
              class="form-control"
              id="note"
              rows="4"
              placeholder="Ghi chú"
              v-model="orderNote"
            ></textarea>
          </div>

          <!-- Chính sách -->
          <div class="mt-4 cart-policy">
            <h5 class="fw-bold">RETURN POLICY</h5>
            <ul class="list-unstyled">
              <li>→ HỖ TRỢ ĐỔI SIZE VÀ SẢN PHẨM LỖI TRONG 7 NGÀY</li>
              <li>→ LIÊN HỆ TRỰC TIẾP HOTLINE HOẶC FANPAGE ĐỂ ĐƯỢC HỖ TRỢ SHIP HỎA TỐC</li>
            </ul>
          </div>
        </div>

        <!-- Cột phải: Thông tin đơn hàng -->
        <div class="col-md-4 cart-summary">
          <div class="border p-4">
            <h5 class="fw-bold mb-3">Thông tin đơn hàng</h5>
            <div class="d-flex justify-content-between mb-3">
              <span>Tổng tiền:</span>
              <span class="cart-total-price">{{ formatPrice(totalPrice) }}</span>
            </div>
            <p class="text-muted mb-4" style="font-size: 14px">
              Phí vận chuyển sẽ được tính ở trang thanh toán.<br />
              Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.
            </p>
            <button
              class="btn cart-checkout-btn w-100 py-2"
              @click="proceedToCheckout"
              :disabled="cart.details.length === 0"
            >
              <span>THANH TOÁN</span>
            </button>

            <div class="text-center mt-3">
              <router-link to="/" class="cart-continue-link">
                <i class="bi bi-arrow-return-left custom-bold-icon"></i>
                <span>Tiếp tục mua hàng</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container mt-3 mb-3">
      <h4 class="text-center mt-4 fw-bold">SẢN PHẨM LIÊN QUAN</h4>
      <div v-if="loadingRelated" class="text-center">
        <p>Đang tải sản phẩm liên quan...</p>
      </div>
      <div v-else-if="relatedProducts.length === 0" class="text-center">
        <p>Không có sản phẩm liên quan</p>
      </div>
      <div v-else class="row g-3 mt-3">
        <div
          v-for="product in relatedProducts"
          :key="product.id"
          class="col-6 col-sm-6 col-md-4 col-lg-3"
        >
          <div class="product-link">
            <div class="product-item">
              <span class="discount-badge" v-if="product.discount">{{ product.discount }}%</span>
              <img :src="product.imageUrl" class="img-fluid img-default" :alt="product.name" />
              <img
                :src="product.imageHoverUrl"
                class="img-fluid img-hover"
                :alt="`${product.name} Hover`"
              />
            </div>
            <div class="product-name">{{ product.name }}</div>
            <div>
              <span class="discounted-price">{{ formatPrice(product.discountedPrice) }}</span>
              <span class="original-price" v-if="product.originalPrice">
                {{ formatPrice(product.originalPrice) }}
              </span>
            </div>
            <button class="btn btn-primary btn-sm mt-2" @click="addToCart(product.id, 1)">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getRelatedProducts,
} from '@/api/user/cartAPI'
import { useToast } from 'vue-toastification'

const toast = useToast()

export default {
  name: 'CartPage',
  data() {
    return {
      selectedItems: [],
      cart: {
        cartId: null,
        userId: null,
        details: [],
      },
      orderNote: '',
      relatedProducts: [],
      loading: false,
      loadingRelated: false,
      error: null,
    }
  },
  computed: {
    totalPrice() {
  return this.cart.details
    .filter(item => this.selectedItems.includes(item.cartDetailId))
    .reduce((total, item) => total + item.price * item.quantity, 0);
},

  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price)
    },
    async fetchCart() {
      this.error = null
      const toastId = toast.info('Đang tải giỏ hàng...', { timeout: false })
      try {
        const cartData = await getCart()
        this.cart = {
          ...cartData,
          details: cartData.details.map((item) => ({
            ...item,
            productName: item.productName || 'Sản phẩm',
            imageUrl: item.imageUrl || 'https://via.placeholder.com/100x140',
            size: item.size || 'S',
            color: item.color || 'Không xác định',
            stock: item.stock || 0,
          })),
        }
        toast.success('Tải giỏ hàng thành công!')
      } catch (error) {
        console.error('Error fetching cart:', error.message)
        toast.error('Không thể tải giỏ hàng. Vui lòng đăng nhập lại.')
        this.$router.push('/login')
      } finally {
        toast.dismiss(toastId)
      }
    },
    async fetchRelatedProducts() {
      this.loadingRelated = true
      try {
        this.relatedProducts = await getRelatedProducts()
      } catch (error) {
        console.error('Error fetching related products:', error.message)
        this.relatedProducts = []
      } finally {
        this.loadingRelated = false
      }
    },
    async addToCart(productVariantId, quantity) {
      this.loading = true
      this.error = null
      try {
        const cartData = await addToCart(productVariantId, quantity)
        this.cart = {
          ...cartData,
          details: cartData.details.map((item) => ({
            ...item,
            productName: item.productName || 'Sản phẩm',
            imageUrl: item.imageUrl || 'https://via.placeholder.com/100x140',
            size: item.size || 'S',
            color: item.color || 'Không xác định',
            stock: item.stock || 0,
          })),
        }
        toast.success('Thêm sản phẩm vào giỏ thành công!')
      } catch (error) {
        console.error('Error adding to cart:', error.message)
        toast.error('Thêm sản phẩm vào giỏ hàng thất bại.')
        this.error = 'Thêm sản phẩm vào giỏ hàng thất bại.'
      } finally {
        this.loading = false
      }
    },
    async updateQuantity(cartDetailId, quantity) {
      if (quantity < 1) return
      this.loading = true
      this.error = null
      try {
        const cartData = await updateCartItem(cartDetailId, quantity)
        this.cart = {
          ...cartData,
          details: cartData.details.map((item) => ({
            ...item,
            productName: item.productName || 'Sản phẩm',
            imageUrl: item.imageUrl || 'https://via.placeholder.com/100x140',
            size: item.size || 'S',
            color: item.color || 'Không xác định',
            stock: item.stock || 0,
          })),
        }
        toast.success('Cập nhật số lượng thành công!')
      } catch (error) {
        console.error('Error updating quantity:', error.message)
        toast.error('Cập nhật số lượng thất bại.')
        this.error = 'Cập nhật số lượng thất bại.'
      } finally {
        this.loading = false
      }
    },
    async removeItem(cartDetailId) {
      this.loading = true
      this.error = null
      try {
        const cartData = await removeCartItem(cartDetailId)
        this.cart = {
          ...cartData,
          details: cartData.details.map((item) => ({
            ...item,
            productName: item.productName || 'Sản phẩm',
            imageUrl: item.imageUrl || 'https://via.placeholder.com/100x140',
            size: item.size || 'S',
            color: item.color || 'Không xác định',
            stock: item.stock || 0,
          })),
        }
        toast.success('Xóa sản phẩm thành công!')
      } catch (error) {
        console.error('Error removing item:', error.message)
        toast.error('Xóa sản phẩm thất bại.')
        this.error = 'Xóa sản phẩm thất bại.'
      } finally {
        this.loading = false
      }
    },
    async clearCart() {
      this.loading = true
      this.error = null
      try {
        const cartData = await clearCart()
        this.cart = {
          ...cartData,
          details: cartData.details.map((item) => ({
            ...item,
            productName: item.productName || 'Sản phẩm',
            imageUrl: item.imageUrl || 'https://via.placeholder.com/100x140',
            size: item.size || 'S',
            color: item.color || 'Không xác định',
            stock: item.stock || 0,
          })),
        }
        toast.success('Xóa giỏ hàng thành công!')
      } catch (error) {
        console.error('Error clearing cart:', error.message)
        toast.error('Xóa giỏ hàng thất bại.')
        this.error = 'Xóa giỏ hàng thất bại.'
      } finally {
        this.loading = false
      }
    },
    proceedToCheckout() {
      const selectedDetails = this.cart.details.filter((item) =>
        this.selectedItems.includes(item.cartDetailId),
      )

      if (selectedDetails.length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.')
        return
      }

      localStorage.setItem('orderNote', this.orderNote)
      localStorage.setItem('cartDetails', JSON.stringify(selectedDetails))
      this.$router.push('/user/checkout')
    },
  },
  mounted() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/login')
    } else {
      this.fetchCart()
      this.fetchRelatedProducts()
    }
  },
}
</script>

<style src="@/assets/css/cart.css"></style>
