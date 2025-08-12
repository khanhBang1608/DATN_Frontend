<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { forgotPasswordAPI } from "@/api/user/forgotPasswordAPI";
import { registerOtpAPI } from "@/api/user/registerOtpAPI";
import { loginWithGoogle } from "./GoogleLogin.js";

const router = useRouter();
axios.defaults.withCredentials = true;
const redirectPath = router.currentRoute.value.query.redirect;

// Login logic
const email = ref("");
const password = ref("");
const error = ref(null);

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
      const role = user.role; // 0 = admin, 1 = user

      const ttl = 2 * 60 * 60 * 1000; // 2 tiếng tính bằng milliseconds
      const expiresAt = Date.now() + ttl;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("tokenExpiresAt", expiresAt.toString());

      if (role === 0) {
        router.push(redirectPath || "/admin/dashboard").then(() => {
          window.location.reload();
        });
      } else {
        router.push(redirectPath || "/").then(() => {
          window.location.reload();
        });
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

// Forgot password logic
const {
  email: forgotEmail,
  otp,
  newPassword,
  confirmPassword,
  step,
  fieldErrors,
  sendOtp: sendForgotOtp,
  verifyOtp,
  resetPassword,
  resetState: resetForgotState,
  isSendingOtp,
  isVerifyingOtp,
  isResettingPassword,
} = forgotPasswordAPI();

const forgotTitle = computed(() => {
  if (step.value === 1) return "Quên mật khẩu?";
  if (step.value === 2) return "Nhập mã OTP";
  return "Đặt lại mật khẩu";
});

// OTP registration logic
const {
  email: registerEmail,
  otp: registerOtp,
  isOtpSent,
  isSending,
  emailError,
  otpError,
  hasTriedSubmit,
  sendOtp: sendRegisterOtp,
  confirmOtp,
  resendOtp,
  resetState: resetOtpState,
} = registerOtpAPI();

const registerTitle = computed(() => {
  return isOtpSent.value ? "Nhập mã OTP" : "Xác thực OTP để đăng ký";
});

// Google login
const handleGoogleLogin = async () => {
  try {
    const googleUser = await loginWithGoogle();
    const idToken = await googleUser.getIdToken();

    const response = await axios.post("http://localhost:8080/api/public/oauth/google", {
      idToken: idToken,
    });

    const { token, user: userData } = response.data;

    const ttl = 2 * 60 * 60 * 1000; // 2 tiếng tính bằng milliseconds
    const expiresAt = Date.now() + ttl;
    localStorage.setItem("token", token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("tokenExpiresAt", expiresAt.toString());

    const redirect = router.currentRoute.value.query.redirect;

    if (userData.role === 0) {
      router.push(redirect || "/admin/dashboard").then(() => {
        window.location.reload();
      });
    } else {
      router.push(redirect || "/").then(() => {
        window.location.reload();
      });
    }
  } catch (err) {
    alert("Lỗi đăng nhập: " + err.message);
    console.error(err);
  }
};
</script>

<template>
  <div class="auth-container mt-3">
    <h3 class="auth-title fw-bold text-center">Đăng Nhập / Tạo Tài Khoản</h3>
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
              type="text"
              class="form-control auth-input"
              placeholder="Địa chỉ email"
            />
            <input
              v-model="password"
              type="password"
              class="form-control auth-input"
              placeholder="Mật khẩu"
            />
            <p v-if="error" class="text-danger mt-2">{{ error }}</p>
            <button type="submit" class="btn auth-btn auth-btn-login">ĐĂNG NHẬP</button>
            <a
              href="#"
              class="auth-link"
              data-bs-toggle="modal"
              data-bs-target="#forgotPasswordModal"
            >
              Quên Mật Khẩu?
            </a>
          </form>

          <div class="auth-divider">
            <span>hoặc tiếp tục với</span>
          </div>

          <div class="d-grid gap-2 mt-3">
            <button class="btn social-btn google-btn" @click="handleGoogleLogin">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                class="social-icon me-2"
              />
              Tiếp tục với Google
            </button>
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
          <button
            class="btn auth-btn auth-btn-register"
            data-bs-toggle="modal"
            data-bs-target="#registerOtpModal"
          >
            TẠO TÀI KHOẢN
          </button>
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
              @click="resetForgotState"
            ></button>
          </div>

          <div class="modal-body forgot-body">
            <!-- Bước 1: Nhập email -->
            <p class="forgot-description mb-3" v-if="step === 1">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật
              khẩu.
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
                @click="sendForgotOtp"
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

    <!-- Modal OTP Đăng Ký -->
    <div
      class="modal fade"
      id="registerOtpModal"
      tabindex="-1"
      aria-labelledby="registerOtpModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content forgot-modal-content p-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title forgot-title fw-bold" id="registerOtpModalLabel">
              {{ registerTitle }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Đóng"
              @click="resetOtpState"
            ></button>
          </div>

          <div class="modal-body forgot-body">
            <!-- Nhập email để gửi OTP -->
            <p class="forgot-description mb-3" v-if="!isOtpSent">
              Nhập địa chỉ email của bạn để nhận mã OTP và bắt đầu quá trình đăng ký.
            </p>
            <div v-if="!isOtpSent">
              <input
                v-model="registerEmail"
                type="email"
                class="form-control forgot-input mb-3"
                placeholder="Địa chỉ email"
                @input="emailError = ''"
              />
              <div v-if="hasTriedSubmit && emailError" class="text-danger mb-2">
                {{ emailError }}
              </div>
              <button
                class="btn forgot-submit-btn w-100"
                @click="sendRegisterOtp(router)"
                :disabled="isSending"
              >
                <span
                  v-if="isSending"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ isSending ? "Đang gửi..." : "Gửi OTP" }}
              </button>
            </div>

            <!-- Nhập mã OTP -->
            <p class="forgot-description mb-3" v-if="isOtpSent">
              Vui lòng nhập mã OTP đã được gửi đến địa chỉ email của bạn.
            </p>
            <div v-if="isOtpSent">
              <input
                v-model="registerOtp"
                type="text"
                class="form-control forgot-input mb-3"
                placeholder="Nhập mã OTP"
                @input="otpError = ''"
              />
              <div v-if="hasTriedSubmit && otpError" class="text-danger mb-2">
                {{ otpError }}
              </div>
              <button class="btn forgot-submit-btn w-100" @click="confirmOtp(router)">
                Xác minh OTP
              </button>
              <p class="mt-3 text-center">
                Không nhận được OTP?
                <a
                  href="#"
                  class="text-secondary link-hover-remove"
                  @click.prevent="resendOtp"
                >
                  Gửi lại </a
                >.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/login.css"></style>
