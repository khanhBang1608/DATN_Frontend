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
        <div class="text-center mb-3">
          <h3 class="text-center mb-3 fw-bold">Danh Sách Yêu Thích</h3>
          <p class="text-muted">Quản lý sản phẩm bạn đã thêm vào danh sách yêu thích</p>
        </div>

        <div v-if="favoriteProducts.length > 0" class="container mt-5">
          <div class="row g-3">
            <div
              v-for="item in favoriteProducts"
              :key="item.id"
              class="col-6 col-sm-6 col-md-4"
            >
              <a
                href="#"
                class="product-link"
                @click.prevent="handleProductClick(item.product.productId)"
              >
                <div class="product-item">
                  <span class="discount-badge" v-if="getDiscount(item)">
                    -{{ getDiscount(item) }}%
                  </span>
                  <img
                    :src="getImageUrl(item.product.variants[0]?.imageName)"
                    class="img-fluid img-default"
                    :alt="item.product.name"
                  />
                  <img
                    :src="getImageUrl(item.product.variants[1]?.imageName)"
                    class="img-fluid img-hover"
                    :alt="item.product.name"
                  />
                </div>

                <div class="product-name">{{ item.product.name }}</div>

                <div>
                  <span class="discounted-price">
                    {{ getPrice(item)?.toLocaleString() }}₫
                  </span>
                  <span
                    class="original-price"
                    v-if="getOriginalPrice(item) > getPrice(item)"
                  >
                    {{ getOriginalPrice(item)?.toLocaleString() }}₫
                  </span>
                </div>
                <div class="view-count text-muted" style="font-size: 14px">
                  <i class="bi bi-bag-check me-1"></i
                  >{{ item.product.soldCount || 0 }} sản phẩm
                </div>

                <div class="product-rating">
                  <span v-for="i in 5" :key="i">
                    <i
                      class="bi"
                      :class="
                        i <= Math.round(item.product.averageRating || 0)
                          ? 'bi-star-fill text-warning'
                          : 'bi-star text-muted'
                      "
                    ></i>
                  </span>
                  <span class="ms-1 text-muted">
                    ({{ item.product.averageRating?.toFixed(1) || "0.0" }})
                  </span>
                </div>
              </a>
              <i
                class="bi bi-trash text-danger fs-5"
                style="cursor: pointer"
                @click="removeFromFavorite(item.product.productId)"
              >
              </i>
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

        <!-- <div v-if="message" class="alert alert-info text-center mt-3">
          {{ message }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { getFavorites, toggleFavorite } from "@/api/user/FavoriteAPI";
import { fetchAverageRating } from "@/api/ProductClient";
import promotionApi from "@/api/PromotionClien";

const router = useRouter();
const favoriteProducts = ref([]);
const message = ref("");

const loadFavorites = async () => {
  try {
    const favorites = await getFavorites();
    const activePromotions = await promotionApi.getActivePromotions();

    const promotionMap = new Map();
    activePromotions.forEach((promo) => {
      promo.productPromotions.forEach((pp) => {
        promotionMap.set(pp.productVariantId, promo);
      });
    });

    favoriteProducts.value = await Promise.all(
      favorites.map(async (item) => {
        const variant = item.product.variants?.[0];
        if (!variant) return item;

        // Handle promotions
        const promo = promotionMap.get(variant.productVariantId);
        if (promo) {
          const discountPercent = promo.discountAmount || 0;
          const originalPrice = variant.price;
          const discountedPrice = originalPrice * (1 - discountPercent / 100);
          item.product.originalPrice = originalPrice;
          variant.price = Math.round(discountedPrice);
          item.product.discount = discountPercent;
        }

        // Fetch average rating
        const rating = await fetchAverageRating(item.product.productId);
        item.product.averageRating = rating.data;

        // Fetch sold count
        const soldResponse = await axios.get(
          `/api/public/products/${item.product.productId}/sold-count`
        );
        item.product.soldCount = soldResponse.data.soldCount || 0;

        return item;
      })
    );

    message.value = "";
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: err.message || "Lỗi khi xoá sản phẩm yêu thích.",
      position: "topRight",
      timeout: 2000,
    });
  }
};

const removeFromFavorite = async (productId) => {
  try {
    const result = await toggleFavorite(productId);

    iziToast.success({
      title: "Thành công",
      message: result,
      position: "topRight",
      timeout: 2000,
    });

    await loadFavorites();
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: err.message || "Lỗi khi xoá sản phẩm yêu thích.",
      position: "topRight",
      timeout: 2000,
    });
  }
};

const getImageUrl = (imageName) => {
  return imageName ? `http://localhost:8080/images/${imageName}` : "/images/default.jpg";
};

const getDiscount = (item) => {
  const p = item.product.variants?.[0];
  const original = item.product.originalPrice;
  if (original && p?.price && original > p.price) {
    return Math.round(((original - p.price) / original) * 100);
  }
  return item.product.discount || 0; // Fallback to discount from promotion
};

const getPrice = (item) => item.product.variants?.[0]?.price || 0;
const getOriginalPrice = (item) => item.product.originalPrice || getPrice(item);

const handleProductClick = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post("/api/user/product-views/record", null, {
        params: { productId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    router.push(`/product-detail/${productId}`);
  } catch (error) {
    console.error("Lỗi khi ghi nhận lượt xem:", error);
    router.push(`/product-detail/${productId}`);
  }
};

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped>
/* Empty State */
.favorite-empty {
  text-align: center;
  padding: 80px 24px;
}

.favorite-empty-icon {
  width: 96px;
  height: 96px;
  background-color: #f3f4f6;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.favorite-empty-title {
  font-size: 1.5rem;
  color: #111827;
  font-weight: 600;
}

.favorite-empty-message {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 16px;
}

.favorite-start-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  background-color: #000;
  color: #fff;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.favorite-start-btn:hover {
  background-color: #1f2937;
  transform: translateY(-1px);
}
</style>
