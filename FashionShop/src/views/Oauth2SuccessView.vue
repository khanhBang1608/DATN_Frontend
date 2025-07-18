<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const token = route.query.token;
  const role = route.query.role;

  if (token && role) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    if (role === '0') {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  } else {
    router.push("/login");
  }
});
</script>

<template>
  <div class="text-center mt-5">
    <h4>Đang xử lý đăng nhập Google...</h4>
  </div>
</template>
