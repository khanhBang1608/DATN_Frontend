<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { forgotPasswordAPI } from "@/api/user/forgotPasswordAPI";

const email = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();

const login = async () => {
  error.value = null;
  try {
    if (!email.value.trim() || !password.value.trim()) {
      error.value = "Email và mật khẩu không được để trống hoặc chỉ chứa khoảng trắng.";
      return;
    }

    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", password.value);

    const response = await axios.post("http://localhost:8080/api/login", formData, {
      withCredentials: true,
    });

    if (response.data && response.data.user) {
      const user = response.data.user;
      console.log(user)
      const role = user.role; // 0 = admin, 1 = user

      // Lưu token và role
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role);
      // document.cookie = `userRole=${role}; path=/`;

      // Điều hướng theo quyền
      if (role === 0) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } else {
      throw new Error("Không tìm thấy thông tin người dùng");
    }
  } catch (err) {
    error.value =
      typeof err.response?.data === "string"
        ? err.response.data
        : err.response?.data?.message || "Email hoặc mật khẩu không đúng";
  }
};

// Quên mật khẩu
const {
  email: forgotEmail,
  otp,
  newPassword,
  confirmPassword,
  step,
  fieldErrors,
  sendOtp,
  verifyOtp,
  resetPassword,
  resetState,
  isSendingOtp,
  isVerifyingOtp,
  isResettingPassword,
} = forgotPasswordAPI();

const forgotTitle = computed(() => {
  if (step.value === 1) return "Quên mật khẩu?";
  if (step.value === 2) return "Nhập mã OTP";
  return "Đặt lại mật khẩu";
});
</script>

<template>
  <div class="auth-container mt-3">
    <h3 class="auth-title">Đăng Nhập / Tạo Tài Khoản</h3>
    <div class="row g-4 mt-2 mb-3">
      <!-- Đăng nhập -->
      <div class="col-md-6">
        <div class="auth-section auth-login">
          <h3 class="auth-heading">Đăng Nhập</h3>
          <p class="auth-description">
            Đăng nhập để có thể thanh toán nhanh hơn và tận hưởng các đặc quyền thành viên
          </p>
          <form @submit.prevent="login">
            <input
              v-model="email"
              type="email"
              class="form-control auth-input"
              placeholder="Địa chỉ email"
              required
            />
            <input
              v-model="password"
              type="password"
              class="form-control auth-input"
              placeholder="Mật khẩu"
              required
            />
            <button type="submit" class="btn auth-btn auth-btn-login">ĐĂNG NHẬP</button>
            <a
              href="#"
              class="auth-link"
              data-bs-toggle="modal"
              data-bs-target="#forgotPasswordModal"
            >
              Quên Mật Khẩu?
            </a>

            <!-- Thông báo lỗi -->
            <p v-if="error" class="text-danger mt-2">{{ error }}</p>
          </form>

          <div class="auth-divider">
            <span>hoặc tiếp tục với</span>
          </div>

          <div class="d-grid gap-2 mt-3">
            <a
              href="http://localhost:8080/oauth2/authorization/google"
              class="btn social-btn google-btn"
            >
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
                {{ forgotTitle }}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Đóng"
                @click="resetState"
              ></button>
            </div>

            <div class="modal-body forgot-body">
              <!-- Bước 1: Nhập email -->
              <p class="forgot-description mb-3" v-if="step === 1">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn mã OTP để đặt lại
                mật khẩu.
              </p>
              <div v-if="step === 1">
                <input
                  v-model="forgotEmail"
                  type="email"
                  class="form-control forgot-input mb-3"
                  placeholder="Địa chỉ email"
                />
                <div v-if="fieldErrors.email" class="text-danger mb-2">
                  {{ fieldErrors.email }}
                </div>
                <button
                  class="btn forgot-submit-btn w-100"
                  @click="sendOtp"
                  :disabled="isSendingOtp"
                >
                  <span
                    v-if="isSendingOtp"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ isSendingOtp ? "Đang gửi..." : "Gửi OTP" }}
                </button>
              </div>

              <!-- Bước 2: Nhập OTP -->
              <p class="forgot-description mb-3" v-if="step === 2">
                Vui lòng nhập mã OTP đã được gửi đến địa chỉ email của bạn.
              </p>
              <div v-if="step === 2">
                <input
                  v-model="otp"
                  type="text"
                  class="form-control forgot-input mb-3"
                  placeholder="Nhập mã OTP"
                />
                <div v-if="fieldErrors.otp" class="text-danger mb-2">
                  {{ fieldErrors.otp }}
                </div>
                <button
                  class="btn forgot-submit-btn w-100"
                  @click="verifyOtp"
                  :disabled="isVerifyingOtp"
                >
                  <span
                    v-if="isVerifyingOtp"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ isVerifyingOtp ? "Đang xác minh..." : "Xác minh OTP" }}
                </button>
              </div>

              <!-- Bước 3: Đặt lại mật khẩu -->
              <p class="forgot-description mb-3" v-if="step === 3">
                Nhập mật khẩu mới và xác nhận lại để hoàn tất việc đặt lại mật khẩu.
              </p>
              <div v-if="step === 3">
                <input
                  v-model="newPassword"
                  type="password"
                  class="form-control forgot-input mb-3"
                  placeholder="Mật khẩu mới"
                />
                <div v-if="fieldErrors.newPassword" class="text-danger mb-2">
                  {{ fieldErrors.newPassword }}
                </div>

                <input
                  v-model="confirmPassword"
                  type="password"
                  class="form-control forgot-input mb-2"
                  placeholder="Xác nhận mật khẩu"
                />
                <div v-if="fieldErrors.confirmPassword" class="text-danger mb-2">
                  {{ fieldErrors.confirmPassword }}
                </div>

                <button
                  class="btn forgot-submit-btn w-100"
                  @click="resetPassword"
                  :disabled="isResettingPassword"
                >
                  <span
                    v-if="isResettingPassword"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ isResettingPassword ? "Đang đặt lại..." : "Đặt lại mật khẩu" }}
                </button>
              </div>
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
          <a href="/register/otp" class="btn auth-btn auth-btn-register">TẠO TÀI KHOẢN</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/login.css"></style>
