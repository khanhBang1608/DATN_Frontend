<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { onMounted } from "vue";
import ChatBox from "./components/Chatbox.vue";

const route = useRoute(); // lấy route hiện tại
</script>

<template>
  <RouterView />
  <!-- ✅ Chỉ hiển thị ChatBox nếu không phải đường dẫn admin -->
  <ChatBox v-if="!route.path.startsWith('/admin')" />
</template>
