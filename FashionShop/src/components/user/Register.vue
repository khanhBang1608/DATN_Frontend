<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const emailFromSession = sessionStorage.getItem("verifiedEmail")
  if (emailFromSession) {
    form.value.email = emailFromSession
  } else {
    // Nếu không có email → quay lại trang OTP
    router.replace("/register/otp")
  }
})

axios.defaults.withCredentials = true

// --- Register Form Logic ---
const submitted = ref(false)

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

const errors = ref({
  fullName: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

const passwordMismatch = computed(
  () => form.value.password !== form.value.confirmPassword
)

async function handleSubmit() {
  submitted.value = true
  if (!form.value.email) {
    alert('Vui lòng xác thực email trước khi đăng ký.')
    return
  }

  const formEl = document.querySelector('form')
  if (!formEl.checkValidity() || passwordMismatch.value) return

  try {
    const res = await axios.post('http://localhost:8080/api/register', form.value, {
      headers: { 'Content-Type': 'application/json' },
    })

    alert('Tạo tài khoản thành công!')
    sessionStorage.removeItem("verifiedEmail") // ✅ xoá email sau khi dùng xong
    router.push('/login').then(() => window.location.reload())
  } catch (err) {
    const resErrors = err.response?.data
    if (resErrors && typeof resErrors === 'object') {
      Object.assign(errors.value, resErrors)
    } else {
      alert('Đăng ký thất bại. Vui lòng thử lại.')
    }
  }
}
</script>
<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h3 class="text-center mb-3 fw-bold">Tạo Tài Khoản</h3>
        <p class="text-center mb-4">
          Lưu thông tin để thanh toán nhanh hơn, lưu sản phẩm yêu thích và xem lịch sử mua
          hàng.
        </p>

        <form
          @submit.prevent="handleSubmit"
          novalidate
          :class="{ 'was-validated': submitted }"
        >
          <!-- Họ và tên -->
          <div class="mb-3">
            <label class="form-label label-required">Họ và tên</label>
            <input
              type="text"
              class="form-control register-input"
              v-model="form.fullName"
              required
            />
            <div class="invalid-feedback">Nhập họ và tên của bạn</div>
          </div>

          <!-- Email -->
          <!-- <div class="mb-3">
            <label class="form-label label-required">Email</label>
            <input
              type="email"
              class="form-control register-input"
              v-model="form.email"
              required
            />
            <div class="invalid-feedback">Nhập địa chỉ email hợp lệ</div>
          </div> -->
          <input type="hidden" v-model="form.email" />
          <p class="text-muted mb-3">Email đã xác thực: <strong>{{ form.email }}</strong></p>

          <!-- Mật khẩu -->
          <div class="mb-3">
            <label class="form-label label-required">Mật khẩu</label>
            <input
              type="password"
              class="form-control register-input"
              v-model="form.password"
              required
              minlength="6"
            />
            <div class="invalid-feedback">Mật khẩu tối thiểu 6 ký tự</div>
          </div>

          <!-- Xác nhận mật khẩu -->
          <div class="mb-3">
            <label class="form-label label-required">Xác nhận mật khẩu</label>
            <input
              type="password"
              class="form-control register-input"
              v-model="form.confirmPassword"
              :class="{ 'is-invalid': passwordMismatch }"
              required
            />
            <div class="invalid-feedback">Mật khẩu không khớp</div>
          </div>

          <!-- Đồng ý điều khoản -->
          <div class="form-check mb-4">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="form.agree"
              id="agree"
              required
            />
            <label class="form-check-label" for="agree">
              Tôi đồng ý với <a href="#">Điều khoản</a> &
              <a href="#">Chính sách bảo mật</a> của L'HEX
            </label>
            <div class="invalid-feedback">Bạn phải đồng ý để tiếp tục</div>
          </div>

          <!-- Nút submit -->
          <button type="submit" class="btn-register">Tạo Tài Khoản</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/register.css"></style>
