<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="/user/account" class="custom-breadcrumb-link">Tổng quan tài khoản</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Đổi mật khẩu</a
      >
    </nav>
  </div>

  <div class="container account-summary-container my-5">
    <div class="row">
      <div class="col-md-2 account-sidebar d-none d-md-block">
        <a href="/user/account">Tổng quan tài khoản</a><br />
        <a href="/user/profile">Thông tin của tôi</a><br />
        <a href="#" class="active">Đổi mật khẩu</a><br />
        <a href="/user/listaddress">Sổ địa chỉ</a><br />
        <a href="/user/review-history">Đánh giá của tôi</a><br />
        <a href="/user/order-management">Mua hàng & Trả hàng</a><br />
        <a href="/user/favorite">Danh sách yêu thích</a>
      </div>

      <div class="change-password-container col-md-10">
        <div class="text-center mb-3">
          <h3 class="text-center change-password-title fw-bold">Đổi Mật Khẩu</h3>
          <p class="text-muted">Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn</p>
        </div>

        <form @submit.prevent="handleChangePassword">
          <div class="mb-3">
            <label for="currentPassword" class="form-label change-password-label"
              >Mật khẩu hiện tại *</label
            >
            <input
              type="password"
              class="form-control change-password-input-old"
              id="currentPassword"
              v-model="currentPassword"
            />
            <div v-if="errors.currentPassword" class="text-danger mt-1">
              {{ errors.currentPassword }}
            </div>
          </div>

          <div class="mb-3">
            <label for="newPassword" class="form-label change-password-label"
              >Mật khẩu mới *</label
            >
            <input
              type="password"
              class="form-control change-password-input-new"
              id="newPassword"
              v-model="newPassword"
            />
            <div v-if="errors.newPassword" class="text-danger mt-1">
              {{ errors.newPassword }}
            </div>
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label change-password-label"
              >Xác nhận mật khẩu mới *</label
            >
            <input
              type="password"
              class="form-control change-password-input-confirm"
              id="confirmPassword"
              v-model="confirmPassword"
            />
            <div v-if="errors.confirmPassword" class="text-danger mt-1">
              {{ errors.confirmPassword }}
            </div>
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
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const errors = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

async function handleChangePassword() {
  // Reset lỗi
  errors.value = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  // Kiểm tra phía client
  let hasError = false;

  if (!currentPassword.value.trim()) {
    errors.value.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    hasError = true;
  }

  if (!newPassword.value.trim()) {
    errors.value.newPassword = "Vui lòng nhập mật khẩu mới.";
    hasError = true;
  } else if (newPassword.value.length < 6) {
    errors.value.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    hasError = true;
  }

  if (!confirmPassword.value.trim()) {
    errors.value.confirmPassword = "Vui lòng xác nhận mật khẩu mới.";
    hasError = true;
  } else if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = "Xác nhận mật khẩu không khớp.";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    iziToast.error({
      title: "Lỗi",
      message: "Vui lòng đăng nhập để đổi mật khẩu.",
      position: "topRight",
    });
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
      // Xử lý lỗi dưới input
      if (data.includes("hiện tại")) {
        errors.value.currentPassword = data;
      } else if (data.includes("mới")) {
        errors.value.newPassword = data;
      } else if (data.includes("Xác nhận")) {
        errors.value.confirmPassword = data;
      } else {
        iziToast.error({
          title: "Lỗi",
          message: data,
          position: "topRight",
        });
      }
    } else {
      iziToast.success({
        title: "Thành công",
        message: data,
        position: "topRight",
      });

      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
    }
  } catch (error) {
    console.error("Lỗi:", error);
    iziToast.error({
      title: "Lỗi hệ thống",
      message: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
      position: "topRight",
    });
  }
}
</script>

<style src="@/assets/css/change-password.css"></style>
