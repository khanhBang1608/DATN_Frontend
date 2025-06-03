<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const newPassword = ref('')
const confirmPassword = ref('')
const email = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const router = useRouter()
const route = useRoute()

onMounted(() => {
  email.value = route.query.email || ''
})

const handleResetPassword = async (e) => {
  e.preventDefault()
  errorMessage.value = ''
  successMessage.value = ''

  if (!newPassword.value.trim() || !confirmPassword.value.trim()) {
    errorMessage.value = 'Mật khẩu không được để trống hoặc chỉ chứa khoảng trắng.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await axios.post('http://localhost:8080/api/reset-password', null, {
      params: {
        email: email.value,
        newPassword: newPassword.value,
      },
    })

    if (response.data.status === 'success') {
      successMessage.value = response.data.message
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      errorMessage.value = response.data.message
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Đã xảy ra lỗi khi đặt lại mật khẩu.'
  } finally {
    isSubmitting.value = false
  }
}
const passwordStrength = ref('') // giữ thông báo độ mạnh

const checkPasswordStrength = (password) => {
  if (password.length < 6) {
    return 'Yếu'
  }

  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (hasLetter && hasNumber && hasSpecial && password.length >= 8) {
    return 'Mạnh'
  } else if ((hasLetter && hasNumber) || (hasLetter && hasSpecial)) {
    return 'Trung bình'
  }

  return 'Yếu'
}

// Theo dõi khi người dùng nhập mật khẩu
watch(newPassword, (value) => {
  passwordStrength.value = checkPasswordStrength(value)
})
</script>
<template>
  <div class="resetpassword-container">
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
      <h2 class="text-center mb-4">Đặt Lại Mật Khẩu</h2>

      <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
      <div v-if="successMessage" class="alert alert-success text-center">{{ successMessage }}</div>

      <form @submit="handleResetPassword">
        <div class="mb-3">
          <label for="newPassword" class="form-label">Mật khẩu mới</label>
          <input
            type="password"
            class="form-control"
            id="newPassword"
            v-model="newPassword"
            placeholder="Nhập mật khẩu mới"
          />
          <small
            v-if="newPassword"
            :class="{
              'text-danger': passwordStrength === 'Yếu',
              'text-warning': passwordStrength === 'Trung bình',
              'text-success': passwordStrength === 'Mạnh',
            }"
          >
            Độ mạnh mật khẩu: {{ passwordStrength }}
          </small>
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-dark" :disabled="isSubmitting">
            {{ isSubmitting ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu' }}
          </button>
        </div>
      </form>

      <div class="mt-3 text-center">
        <a href="/login" class="text-secondary text-decoration-underline">Quay lại đăng nhập</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resetpassword-container {
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
