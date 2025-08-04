<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goLogout() {
  router.push("/logout");
}
</script>

<template>
  <aside class="side-nav" id="show-side-navigation1">
    <div class="heading d-flex justify-content-between align-items-center">
      <div class="info">
        <h3 class="mb-0 text-center">
          <a href="/admin/dashboard">
            <img src="@/assets/img/logo-brand.png" alt="Nike Logo" height="50" />
          </a>
        </h3>
      </div>
    </div>

    <div class="nav-content">
      <ul class="categories">
        <li>
          <i class="fas fa-home fa-fw" aria-hidden="true"></i>
          <router-link to="/admin/dashboard">Thống kê</router-link>
        </li>
        <li>
          <i class="fas fa-headset fa-fw"></i>
          <router-link to="/admin/order">Quản lí đơn</router-link>
        </li>
        <li>
          <i class="fas fa-users fa-fw"></i>
          <router-link to="/admin/user">Người dùng</router-link>
          <!-- <a href="/admin/user" class="user-li">Người dùng</a>
          <ul class="side-nav-dropdown">
            <li><router-link to="/admin/user">Danh sách người dùng</router-link></li>
            <li><a href="#">Quản lí quyền</a></li>
          </ul> -->
        </li>
        <li>
          <i class="fas fa-bolt fa-fw"></i>
          <router-link to="/admin/product">Product</router-link>
        </li>
        <li>
          <i class="fas fa-users fa-fw"></i>
          <a href="#" class="user-li">Thuộc tính</a>
          <ul class="side-nav-dropdown">
            <li><router-link to="/admin/attribute/colors">Màu sắc</router-link></li>
            <li><router-link to="/admin/attribute/sizes">Kích thước</router-link></li>
          </ul>
        </li>
        <li>
          <i class="fas fa-list-ul fa-fw" aria-hidden="true"></i>
          <router-link to="/admin/category">Danh mục</router-link>
        </li>
        <li>
          <i class="far fa-star fa-fw" aria-hidden="true"></i>
          <router-link to="/admin/review">Đánh giá</router-link>
        </li>
        <li>
          <i class="fas fa-money-bill fa-fw" aria-hidden="true"></i>
          <router-link to="/admin/promotion">Khuyến mãi</router-link>
        </li>
        <li>
          <i class="fas fa-cc-amex" aria-hidden="true"></i>
          <router-link to="/admin/discount">Voucher</router-link>
        </li>
      </ul>

      <div class="logout-btn">
        <button @click="goLogout" class="btn btn-danger btn-sm">
          <i class="fa fa-sign-out" aria-hidden="true"></i> Đăng xuất
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.side-nav {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Chiều cao toàn bộ sidebar */
}

.nav-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 1rem;
}

.logout-btn {
  text-align: center;
  padding-top: 1rem;
}
</style>
