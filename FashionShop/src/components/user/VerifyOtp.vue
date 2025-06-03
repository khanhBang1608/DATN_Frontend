<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const otp = ref('')
const email = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const isVerifying = ref(false)

const router = useRouter()
const route = useRoute()

// Lấy email từ query params
onMounted(() => {
  email.value = route.query.email || ''
})

const handleVerifyOtp = async (e) => {
  e.preventDefault()

  successMessage.value = ''
  errorMessage.value = ''
  isVerifying.value = true

  try {
    const response = await axios.post('http://localhost:8080/api/verify-otp', null, {
      params: {
        email: email.value,
        otp: otp.value,
      },
    })

    const res = response.data

    if (res.status === 'success') {
      successMessage.value = res.message

      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.value)}`)
      }, 1000)
    } else if (res.status === 'expired') {
      errorMessage.value = 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại mã.'
    } else {
      errorMessage.value = res.message || 'Xác minh OTP thất bại.'
    }
  } catch (err) {
    errorMessage.value = 'Đã xảy ra lỗi khi xác minh OTP.'
    console.error(err)
  } finally {
    isVerifying.value = false
  }
}
</script>

<template>
  <div class="verifyotp-container">
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
      <h2 class="text-center mb-4">Xác Minh OTP</h2>

      <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
      <div v-if="successMessage" class="alert alert-success text-center">{{ successMessage }}</div>

      <form @submit="handleVerifyOtp">
        <div class="mb-3">
          <label for="otp" class="form-label">Nhập mã OTP</label>
          <input
            type="text"
            id="otp"
            class="form-control"
            v-model="otp"
            placeholder="Nhập mã OTP đã gửi qua email"
            required
          />
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-dark" :disabled="isVerifying">
            {{ isVerifying ? 'Đang xác minh...' : 'Xác Minh' }}
          </button>
        </div>
      </form>

      <div class="mt-3 text-center">
        <p class="mb-1">
          <a href="/login" class="text-secondary text-decoration-underline">Quay lại Đăng Nhập</a>
        </p>
        <p>
          Không nhận được OTP?
          <a href="/forgot-password" class="text-secondary text-decoration-underline">Gửi lại</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verifyotp-container {
  background-color: #f8f9fa;
  height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
}
.card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #343a40;
}

.btn-dark {
  background-color: #343a40;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  padding: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-dark:hover {
  background-color: #495057;
  box-shadow: 0 0 8px rgba(52, 58, 64, 0.5);
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
