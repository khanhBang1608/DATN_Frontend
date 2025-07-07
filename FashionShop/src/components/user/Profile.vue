<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Thông tin của tôi</a
      >
    </nav>
  </div>

  <div class="container">
    <div class="profile-container">
      <h3 class="text-center profile-title">Thông Tin Của Tôi</h3>
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
      <div class="profile-avatar-wrapper">
        <img :src="avatarPreview" alt="Avatar" class="profile-avatar" />
      </div>

      <form @submit.prevent="updateProfile">
        <div class="mb-3">
          <label for="fullname" class="form-label profile-label">Họ và Tên *</label>
          <input
            type="text"
            class="form-control"
            id="fullname"
            v-model.trim="fullName"
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label profile-label">Email *</label>
          <input type="email" class="form-control" id="email" :value="email" disabled />
        </div>

        <div class="mb-3">
          <label for="avatarInput" class="form-label profile-label"
            >Chọn ảnh đại diện</label
          >
          <input
            type="file"
            class="form-control"
            id="avatarInput"
            accept="image/*"
            @change="previewAvatar"
          />
        </div>

        <div class="text-center mt-4">
          <button type="submit" class="btn profile-btn-save">
            Lưu Thông Tin Chi Tiết
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// --- Token ---
const token = localStorage.getItem("token");

// --- Data ---
const fullName = ref("");
const email = ref("");
const avatarPreview = ref("https://via.placeholder.com/120");
const avatarFile = ref(null);
const errorMessage = ref("");

// --- Fetch profile ---
const fetchProfile = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    const data = res.data;
    fullName.value = data.name;
    email.value = data.email;
    avatarPreview.value = data.avatar || avatarPreview.value;
  } catch (err) {
    errorMessage.value = "Lỗi khi tải thông tin: " + (err.response?.data || err.message);
  }
};

// --- Preview avatar ---
const previewAvatar = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarFile.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      avatarPreview.value = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// --- Update profile ---
const updateProfile = async () => {
  try {
    const formData = new FormData();
    formData.append("fullName", fullName.value);
    if (avatarFile.value) formData.append("avatar", avatarFile.value);

    const res = await axios.put(
      "http://localhost:8080/api/user/profile/update",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    avatarPreview.value = res.data.avatar || avatarPreview.value;
    alert("Cập nhật thành công");
  } catch (err) {
    errorMessage.value = "Cập nhật thất bại: " + (err.response?.data || err.message);
  }
};

onMounted(fetchProfile);
</script>

<style src="@/assets/css/profile.css"></style>
