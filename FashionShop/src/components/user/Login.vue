<template>
  <div class="auth-container mt-3">
    <h2 class="auth-title">Đăng Nhập / Tạo Tài Khoản</h2>
    <div class="row g-4 mt-2 mb-3">
      <!-- Đăng nhập -->
      <div class="col-md-6">
        <div class="auth-section auth-login">
          <h3 class="auth-heading">Đăng Nhập</h3>
          <p class="auth-description">
            Đăng nhập để có thể thanh toán nhanh hơn và tận hưởng các đặc quyền thành viên
          </p>
          <form>
            <input
              type="email"
              class="form-control auth-input"
              placeholder="Địa chỉ email"
            />
            <input
              type="password"
              class="form-control auth-input"
              placeholder="Mật khẩu"
            />
            <a href="#" class="btn auth-btn auth-btn-login">ĐĂNG NHẬP</a>
            <a
              href="#"
              class="auth-link"
              data-bs-toggle="modal"
              data-bs-target="#forgotPasswordModal"
              >Quên Mật Khẩu?</a
            >
          </form>

          <div class="auth-divider">
            <span>hoặc tiếp tục với</span>
          </div>

          <div class="d-grid gap-2 mt-3">
            <a href="#" class="btn social-btn google-btn">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                class="social-icon me-2"
              />
              Tiếp tục với Google
            </a>
          </div>
        </div>
      </div>

      <!-- Modal Quên Mật Khẩu -->
      <div
        class="modal fade"
        id="forgotPasswordModal"
        tabindex="-1"
        aria-labelledby="forgotPasswordModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content forgot-modal-content p-4">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title forgot-title fw-bold" id="forgotPasswordModalLabel">
                Quên mật khẩu?
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Đóng"
              ></button>
            </div>
            <div class="modal-body forgot-body">
              <p class="forgot-description mb-3">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt
                lại mật khẩu của bạn.
              </p>
              <input
                type="email"
                class="form-control forgot-input mb-3"
                placeholder="Địa chỉ email"
              />
              <a href="#" class="btn forgot-submit-btn w-100">Đặt Lại Mật Khẩu</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Tạo tài khoản -->
      <div class="col-md-6">
        <div class="auth-section auth-register">
          <h3 class="auth-heading">Tạo Tài Khoản</h3>
          <p class="auth-description">
            Lưu thông tin để thanh toán nhanh hơn, lưu các sản phẩm vào danh sách yêu
            thích và xem lịch sử mua hàng và trả hàng của bạn.
          </p>
          <a href="/register" class="btn auth-btn auth-btn-register">TẠO TÀI KHOẢN</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/login.css"></style>
