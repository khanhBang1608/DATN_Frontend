<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const emailFromState = history.state?.email
  if (emailFromState) {
    form.value.email = emailFromState
  }
})

const otpVerified = ref(true)

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
})

const errors = ref({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  general: '',
})

const register = async () => {
  try {
    errors.value = {}

    const formData = new FormData()
    formData.append('email', form.value.email)
    formData.append('password', form.value.password)
    formData.append('confirmPassword', form.value.confirmPassword)
    formData.append('fullName', form.value.fullName)

    await axios.post('http://localhost:8080/api/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    alert('Đăng ký thành công!')
    router.push('/login').then(() => {
      // Tự động load lại trang sau khi chuyển hướng
      window.location.reload()
    })
  } catch (error) {
    if (error.response && error.response.status === 400) {
      errors.value = { ...errors.value, ...error.response.data }
    } else {
      errors.value.general = 'Lỗi kết nối server.'
    }
  }
}
</script>

<template>
  <div class="register-container">
    <div class="card p-4 shadow" style="max-width: 500px; width: 100%">
      <h2 class="text-center mb-4">Đăng Ký</h2>

      <!-- ✅ Nếu đã xác thực OTP -->
      <template v-if="otpVerified">
        <form @submit.prevent="register">
          <div class="text-danger mb-2" v-if="errors.general">{{ errors.general }}</div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              v-model="form.email"
              type="text"
              class="form-control"
              id="email"
              placeholder="Nhập email của bạn"
              readonly
            />
            <div class="text-danger" v-if="errors.email">{{ errors.email }}</div>
          </div>

          <!-- Mật khẩu -->
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Nhập mật khẩu"
            />
            <div class="text-danger" v-if="errors.password">{{ errors.password }}</div>
          </div>

          <!-- Xác nhận mật khẩu -->
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              class="form-control"
              id="confirmPassword"
              placeholder="Xác nhận mật khẩu"
            />
            <div class="text-danger" v-if="errors.confirmPassword">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <!-- Họ tên -->
          <div class="mb-3">
            <label for="fullName" class="form-label">Họ và tên</label>
            <input
              v-model="form.fullName"
              type="text"
              class="form-control"
              id="fullName"
              placeholder="Nhập họ tên"
            />
            <div class="text-danger" v-if="errors.fullName">{{ errors.fullName }}</div>
          </div>

          <!-- Nút Đăng ký -->
          <div class="d-grid">
            <button type="submit" class="btn btn-dark">Đăng Ký</button>
          </div>
        </form>
      </template>

      <!-- ❌ Nếu chưa xác thực OTP -->
      <template v-else>
        <div class="alert alert-warning text-center">
          Vui lòng xác thực email bằng OTP trước khi đăng ký.
        </div>
      </template>

      <!-- Link đăng nhập -->
      <div class="mt-3 text-center">
        <p>
          Đã có tài khoản?
          <a href="/login" class="text-secondary text-decoration-underline">Đăng nhập</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<style src="./src/assets/css/register.css"></style>
