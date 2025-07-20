<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goLogout() {
  router.push('/logout')
}
</script>

<template>
  <aside class="side-nav" id="show-side-navigation1">

<div class="heading d-flex justify-content-between align-items-center">
  <div class="info">
    <h3 class="mb-0"><a href="../">ADMIN</a></h3>
  </div>


</div>



    <ul class="categories">
      <li>
        <i class="fas fa-home fa-fw" aria-hidden="true"></i
        ><router-link to="/admin/dashboard">Thống kê</router-link>
      </li>
      <li><i class="fas fa-headset fa-fw"></i><router-link to="/admin/order">Quản lí đơn</router-link></li>
      <li>
        <i class="fas fa-users fa-fw"></i><a href="/admin/user" class="user-li">Người dùng</a>
        <ul class="side-nav-dropdown">
          <li><router-link to="/admin/user">Danh sách người dùng</router-link></li>
          <li><a href="#">Quản lí quyền</a></li>
        </ul>
      </li>
      <li><i class="fas fa-bolt fa-fw"></i><router-link to="/admin/product">Product</router-link></li>
      <li><i class="fas fa-list-ul fa-fw" aria-hidden="true"></i><router-link to="/admin/category">Danh mục</router-link></li>

      <li><i class="far fa-star  fa-fw" aria-hidden="true"></i><router-link to="/admin/review">Đánh giá</router-link></li>
      <li>
        <i class="fas fa-money-bill fa-fw" aria-hidden="true"></i
        ><router-link to="/admin/promotion">Khuyến mãi</router-link>
      </li>
      <li>
        <i class="fas fa-cc-amex" aria-hidden="true"></i
        ><router-link to="/admin/discount">Voucher</router-link>
      </li>
      <li>
  <button @click="goLogout" class="btn btn-danger btn-sm" style="white-space: nowrap;">
    <i class="fa fa-sign-out" aria-hidden="true"></i> Đăng xuất
  </button>
</li>



    </ul>
  </aside>
</template>
