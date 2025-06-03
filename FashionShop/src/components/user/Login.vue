<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()

const login = async () => {
  error.value = null
  try {
    const formData = new FormData()
    formData.append('email', email.value)
    formData.append('password', password.value)

    if (!password.value.trim() || !email.value.trim()) {
      error.value = 'Mật khẩu không được để trống hoặc chỉ chứa khoảng trắng.'
      return
    }

    const response = await axios.post('http://localhost:8080/api/login', formData, {
      headers: {},
      data: formData,
      withCredentials: true,
    })
    // Kiểm tra xem response.data.user có tồn tại không
    if (response.data && response.data.user) {
      const user = response.data.user
      const role = response.data.user.role // 0 = admin, 1 = user

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', role)

      // Lưu thông tin người dùng vào cookie
      document.cookie = `userId=${user.id}; path=/`
      document.cookie = `userRole=${user.role}; path=/`
      document.cookie = `userName=${user.name}; path=/`
      document.cookie = `userEmail=${user.email}; path=/`
      document.cookie = `userAvatar=${user.avatar}; path=/`

      // Phân quyền điều hướng
      if (role === 0) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } else {
      // Nếu không có user, hiển thị lỗi
      throw new Error('Không tìm thấy thông tin người dùng')
    }
  } catch (err) {
    error.value =
      typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Email hoặc mật khẩu không đúng'
  }
}
</script>

<template>
  <div class="login-container">
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

      <h2 class="text-center mb-4">Đăng Nhập</h2>
      <!-- Hiển thị thông báo lỗi nếu có -->
      <div v-if="error" class="alert alert-danger text-center" role="alert">
        {{ error }}
      </div>

      <form @submit.prevent="login">
        <!-- Email -->
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

        <!-- Mật khẩu -->
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <!-- Nút Đăng nhập -->
        <div class="d-grid">
          <button type="submit" class="btn btn-dark">Đăng Nhập</button>
        </div>
      </form>
      <!-- Liên kết khác -->
      <div class="mt-3 text-center">
        <p class="mb-1">
          <a href="/forgot-password" class="text-secondary text-decoration-underline"
            >Quên mật khẩu?</a
          >
        </p>
        <p>
          Chưa có tài khoản?
          <a href="/register/otp" class="text-secondary text-decoration-underline">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style src="./src/assets/css/login.css"></style>
