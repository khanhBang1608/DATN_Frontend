<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Đổi Mật Khẩu</a
      >
    </nav>
  </div>

  <div class="container">
    <div class="change-password-container">
      <h3 class="text-center change-password-title">Đổi Mật Khẩu</h3>

      <form @submit.prevent="handleChangePassword">
        <div class="mb-3">
          <label for="currentPassword" class="form-label change-password-label">
            Mật khẩu hiện tại *
          </label>
          <input
            type="password"
            class="form-control change-password-input-old"
            id="currentPassword"
            v-model="currentPassword"
            required
          />
        </div>

        <div class="mb-3">
          <label for="newPassword" class="form-label change-password-label">
            Mật khẩu mới *
          </label>
          <input
            type="password"
            class="form-control change-password-input-new"
            id="newPassword"
            v-model="newPassword"
            required
          />
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label change-password-label">
            Xác nhận mật khẩu mới *
          </label>
          <input
            type="password"
            class="form-control change-password-input-confirm"
            id="confirmPassword"
            v-model="confirmPassword"
            required
          />
        </div>

        <div
          v-if="errorMessage"
          class="alert alert-danger text-center change-password-error"
        >
          {{ errorMessage }}
        </div>

        <div class="text-center mt-4">
          <button type="submit" class="btn change-password-btn-save">
            Lưu Mật Khẩu Mới
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangePassword",
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      errorMessage: "",
    };
  },
  methods: {
    handleChangePassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = "Mật khẩu xác nhận không khớp.";
        return;
      }

      // Submit logic ở đây
      console.log("Mật khẩu hiện tại:", this.currentPassword);
      console.log("Mật khẩu mới:", this.newPassword);
      this.errorMessage = "";
      alert("Mật khẩu đã được thay đổi!");
    },
  },
};
</script>

<style src="@/assets/css/change-password.css"></style>
