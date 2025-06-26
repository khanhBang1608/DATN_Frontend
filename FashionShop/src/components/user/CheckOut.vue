<script>
export default {
  data() {
    return {
      paymentMethod: "cod",
      isMobileOrderVisible: false,
    };
  },
  computed: {
    isBankPayment() {
      return this.paymentMethod === "bank";
    },
    toggleIcon() {
      return this.isMobileOrderVisible ? "bi-chevron-up" : "bi-chevron-down";
    },
  },
  methods: {
    toggleOrderCollapse() {
      this.isMobileOrderVisible = !this.isMobileOrderVisible;
    },
    setPaymentMethod(method) {
      this.paymentMethod = method;
    },
  },
};
</script>
<template>
  <div class="checkout-container container">
    <div class="row g-0">
      <!-- Thông tin đơn hàng mobile -->
      <div class="col-md-5 bg-light px-4 py-3 d-md-none">
        <div class="checkout-sidebar">
          <div
            class="checkout-toggle mb-3 d-flex justify-content-between align-items-center"
          >
            <button
              class="btn btn-link w-100 p-0 text-decoration-none text-dark d-flex justify-content-between align-items-center"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#orderCollapse"
            >
              <span><i class="bi bi-cart"></i> Hiển thị thông tin đơn hàng</span>
              <i class="bi bi-chevron-down ms-2"></i>
            </button>
          </div>

          <!-- Mã giảm giá -->
          <div class="checkout-discount mb-3">
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Mã giảm giá" />
              <button class="btn btn-secondary">Sử dụng</button>
            </div>
            <div class="discount-more-links mt-2 mb-2">
              <a href="#" class="text-primary text-decoration-none">
                <i class="bi bi-ticket-perforated"></i> Xem thêm mã giảm giá
              </a>
            </div>
            <div class="discount-suggestions mt-2">
              <a href="#" class="btn btn-outline-primary btn-sm me-2">Giảm Ship 100%</a>
              <a href="#" class="btn btn-outline-primary btn-sm">Giảm Ship 35,000đ</a>
            </div>
          </div>

          <!-- Collapse đơn hàng -->
          <div id="orderCollapse" class="collapse checkout-summary rounded">
            <div class="checkout-product d-flex align-items-center mb-3">
              <img
                src="@/assets/img/slideshow_1.png"
                alt="SP"
                width="40"
                height="40"
                class="me-3 rounded"
              />
              <div class="flex-grow-1">
                <p class="mb-0 fw-bold">AA FLAG LOGO SWEATPANTS // BLACK</p>
                <small>S</small>
              </div>
              <div class="ms-auto fw-bold">760,000đ</div>
            </div>

            <div class="checkout-subtotal d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>760,000đ</span>
            </div>
            <div class="checkout-shipping-fee d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>—</span>
            </div>
            <hr />
            <div class="checkout-total d-flex justify-content-between fw-bold fs-5">
              <span>Tổng cộng</span>
              <span>760,000đ</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form điền thông tin -->
      <div class="col-md-7 border-end bg-white px-4 py-3">
        <div class="checkout-form-container">
          <div class="checkout-logo mt-5 mb-4">
            <img src="@/assets/img/logo-brand.png" alt="AASTU Logo" style="height: 48px" />
          </div>
          <nav class="checkout-breadcrumb mb-3">
            <a href="#" class="text-muted text-decoration-none">Giỏ hàng</a> &gt;
            <span class="text-muted">Thông tin giao hàng</span>
          </nav>

          <div class="checkout-header">
            <h2>Thông tin giao hàng</h2>
            <p>Bạn đã có tài khoản? <a href="#">Đăng nhập</a></p>
          </div>

          <form class="checkout-form">
            <div class="mb-3">
              <input type="text" class="form-control" placeholder="Họ và tên" />
            </div>
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <input type="email" class="form-control" placeholder="Email" />
              </div>
              <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Số điện thoại" />
              </div>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" placeholder="Địa chỉ" />
            </div>
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <select class="form-select">
                  <option selected>Vietnam</option>
                </select>
              </div>
              <div class="col-md-6">
                <select class="form-select">
                  <option selected>Chọn tỉnh / thành</option>
                </select>
              </div>
            </div>
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <select class="form-select">
                  <option selected>Chọn quận / huyện</option>
                </select>
              </div>
              <div class="col-md-6">
                <select class="form-select">
                  <option selected>Chọn phường / xã</option>
                </select>
              </div>
            </div>

            <!-- Phương thức vận chuyển -->
            <div class="checkout-section-title">Phương thức vận chuyển</div>
            <div class="checkout-shipping-method mb-4 text-center">
              <i class="bi bi-box" style="font-size: 32px"></i>
              <p class="mt-2">
                Vui lòng chọn tỉnh / thành để có danh sách phương thức vận chuyển.
              </p>
            </div>

            <!-- Phương thức thanh toán -->
            <div class="checkout-section-title">Phương thức thanh toán</div>
            <div class="checkout-payment-methods my-4">
              <div class="card border-0 shadow-none bg-transparent">
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <label
                      class="list-group-item border-0 d-flex align-items-center gap-3"
                    >
                      <input
                        class="form-check-input mt-0"
                        type="radio"
                        name="payment"
                        id="cod"
                        checked
                      />
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/484/484167.png"
                        alt="COD"
                        width="24"
                      />
                      <span class="fw-medium">Thanh toán khi giao hàng (COD)</span>
                    </label>
                    <label
                      class="list-group-item border-0 d-flex align-items-center gap-3"
                    >
                      <input
                        class="form-check-input mt-0"
                        type="radio"
                        name="payment"
                        id="paypal"
                      />
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/196/196565.png"
                        alt="Paypal"
                        width="24"
                      />
                      <span class="fw-medium">Ví VNPay</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="checkout-actions d-flex justify-content-between align-items-center gap-3"
            >
              <a href="#" class="link-cart text-center">Giỏ hàng</a>
              <button type="submit" class="btn btn-complete">Hoàn tất đơn hàng</button>
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
            <div class="checkout-product d-flex align-items-center mb-3">
              <img
                src="@/assets/img/slideshow_1.png"
                alt="SP"
                width="80"
                height="90"
                class="me-3 rounded"
              />
              <div class="flex-grow-1">
                <p class="mb-0 fw-bold">AA FLAG LOGO SWEATPANTS // BLACK</p>
                <small>S</small>
              </div>
              <div class="ms-auto fw-bold">760,000đ</div>
            </div>

            <div class="checkout-discount mb-3">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Mã giảm giá" />
                <button class="btn btn-secondary">Sử dụng</button>
              </div>
              <div class="discount-more-links mt-2 mb-2">
                <a href="#" class="text-primary text-decoration-none">
                  <i class="bi bi-ticket-perforated"></i> Xem thêm mã giảm giá
                </a>
              </div>
              <div class="discount-suggestions mt-2">
                <a href="#" class="btn btn-outline-primary btn-sm me-2">Giảm Ship 100%</a>
                <a href="#" class="btn btn-outline-primary btn-sm">Giảm Ship 35,000đ</a>
              </div>
            </div>

            <div class="checkout-subtotal d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>760,000đ</span>
            </div>
            <div class="checkout-shipping-fee d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>—</span>
            </div>
            <hr />
            <div class="checkout-total d-flex justify-content-between fw-bold fs-5">
              <span>Tổng cộng</span>
              <span>760,000đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/checkout.css"></style>
