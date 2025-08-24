<script></script>
<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="/" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Tổng quan tài khoản</a
      >
    </nav>
  </div>

  <div class="container account-summary-container my-5">
    <div class="row">
      <div class="col-md-2 account-sidebar d-none d-md-block">
        <a href="#" class="active">Tổng quan tài khoản</a><br />
        <a href="/user/profile">Thông tin của tôi</a><br />
        <a href="/user/change-password">Đổi mật khẩu</a><br />
        <a href="/user/listaddress">Sổ địa chỉ</a><br />
        <a href="/user/review-history">Đánh giá của tôi</a><br />
        <a href="/user/order-management">Mua hàng & Trả hàng</a><br />
        <a href="/user/favorite">Danh sách yêu thích</a>
      </div>

      <div class="col-md-10">
        <h4 class="account-title text-center fw-bold mb-4">
          Tóm Tắt Tài Khoản Của Tôi (/ Tài Khoản)
        </h4>
        <div class="row g-4">
          <!-- Hồ sơ -->
          <div class="col-md-4">
            <div class="account-card text-center h-100">
              <h6 class="account-card-title">Thông tin của tôi</h6>
              <p class="account-card-desc">
                Quản lý thông tin hồ sơ, thông tin đăng nhập và sở thích đăng ký của bạn
              </p>
              <a href="/user/profile" class="account-card-link"
                >Chỉnh sửa hồ sơ của bạn</a
              >
            </div>
          </div>

          <!-- Đổi Mật Khẩu -->
          <div class="col-md-4">
            <div class="account-card text-center h-100">
              <h6 class="account-card-title">Đổi mật khẩu</h6>
              <p class="account-card-desc">
                Thay đổi mật khẩu đăng nhập của bạn để bảo vệ tài khoản an toàn hơn
              </p>
              <a href="/user/change-password" class="account-card-link"
                >Thay đổi mật khẩu</a
              >
            </div>
          </div>

          <!-- Sổ địa chỉ -->
          <div class="col-md-4">
            <div class="account-card text-center h-100">
              <h6 class="account-card-title">Sổ địa chỉ</h6>
              <p class="account-card-desc">
                Thêm và chỉnh sửa địa chỉ thanh toán và giao hàng của bạn
              </p>
              <a href="/user/listaddress" class="account-card-link"
                >Quản lý địa chỉ của bạn</a
              >
            </div>
          </div>

          <!-- Đánh giá của tôi -->
          <div class="col-md-4">
            <div class="account-card text-center h-100">
              <h6 class="account-card-title">Đánh giá của tôi</h6>
              <p class="account-card-desc">
                Xem và chỉnh sửa các đánh giá bạn đã gửi cho sản phẩm
              </p>
              <a href="/user/review-history" class="account-card-link"
                >Xem đánh giá của bạn</a
              >
            </div>
          </div>

          <!-- Mua hàng & Trả hàng -->
          <div class="col-md-4">
            <div class="account-card text-center h-100">
              <h6 class="account-card-title">Mua hàng & Trả hàng</h6>
              <p class="account-card-desc">
                Hãy theo dõi các đơn hàng mua sắm trực tuyến và xem số tiền hoàn của bạn
              </p>
              <a href="/user/order-management" class="account-card-link"
                >Xem lịch sử Mua hàng & Trả hàng của bạn</a
              >
            </div>
          </div>

          <!-- Danh sách yêu thích -->
          <div class="col-md-4">
            <div class="account-card text-center h-100">
              <h6 class="account-card-title">Danh sách yêu thích</h6>
              <p class="account-card-desc">
                Xem lại và quản lý các sản phẩm bạn đã thêm vào danh sách yêu thích
              </p>
              <a href="/user/favorite" class="account-card-link"
                >Xem danh sách yêu thích</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-sidebar a {
  display: inline-block;
  padding: 4px 0;
  font-size: 15px;
  color: #000;
  text-decoration: none;
}

.account-sidebar a:hover {
  text-decoration: underline;
  /* ✅ Gạch chân khi hover */
  color: #000;
}

.account-sidebar a.active {
  font-weight: 600;
  color: #000;
}

/* .account-summary-container {
  background-color: #fff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
} */

.account-title {
  font-weight: 700;
  color: #000;
}

.account-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  transition: box-shadow 0.3s ease-in-out;
  background-color: #fff;
}

.account-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.account-card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.account-card-desc {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.account-card-link {
  font-size: 14px;
  color: #000;
  text-decoration: underline;
}

.account-card-link:hover {
  text-decoration: none;
  color: #000;
}

@media (max-width: 768px) {
  .account-card {
    padding: 16px;
  }

  .account-card-title {
    font-size: 15px;
  }

  .account-card-desc,
  .account-card-link {
    font-size: 13px;
  }
}
</style>
