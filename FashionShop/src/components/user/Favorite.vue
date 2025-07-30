<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="/" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="/user/account" class="custom-breadcrumb-link">Tổng quan tài khoản</a>
      <span class="custom-breadcrumb-separator">/</span>
      <span class="custom-breadcrumb-link custom-breadcrumb-current"
        >Danh sách yêu thích</span
      >
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

      <div class="favorite-container col-md-10">
        <h3 class="text-center mb-3 fw-bold">Danh sách yêu thích</h3>
        <div v-if="favoriteProducts.length > 0" class="mb-4">
          <div class="row g-3 mt-2">
            <div
              v-for="item in favoriteProducts"
              :key="item.id"
              class="col-6 col-sm-6 col-md-4 col-lg-3"
            >
              <div class="product-content-wrapper position-relative">
                <RouterLink
                  :to="`/product-detail/${item.productId}`"
                  class="product-link"
                >
                  <div class="product-item">
                    <img
                      :src="getImageUrl(item.imageName)"
                      class="img-fluid"
                      :alt="item.productName"
                    />
                  </div>
                  <div class="product-name mt-2 text-truncate">{{ item.name }}</div>
                  <div>
                    <span class="discounted-price text-danger fw-bold">
                      {{ item.variants?.[0]?.discountedPrice?.toLocaleString() }}₫
                    </span>
                    <span
                      v-if="item.variants?.[0]?.discountedPrice < item.variants?.[0]?.originalPrice"
                      class="original-price text-muted text-decoration-line-through ms-2"
                    >
                      {{ item.variants?.[0]?.originalPrice?.toLocaleString() }}₫
                    </span>
                  </div>
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

        <div v-else class="favorite-empty">
          <div class="favorite-empty-icon">
            <i class="bi bi-heart fs-3"></i>
          </div>
          <h2 class="favorite-empty-title">Chưa có sản phẩm yêu thích</h2>
          <p class="favorite-empty-message">
            Hãy thêm sản phẩm bạn yêu thích để dễ dàng mua sắm sau này!
          </p>
          <router-link to="/" class="favorite-start-btn">
            <i class="bi bi-bag me-2"></i>
            Khám phá ngay
          </router-link>
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
.card-img-top {
  height: 200px;
  object-fit: cover;
}

.product-item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.discount-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: red;
  color: white;
  padding: 2px 6px;
  font-size: 0.8rem;
  border-radius: 4px;
}

.product-name {
  position: relative;
  font-weight: 500;
}

.discounted-price {
  font-size: 1.1rem;
}

.original-price {
  font-size: 0.9rem;
}
</style>