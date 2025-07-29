<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="/" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="/user/account" class="custom-breadcrumb-link">Tài khoản</a>
      <span class="custom-breadcrumb-separator">/</span>
      <span class="custom-breadcrumb-link custom-breadcrumb-current">Yêu thích</span>
    </nav>
  </div>

  <div class="container account-summary-container my-5">
    <div class="row">
      <div class="col-md-2 account-sidebar d-none d-md-block">
        <a href="/user/account">Tổng quan tài khoản</a><br />
        <a href="/user/profile">Thông tin của tôi</a><br />
        <a href="/user/change-password">Đổi mật khẩu</a><br />
        <a href="/user/listaddress">Sổ địa chỉ</a><br />
        <a href="/user/review-history">Đánh giá của tôi</a><br />
        <a href="/user/order-management">Mua hàng & Trả hàng</a><br />
        <a href="#" class="active">Danh sách yêu thích</a>
      </div>

      <div class="col-md-10">
        <div v-if="favoriteProducts.length > 0" class="container mb-3">
          <h4 class="text-center mt-4 fw-bold">SẢN PHẨM YÊU THÍCH</h4>
          <div class="row g-3 mt-3">
            <div
              v-for="item in favoriteProducts"
              :key="item.id"
              class="col-6 col-sm-6 col-md-4 col-lg-3"
            >
              <div class="product-item-wrapper position-relative">
                <RouterLink :to="`/product-detail/${item.productId}`" class="product-link">
                  <div class="product-item">
                    <img
                      :src="getImageUrl(item.imageName)"
                      class="img-fluid"
                      :alt="item.productName"
                    />
                  </div>
                  <div class="product-name text-truncate">{{ item.productName }}</div>
                </RouterLink>
                <button
                  class="btn btn-sm btn-outline-danger w-100"
                  @click="removeFromFavorite(item.productId)"
                >
                  Gỡ khỏi yêu thích ❤️
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-muted mt-5">
          Bạn chưa có sản phẩm yêu thích nào.
        </div>

        <div v-if="message" class="alert alert-info text-center mt-3">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getFavorites, toggleFavorite } from "@/api/user/FavoriteAPI";

const favoriteProducts = ref([]);
const message = ref("");

const loadFavorites = async () => {
  try {
    favoriteProducts.value = await getFavorites();
    message.value = "";
  } catch (err) {
    message.value = err.message || "Lỗi khi tải danh sách yêu thích.";
  }
};

const removeFromFavorite = async (productId) => {
  try {
    const result = await toggleFavorite(productId);
    message.value = result;
    await loadFavorites();
  } catch (err) {
    message.value = err.message || "Lỗi khi xoá sản phẩm yêu thích.";
  }
};

const getImageUrl = (imageName) => {
  return imageName ? `http://localhost:8080/images/${imageName}` : "/images/default.png";
};

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped>
.product-item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem; /* Controlled spacing between image, name, and button */
}

.product-item {
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.img-fluid {
  width: 100%;
  height: auto;
  max-width: 100%;
  display: block;
}

.product-name {
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  padding: 0 0.5rem; 
}

</style>