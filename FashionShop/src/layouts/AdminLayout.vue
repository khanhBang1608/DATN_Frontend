<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue';

import '@/assets/css/dashboard.css';
import '@/assets/js/dashboard.js';

export default {
  components: {
    AdminSidebar,
  },
};
</script>
<template>
  <div class="admin-layout">
      <AdminSidebar />
      <div class="contents p-10">
        <router-view />
      </div>
  </div>
</template>



<style scoped>
.admin-layout {
  min-height: 100vh;
}
.content {
  background: #f8f9fa;
}
</style>
