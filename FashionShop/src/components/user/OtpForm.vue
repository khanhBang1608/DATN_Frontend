<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const otp = ref("");
const message = ref("");
const error = ref("");
const isOtpSent = ref(false);
const isSending = ref(false);

axios.defaults.withCredentials = true;

const validateEmail = (emailStr) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(emailStr);
};

const sendOtp = async () => {
  if (!validateEmail(email.value)) {
    error.value = "Email không hợp lệ";
    return;
  }

  if (isSending.value) return;
  isSending.value = true;
  error.value = "";
  message.value = "";
  try {
    const formData = new FormData();
    formData.append("email", email.value);

    const res = await axios.post("http://localhost:8080/api/register/otp", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    message.value = res.data.message;
    isOtpSent.value = true;
  } catch (err) {
    error.value = err.response?.data?.error || "Lỗi gửi OTP";
  } finally {
    isSending.value = false;
  }
};

const confirmOtp = async () => {
  error.value = "";
  message.value = "";
  try {
    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("otp", otp.value);

    const res = await axios.post("http://localhost:8080/api/register/otp", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.message === "Xác thực OTP thành công.") {
      sessionStorage.setItem("verifiedEmail", res.data.email);
      router.push("/register");
    } else {
      error.value = "Xác thực thất bại";
      message.value = "";
    }
  } catch (err) {
    error.value = err.response?.data?.error || "Xác thực thất bại";
    message.value = "";
  }
};
</script>
<template>
  <div class="auth-registerotp-container mt-3">
    <div class="auth-registerotp-card p-4">
      <h3 class="auth-registerotp-title text-center mb-3 fw-bold">Xác Thực OTP</h3>

      <!-- Thông báo -->
      <div class="alert-wrapper">
        <div v-if="message" class="alert alert-success text-center">{{ message }}</div>
        <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
      </div>

      <!-- Form gửi OTP -->
      <form v-if="!isOtpSent" @submit.prevent="sendOtp">
        <div class="mb-3">
          <label for="email" class="form-label label-required">Email</label>
          <input
            type="text"
            class="form-control auth-registerotp-input"
            id="email"
            v-model="email"
            placeholder="Nhập email của bạn"
          />
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-auth-registerotp" :disabled="isSending">
            {{ isSending ? "Đang gửi..." : "Gửi OTP" }}
          </button>
        </div>
      </form>

      <!-- Form nhập OTP -->
      <form v-else @submit.prevent="confirmOtp">
        <div class="mb-3">
          <label for="otp" class="form-label label-required">Mã OTP</label>
          <input
            type="text"
            class="form-control auth-registerotp-input"
            id="otp"
            v-model="otp"
            placeholder="Nhập mã OTP"
            required
          />
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-auth-registerotp">Xác Nhận</button>
        </div>
      </form>

      <!-- Liên kết -->
      <div class="mt-3 text-center">
        <p class="mb-1">
          <a href="/login" class="text-secondary text-decoration-underline"
            >Quay lại Đăng Nhập</a
          >
        </p>
        <p>
          Chưa có tài khoản?
          <a href="/register/otp" class="text-secondary text-decoration-underline"
            >Đăng ký ngay</a
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<style src="">
.auth-registerotp-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-registerotp-card {
  max-width: 500px;
  width: 100%;
}

.label-required::after {
  content: "*";
  color: red;
  margin-left: 4px;
}
.btn-auth-registerotp {
  background-color: #000 !important;
  color: #fff !important;
  /* padding: 10px 20px !important; */
  width: 100% !important;
  border: 1px solid #000 !important;
  transition: all 0.3s ease !important;
}

.btn-auth-registerotp:hover {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #000 !important;
}

a.text-secondary {
  color: #6c757d !important;
  text-decoration: underline;
}

a.text-secondary:hover {
  color: #5a6268 !important;
  text-decoration: none;
}
</style>
