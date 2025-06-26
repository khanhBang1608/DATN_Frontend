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

      <div class="profile-avatar-wrapper">
        <img :src="avatarPreview" alt="Avatar" class="profile-avatar" />
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="fullname" class="form-label profile-label">Họ và Tên *</label>
          <input
            type="text"
            class="form-control"
            id="fullname"
            name="fullName"
            v-model="fullName"
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label profile-label">Email *</label>
          <input
            type="email"
            class="form-control"
            id="email"
            name="email"
            v-model="email"
            placeholder="Nhập email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="avatarInput" class="form-label profile-label"
            >Chọn ảnh đại diện</label
          >
          <input
            type="file"
            class="form-control"
            id="avatarInput"
            name="avatar"
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

<script>
export default {
  name: "ProfileInfo",
  data() {
    return {
      fullName: "",
      email: "",
      avatarPreview: "https://via.placeholder.com/120",
    };
  },
  methods: {
    previewAvatar(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleSubmit() {
      // Submit data logic here (e.g. emit, axios, etc.)
      console.log("Full name:", this.fullName);
      console.log("Email:", this.email);
      alert("Thông tin đã được lưu!");
    },
  },
};
</script>

<style src="@/assets/css/profile.css"></style>
