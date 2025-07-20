<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="/user/account" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Tổng quan tài khoản</a
      >
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current">
        Đổi Mật Khẩu
      </a>
    </nav>
  </div>

  <div class="container account-summary-container my-5">
    <div class="row">
      <div class="col-md-2 account-sidebar d-none d-md-block">
        <a href="/user/account">Tổng quan tài khoản</a><br />
        <a href="/user/profile">Thông tin của tôi</a><br />
        <a href="#" class="active">Đổi mật khẩu</a><br />
        <a href="/user/address">Sổ địa chỉ</a><br />
        <a href="/user/review-history">Đánh giá của tôi</a><br />
        <a href="/user/order-management">Mua hàng & Trả hàng</a><br />
        <a href="#">Danh sách yêu thích</a>
      </div>
      <div class="change-password-container col-md-10">
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
            />
          </div>

          <div
            v-if="errorMessage"
            class="alert alert-danger text-center change-password-error"
          >
            {{ errorMessage }}
          </div>

          <div
            v-if="successMessage"
            class="alert alert-success text-center change-password-success"
          >
            {{ successMessage }}
          </div>
          <div class="text-center mt-4">
            <button type="submit" class="btn change-password-btn-save">
              Lưu Mật Khẩu Mới
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");

async function handleChangePassword() {
  errorMessage.value = "";
  successMessage.value = "";

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "Mật khẩu xác nhận không khớp.";
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    errorMessage.value = "Vui lòng đăng nhập để đổi mật khẩu.";
    return;
  }

  const payload = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  };

  try {
    const res = await fetch("http://localhost:8080/api/user/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.text();

    if (!res.ok) {
      errorMessage.value = data;
    } else {
      successMessage.value = data;

      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
    }
  } catch (error) {
    console.error("Lỗi:", error);
    errorMessage.value = "Đã xảy ra lỗi. Vui lòng thử lại!";
  }
}
</script>

<style src="@/assets/css/change-password.css"></style>
