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
              :key="item.productId"
              class="col-6 col-sm-6 col-md-4 col-lg-3"
            >
              <div class="product-item-wrapper position-relative">
                <RouterLink :to="`/product-detail/${item.productId}`" class="product-link">
                  <div class="product-item">
                    <span
                      v-if="item.variants?.[0]?.discountPercent > 0"
                      class="discount-badge"
                    >
                      -{{ item.variants[0].discountPercent }}%
                    </span>
                    <img
                      :src="getImageUrl(item.variants?.[0]?.imageName)"
                      class="img-fluid img-default"
                      :alt="item.name"
                    />
                    <img
                      :src="getImageUrl(item.variants?.[0]?.imageName)"
                      class="img-fluid img-hover"
                      :alt="item.name"
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
                  class="btn btn-sm btn-outline-danger w-100 mt-2"
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
  } catch (err) {
    message.value = err.message || "Lỗi khi tải danh sách yêu thích.";
  }
};

const removeFromFavorite = async (productId) => {
  try {
    const result = await toggleFavorite(productId);
    message.value = result;
    await loadFavorites(); // Cập nhật lại danh sách
  } catch (err) {
    message.value = err.message || "Lỗi khi xoá sản phẩm yêu thích.";
  }
};

const getImageUrl = (imageName) => {
  return imageName ? `/images/${imageName}` : "/images/default.png";
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
  font-size: 1rem;
  font-weight: 500;
}

.discounted-price {
  font-size: 1.1rem;
}

.original-price {
  font-size: 0.9rem;
}
</style>
