<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import initHeader from "@/assets/js/header.js"; // Nếu có custom JS

const isLoggedIn = ref(false);
const router = useRouter();

function goLogout() {
  router.push("/logout");
}

onMounted(() => {
  initHeader(); // Khởi động nếu có animation gì đó
  isLoggedIn.value = !!localStorage.getItem("token");

  // Theo dõi thay đổi login state (ví dụ nếu login từ tab khác)
  window.addEventListener("storage", () => {
    isLoggedIn.value = !!localStorage.getItem("token");
  });
});
</script>


<template>
  <header class="bg-light py-2 border-bottom">
    <div class="container d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <router-link to="/" class="navbar-brand fw-bold text-dark">
          FashionShop
        </router-link>
      </div>

      <!-- Menu lớn (desktop) -->
      <div class="d-none d-md-flex align-items-center">
        <a href="/about" class="text-dark text-decoration-none me-3">Giới thiệu</a>
        <a href="/contact-us" class="text-dark text-decoration-none me-3">Liên hệ</a>
        <a href="/policy" class="text-dark text-decoration-none me-3">Chính sách</a>

        <!-- Đăng nhập / Đăng xuất -->
        <router-link
          v-if="!isLoggedIn"
          to="/login"
          class="text-dark text-decoration-none me-3"
        >
          Đăng nhập
        </router-link>
        <button
          v-else
          @click="goLogout"
          class="btn btn-outline-danger btn-sm me-3"
        >
          <i class="bi bi-box-arrow-right me-1"></i> Đăng xuất
        </button>
      </div>

      <!-- Menu dropdown nhỏ (mobile) -->
      <div class="dropdown d-md-none">
        <button
          class="btn btn-light border dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-list"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="/about">Giới thiệu</a></li>
          <li><a class="dropdown-item" href="/contact-us">Liên hệ</a></li>
          <li><a class="dropdown-item" href="/policy">Chính sách</a></li>
          <li v-if="!isLoggedIn">
            <router-link class="dropdown-item" to="/login">Đăng nhập</router-link>
          </li>
          <li v-else>
            <a class="dropdown-item text-danger" @click.prevent="goLogout">
              <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>



