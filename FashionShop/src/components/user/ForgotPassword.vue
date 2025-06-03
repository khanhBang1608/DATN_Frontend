<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()

const validateEmail = (emailStr) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(emailStr)
}

const handleForgotPassword = async (e) => {
  e.preventDefault()

  successMessage.value = ''
  errorMessage.value = ''

  // Kiểm tra email hợp lệ
  if (!validateEmail(email.value)) {
    errorMessage.value = 'Vui lòng nhập email hợp lệ.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await axios.post('http://localhost:8080/api/forgot-password', null, {
      params: { email: email.value },
    })

    if (response.data.status === 'success') {
      successMessage.value = response.data.message

      // Chờ người dùng đọc thông báo
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email.value)}`)
      }, 1000)
    } else {
      errorMessage.value = response.data.message
    }
  } catch (err) {
    errorMessage.value = 'Đã xảy ra lỗi trong quá trình gửi yêu cầu.'
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- COD -->
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

      <h2 class="text-center mb-4">Quên Mật Khẩu</h2>

      <!-- Thông báo -->
      <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
      <div v-if="successMessage" class="alert alert-success text-center">{{ successMessage }}</div>

      <form @submit="handleForgotPassword">
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
          <button type="submit" class="btn btn-dark" :disabled="isSubmitting">
            {{ isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu' }}
          </button>
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
