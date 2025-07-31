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
<<<<<<<<< Temporary merge branch 1
                  <div class="product-name mt-2 text-truncate">{{ item.name }}</div>
                  <div>
                    <span class="discounted-price">
                      {{ getPrice(item)?.toLocaleString() }}₫
                    </span>
                    <span
                      v-if="
                        item.variants?.[0]?.discountedPrice <
                        item.variants?.[0]?.originalPrice
                      "
                      class="original-price text-muted text-decoration-line-through ms-2"
                    >
                      {{ item.variants?.[0]?.originalPrice?.toLocaleString() }}₫
                    </span>
                  </div>
=========
                  <div class="product-name text-truncate">{{ item.productName }}</div>
>>>>>>>>> Temporary merge branch 2
                </RouterLink>
                <button
                  class="btn btn-sm btn-outline-danger w-100 mt-2"
                  @click="removeFromFavorite(item.product.productId)"
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
import { useRouter } from "vue-router";
import axios from "axios";
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

    const token = localStorage.getItem("token");

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

        // Fetch view count (assuming viewCount is available in ProductEntity or via API)
        if (token) {
          try {
            const viewResponse = await axios.get("/api/user/product-views/recent", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const viewItem = viewResponse.data.find(
              (view) => view.product?.[0]?.productId === item.product.productId
            );
            item.product.viewCount = viewItem ? viewItem.product[0].viewCount || 0 : 0;
          } catch (error) {
            console.error("Lỗi khi lấy lượt xem:", error);
            item.product.viewCount = 0;
          }
        } else {
          item.product.viewCount = 0;
        }

        return item;
      })
    );

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
<<<<<<<<< Temporary merge branch 1
.product-item {
  position: relative;
  overflow: hidden;
  height: 360px;
}

.product-item img {
  height: 360px;
  width: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.4s ease;
  position: absolute;
  top: 0;
  left: 0;
}

.img-hover {
  opacity: 0;
  z-index: 2;
}

.product-item:hover .img-hover {
  opacity: 1;
}

.product-item:hover .img-default {
  opacity: 0;
}

.discount-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  background: white;
  color: red;
  font-weight: bold;
  padding: 5px 10px;
  font-size: 14px;
  z-index: 3;
=========
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
>>>>>>>>> Temporary merge branch 2
}

.product-name {
  position: relative;
  font-weight: 500;
<<<<<<<<< Temporary merge branch 1
  margin-top: 8px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  margin-left: 8px;
}

.discounted-price {
  font-size: 1.1rem;
}

.original-price {
  font-size: 0.9rem;
}
</style>
=========
  text-align: center;
  padding: 0 0.5rem; 
}

</style>
>>>>>>>>> Temporary merge branch 2
