<!-- RegisterForm.vue -->
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
              v-model="form.firstName"
              required
            />
            <div class="invalid-feedback">Nhập họ và tên của bạn</div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label class="form-label label-required">Email</label>
            <input
              type="email"
              class="form-control register-input"
              v-model="form.email"
              required
            />
            <div class="invalid-feedback">Nhập địa chỉ email hợp lệ</div>
          </div>

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

<script setup>
import { ref, computed } from "vue";

const submitted = ref(false);
const form = ref({
  firstName: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
});

const maxDate = new Date().toISOString().split("T")[0];

const passwordMismatch = computed(
  () => form.value.password !== form.value.confirmPassword
);

function handleSubmit() {
  submitted.value = true;

  const formEl = document.querySelector("form");
  if (!formEl.checkValidity() || passwordMismatch.value) {
    return;
  }

  // Submit thành công
  alert("Tạo tài khoản thành công");
  // Thực hiện xử lý dữ liệu tại đây...
}
</script>

<style src="@/assets/css/register.css"></style>
