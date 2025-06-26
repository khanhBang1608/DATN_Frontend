<template>
  <div class="cart-container">
    <div class="custom-breadcrumb-wrapper">
      <nav class="custom-breadcrumb container">
        <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
        <span class="custom-breadcrumb-separator">/</span>
        <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
          >Giỏ hàng (1)</a
        >
      </nav>
    </div>
    <div class="container mt-3 cart-page">
      <!-- Tiêu đề -->
      <div class="text-center">
        <div class="cart-title">Giỏ Hàng Của Bạn</div>
        <div class="cart-subtitle">Có 1 sản phẩm trong giỏ hàng</div>
        <div class="cart-divider"></div>
      </div>

      <div class="row g-4">
        <!-- Cột trái: Danh sách sản phẩm -->
        <div class="col-md-8 cart-items">
          <div class="d-flex p-3 cart-item">
            <!-- Ảnh -->
            <img
              src="https://via.placeholder.com/100x140"
              alt="Sản phẩm"
              class="me-3 cart-item-img"
            />

            <!-- Thông tin -->
            <div class="flex-grow-1">
              <h5 class="mb-1">AA FLAG LOGO SWEATPANTS // BLACK</h5>
              <p class="mb-1">760,000₫</p>
              <p class="mb-2">Size: S</p>

              <!-- Số lượng -->
              <div class="input-group w-auto cart-quantity">
                <button class="btn btn-outline-secondary">-</button>
                <input
                  type="text"
                  class="form-control text-center"
                  value="1"
                  style="max-width: 60px"
                />
                <button class="btn btn-outline-secondary">+</button>
              </div>
            </div>

            <!-- Nút xóa -->
            <span class="cart-remove-btn">&times;</span>
          </div>

          <!-- Ghi chú -->
          <div class="mt-4 cart-note">
            <label for="note" class="form-label fw-bold">Ghi chú đơn hàng</label>
            <textarea
              class="form-control"
              id="note"
              rows="4"
              placeholder="Ghi chú"
            ></textarea>
          </div>

          <!-- Chính sách -->
          <div class="mt-4 cart-policy">
            <h5 class="fw-bold">RETURN POLICY</h5>
            <ul class="list-unstyled">
              <li>→ HỖ TRỢ ĐỔI SIZE VÀ SẢN PHẨM LỖI TRONG 7 NGÀY</li>
              <li>
                → LIÊN HỆ TRỰC TIẾP HOTLINE HOẶC FANPAGE ĐỂ ĐƯỢC HỖ TRỢ SHIP HỎA TỐC
              </li>
            </ul>
          </div>
        </div>

        <!-- Cột phải: Thông tin đơn hàng -->
        <div class="col-md-4 cart-summary">
          <div class="border p-4">
            <h5 class="fw-bold mb-3">Thông tin đơn hàng</h5>
            <div class="d-flex justify-content-between mb-3">
              <span>Tổng tiền:</span>
              <span class="cart-total-price">760,000₫</span>
            </div>
            <p class="text-muted mb-4" style="font-size: 14px">
              Phí vận chuyển sẽ được tính ở trang thanh toán.<br />
              Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.
            </p>
            <button class="btn cart-checkout-btn w-100 py-2">
              <span>THANH TOÁN</span>
            </button>

            <div class="text-center mt-3">
              <a href="#" class="cart-continue-link">
                <i class="bi bi-arrow-return-left custom-bold-icon"></i>
                <span>Tiếp tục mua hàng</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mt-3 mb-3">
    <h4 class="text-center mt-4 fw-bold">SẢN PHẦM LIÊN QUAN</h4>
    <div class="row g-3 mt-3">
      <!-- Sản phẩm 1 -->
      <div class="col-6 col-sm-6 col-md-4 col-lg-3">
        <a href="#" class="product-link">
          <div class="product-item">
            <span class="discount-badge">-25%</span>
            <img
              src="@/assets/img/slideshow_1.png"
              class="img-fluid img-default"
              alt="Quần Dài Wash Xám"
            />
            <img
              src="@/assets/img/slideshow_1.png"
              class="img-fluid img-hover"
              alt="Quần Dài Wash Xám Hover"
            />
          </div>
          <div class="product-name">TSUN Quần Dài Rộng Ống Suông Wash Xám</div>
          <div>
            <span class="discounted-price">630,000₫</span>
            <span class="original-price">840,000₫</span>
          </div>
        </a>
      </div>
      <div class="col-6 col-sm-6 col-md-4 col-lg-3">
        <a href="#" class="product-link">
          <div class="product-item">
            <span class="discount-badge">-25%</span>
            <img
              src="@/assets/img/slideshow_1.png"
              class="img-fluid img-default"
              alt="Quần Dài Wash Xám"
            />
            <img
              src="@/assets/img/slideshow_1.png"
              class="img-fluid img-hover"
              alt="Quần Dài Wash Xám Hover"
            />
          </div>
          <div class="product-name">TSUN Quần Dài Rộng Ống Suông Wash Xám</div>
          <div>
            <span class="discounted-price">630,000₫</span>
            <span class="original-price">840,000₫</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/cart.css"></style>
