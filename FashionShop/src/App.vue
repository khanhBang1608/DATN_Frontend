<script setup>
import { RouterLink, RouterView } from "vue-router";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

// const router = useRouter();

// // ✅ Hàm kiểm tra token hết hạn
// function isTokenValid() {
//   const token = localStorage.getItem("token");
//   const expiresAt = localStorage.getItem("tokenExpiresAt");

//   if (!token || !expiresAt) return false;

//   return Date.now() < parseInt(expiresAt);
// }

// onMounted(() => {
//   if (!isTokenValid()) {
//     // ✅ Xóa token, role và thời gian nếu hết hạn
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("tokenExpiresAt");

//     // ✅ Chuyển hướng về trang đăng nhập
//     router.push("/login");
//   }
// });
</script>

<template>
  <RouterView />
</template>
