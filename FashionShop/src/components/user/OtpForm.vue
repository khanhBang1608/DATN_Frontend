<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const otp = ref('')
const message = ref('')
const error = ref('')
const isOtpSent = ref(false)
const isSending = ref(false)

axios.defaults.withCredentials = true

const validateEmail = (emailStr) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(emailStr)
}

const sendOtp = async () => {
  if (!validateEmail(email.value)) {
    error.value = 'Email không hợp lệ'
    return
  }

  if (isSending.value) return
  isSending.value = true
  error.value = ''
  message.value = ''
  try {
    const formData = new FormData()
    formData.append('email', email.value)

    const res = await axios.post('http://localhost:8080/api/register/otp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    message.value = res.data.message
    isOtpSent.value = true
  } catch (err) {
    error.value = err.response?.data?.error || 'Lỗi gửi OTP'
  } finally {
    isSending.value = false
  }
}

const confirmOtp = async () => {
  error.value = ''
  message.value = ''
  try {
    const formData = new FormData()
    formData.append('email', email.value)
    formData.append('otp', otp.value)

    const res = await axios.post('http://localhost:8080/api/register/otp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (res.data.message === 'Xác thực OTP thành công.') {
      message.value = res.data.message
      error.value = ''
      if (res.data.email) {
        router.push({
          path: '/register',
          state: { email: res.data.email }, // ← Không hiển thị trên URL
        })
      }
    } else {
      error.value = 'Xác thực thất bại'
      message.value = ''
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Xác thực thất bại'
    message.value = ''
  }
}
</script>
<template>
  <div class="forgotpassword-container">
    <div class="card p-4 shadow" style="max-width: 400px; width: 100%">
      <!-- Logo -->
      <div class="d-flex justify-content-center align-items-center mb-3">
        <img src="@/assets/images/Nike.png" alt="Nike" class="img-fluid" style="max-width: 50px" />
        <img
          src="@/assets/images/Jordan.png"
          alt="Jordan"
          class="img-fluid"
          style="max-width: 50px"
        />
      </div>

      <h2 class="text-center mb-4">Xác Thực OTP</h2>

      <!-- Thông báo -->
      <div v-if="message" class="alert alert-success text-center">{{ message }}</div>
      <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

      <!-- Form gửi OTP -->
      <form v-if="!isOtpSent" @submit.prevent="sendOtp">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="text"
            class="form-control"
            id="email"
            v-model="email"
            placeholder="Nhập email của bạn"
          />
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-dark" :disabled="isSending">
            {{ isSending ? 'Đang gửi...' : 'Gửi OTP' }}
          </button>
        </div>
      </form>

      <!-- Form nhập OTP -->
      <form v-else @submit.prevent="confirmOtp">
        <div class="mb-3">
          <label for="otp" class="form-label">Mã OTP</label>
          <input
            type="text"
            class="form-control"
            id="otp"
            v-model="otp"
            placeholder="Nhập mã OTP"
            required
          />
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-dark">Xác Nhận</button>
        </div>
      </form>

      <!-- Liên kết -->
      <div class="mt-3 text-center">
        <p class="mb-1">
          <a href="/login" class="text-secondary text-decoration-underline">Quay lại Đăng Nhập</a>
        </p>
        <p>
          Chưa có tài khoản?
          <a href="/register/otp" class="text-secondary text-decoration-underline">Đăng ký ngay</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<style src="./src/assets/css/forgotpassword.css"></style>
