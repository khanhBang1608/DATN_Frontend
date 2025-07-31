<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getProductDetail,
  getRelatedProducts,
  getFavoriteCount,
  fetchAverageRating,
} from "@/api/ProductClient";
import ReviewComponent from "@/components/user/Review.vue";
import promotionApi from "@/api/PromotionClien";
import { toggleFavorite, checkFavorite } from "@/api/user/FavoriteAPI";
import { addToCart } from "@/api/user/cartAPI";
import axios from "axios";
import { userProductDetail } from "@/assets/js/userProductDetail";

const {
  imageSources,
  currentIndex,
  isModalOpen,
  isMobile,
  scrollArea,
  modalWrapper,
  scrollToImage,
  openCurrentGallery,
  closeGallery,
  swiperSlidePrev,
  swiperSlideNext,
} = userProductDetail();

const router = useRouter();
const route = useRoute();
const isFavorite = ref(false);
const favoriteCount = ref(0);
const product = ref({ variants: [] });
const selectedColorId = ref(null);
const selectedSizeId = ref(null);
const relatedProducts = ref([]);

const handleToggleFavorite = async () => {
  try {
    await toggleFavorite(product.value.productId);
    isFavorite.value = !isFavorite.value;
    const countRes = await getFavoriteCount(product.value.productId);
    favoriteCount.value = countRes.data.favoriteCount;
  } catch (err) {
    console.error("Lỗi khi thay đổi trạng thái yêu thích:", err);
  }
};

const displayedPrice = computed(() => {
  if (!product.value.variants || product.value.variants.length === 0)
    return { price: 0, originalPrice: 0 };

  if (selectedColorId.value && selectedSizeId.value) {
    const match = product.value.variants.find(
      (v) => v.colorId === selectedColorId.value && v.sizeId === selectedSizeId.value
    );
    if (match) {
      const price = match.discountedPrice ?? match.price;
      const original = match.originalPrice ?? match.price;
      return { price, originalPrice: original };
    }
  }

  let minVariant = product.value.variants[0];
  let minPrice = minVariant.discountedPrice ?? minVariant.price;

  product.value.variants.forEach((v) => {
    const effectivePrice = v.discountedPrice ?? v.price;
    if (effectivePrice < minPrice) {
      minPrice = effectivePrice;
      minVariant = v;
    }
  });

  return {
    price: minVariant.discountedPrice ?? minVariant.price,
    originalPrice: minVariant.originalPrice ?? minVariant.price,
  };
});

const selectedVariant = computed(() => {
  return product.value.variants.find(
    (v) => v.colorId === selectedColorId.value && v.sizeId === selectedSizeId.value
  );
});

const handleAddToCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("⚠️ Bạn cần đăng nhập để thêm vào giỏ hàng.");
    router.push("/login");
    return;
  }

  if (!selectedColorId.value || !selectedSizeId.value) {
    alert("⚠️ Vui lòng chọn đầy đủ màu sắc và kích thước.");
    return;
  }

  const variant = selectedVariant.value;
  if (!variant) {
    alert("❌ Không tìm thấy biến thể phù hợp.");
    return;
  }

  try {
    await addToCart(variant.productVariantId, 1);
    alert("✅ Sản phẩm đã được thêm vào giỏ hàng!");
  } catch (error) {
    alert("❌ Thêm vào giỏ hàng thất bại: " + (error.message || "Lỗi không xác định"));
    console.error(error);
  }
};

const uniqueColors = computed(() => {
  const seen = new Set();
  return product.value.variants.filter((v) => {
    if (!seen.has(v.colorId)) {
      seen.add(v.colorId);
      return true;
    }
    return false;
  });
});

const uniqueSizes = computed(() => {
  const seen = new Set();
  return product.value.variants.filter((v) => {
    if (selectedColorId.value && v.colorId !== selectedColorId.value) return false;
    if (!seen.has(v.sizeId)) {
      seen.add(v.sizeId);
      return true;
    }
    return false;
  });
});

const displayedStock = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.stock;
  }
  return product.value.variants.reduce((sum, v) => sum + v.stock, 0);
});

function getImageUrl(imageName) {
  return imageName ? `http://localhost:8080/images/${imageName}` : "/default.jpg";
}

onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await getProductDetail(id);
    const data = res.data;

    const promos = await promotionApi.getActivePromotions();
    const promotionMap = new Map();
    promos.forEach((promo) => {
      promo.productPromotions.forEach((pp) => {
        promotionMap.set(pp.productVariantId, promo);
      });
    });

    data.variants = data.variants.map((v) => {
      const promo = promotionMap.get(v.productVariantId);
      if (promo) {
        const discountPercent = promo.discountAmount || 0;
        const originalPrice = v.price;
        const discountedPrice = originalPrice * (1 - discountPercent / 100);

        return {
          ...v,
          originalPrice: originalPrice,
          discountedPrice: Math.round(discountedPrice),
          discountPercent: discountPercent,
        };
      }
      return {
        ...v,
        originalPrice: v.price,
        discountedPrice: v.price,
        discountPercent: 0,
      };
    });

    // Fetch sold count for the main product
    const soldResponse = await axios.get(`/api/public/products/${id}/sold-count`);
    data.soldCount = soldResponse.data.soldCount || 0;

    product.value = data;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const checkRes = await checkFavorite(product.value.productId);
        isFavorite.value = checkRes === true;
      } catch (err) {
        console.error("Lỗi khi kiểm tra yêu thích:", err);
      }
    }

    try {
      const countRes = await getFavoriteCount(id);
      favoriteCount.value = countRes.data.favoriteCount;

      const resRelated = await getRelatedProducts(id, data.categoryId);
      const related = resRelated.data;

      relatedProducts.value = await Promise.all(
        related.map(async (prod) => {
          let minVariant = prod.variants.reduce(
            (min, v) =>
              (v.discountedPrice ?? v.price) < (min.discountedPrice ?? min.price)
                ? v
                : min,
            prod.variants[0]
          );

          const promo = promotionMap.get(minVariant.productVariantId);
          if (promo) {
            const discountPercent = promo.discountAmount || 0;
            const originalPrice = minVariant.price;
            const discountedPrice = originalPrice * (1 - discountPercent / 100);
            prod.originalPrice = originalPrice;
            minVariant = {
              ...minVariant,
              originalPrice: originalPrice,
              discountedPrice: Math.round(discountedPrice),
              discountPercent: discountPercent,
            };
          } else {
            minVariant = {
              ...minVariant,
              originalPrice: minVariant.price,
              discountedPrice: minVariant.price,
              discountPercent: 0,
            };
          }

          // Fetch average rating
          const rating = await fetchAverageRating(prod.productId);
          prod.averageRating = rating.data;

          // Fetch sold count
          const soldResponse = await axios.get(
            `/api/public/products/${prod.productId}/sold-count`
          );
          prod.soldCount = soldResponse.data.soldCount || 0;

          // Fetch view count
          prod.viewCount = 0;
          if (token) {
            try {
              const viewResponse = await axios.get("/api/user/product-views/recent", {
                headers: { Authorization: `Bearer ${token}` },
              });
              const viewItem = viewResponse.data.find(
                (view) => view.product?.[0]?.productId === prod.productId
              );
              prod.viewCount = viewItem ? viewItem.product[0].viewCount || 0 : 0;
            } catch (error) {
              console.error("Lỗi khi lấy lượt xem:", error);
            }
          }

          prod.variants = [minVariant, ...prod.variants.filter((v) => v !== minVariant)];
          return prod;
        })
      );
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm liên quan:", err);
    }
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
});
</script>

<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Chi tiết sản phẩm</a
      >
    </nav>
  </div>
  <div class="container py-5 mt-3">
    <div class="row">
      <div class="col-md-6">
        <div class="product-detail-gallery">
          <div class="product-detail-thumbnails" v-if="!isMobile">
            <img
              v-for="(src, index) in imageSources"
              :key="index"
              :src="src"
              :class="{ active: currentIndex === index }"
              @click="scrollToImage(index)"
              loading="lazy"
            />
          </div>

          <div class="product-detail-scroll-wrapper position-relative" v-if="!isMobile">
            <div class="product-detail-scroll-area" ref="scrollArea">
              <div class="product-detail-large-images">
                <div
                  v-for="(src, index) in imageSources"
                  :key="index"
                  class="product-detail-zoom-container"
                >
                  <img :src="src" :id="'img' + index" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          <div
            class="product-detail-fullscreen-icon d-flex justify-content-center"
            v-if="!isMobile"
            @click="openCurrentGallery"
          >
            <i class="bi bi-arrows-fullscreen"></i>
          </div>

          <!-- Mobile Swiper -->
          <div class="pd-mobile-swiper" v-if="isMobile">
            <div class="swiper pd-mobile-swiper-core">
              <div class="swiper-wrapper">
                <div
                  class="swiper-slide"
                  v-for="(src, index) in imageSources"
                  :key="index"
                >
                  <img :src="src" class="img-fluid" />
                </div>
              </div>
              <div class="swiper-pagination pd-mobile-swiper-pagination"></div>
            </div>
            <button class="pd-scroll-btn pd-scroll-left" @click="swiperSlidePrev">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button class="pd-scroll-btn pd-scroll-right" @click="swiperSlideNext">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <h4 class="fw-bold fs-4">
          <span class="text-muted"> {{ product.name }}</span>
        </h4>
        <div class="price fs-4 fw-bold mb-4">
          <span class="text-danger"> {{ displayedPrice.price.toLocaleString() }}₫ </span>
          <span
            class="text-muted text-decoration-line-through ms-2"
            v-if="displayedPrice.originalPrice > displayedPrice.price"
          >
            {{ displayedPrice.originalPrice.toLocaleString() }}₫
          </span>
          <div class="sold-count text-muted mt-1" style="font-size: 14px">
            <i class="bi bi-bag-check me-1"></i>{{ product.soldCount || 0 }} sản phẩm
          </div>
        </div>

        <hr class="product-detail-divider" />

        <!-- Màu sắc -->
        <div class="mb-4">
          <div class="mb-1">
            <div class="fw-semibold">Màu sắc:</div>
            <div class="color-options-wrapper">
              <div class="d-flex gap-2 flex-wrap" style="margin-left: 0">
                <div
                  v-for="(color, index) in uniqueColors"
                  :key="index"
                  class="color-option"
                  :class="{ selected: selectedColorId === color.colorId }"
                  @click="
                    selectedColorId =
                      selectedColorId === color.colorId ? null : color.colorId
                  "
                >
                  <span class="color-name">{{ color.colorName }}</span>
                  <span v-if="selectedColorId === color.colorId" class="check-mark"
                    >✓</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kích thước -->
        <div class="mb-4">
          <div class="fw-semibold mb-2">Kích thước:</div>
          <div class="d-flex gap-2 py-2 flex-wrap">
            <div
              v-for="(size, index) in uniqueSizes"
              :key="index"
              class="product-detail-size"
              :class="{ active: selectedSizeId === size.sizeId }"
              @click="
                selectedSizeId = selectedSizeId === size.sizeId ? null : size.sizeId
              "
            >
              {{ size.sizeName }}
            </div>
          </div>
          <hr class="product-detail-divider" />
        </div>

        <div class="mb-4">
          <strong>Số lượng còn lại: </strong>
          <span v-if="selectedVariant">
            {{ displayedStock }} sản phẩm (biến thể đã chọn)
          </span>
          <span v-else> {{ displayedStock }} sản phẩm (tổng toàn bộ biến thể) </span>
        </div>

        <!-- Thêm vào giỏ -->
        <button
          class="btn product-detail-btn w-100 py-2 text-uppercase"
          @click="handleAddToCart"
        >
          Thêm vào giỏ hàng
        </button>

        <!-- Yêu thích & Tìm -->
        <div class="d-flex justify-content-between text-muted small fs-5 mt-2">
          <div @click="handleToggleFavorite" style="cursor: pointer">
            <i
              :class="isFavorite ? 'bi bi-heart-fill text-danger' : 'bi bi-heart me-1'"
            ></i>
            <span class="ms-1"> Đã thích ({{ favoriteCount }})</span>
          </div>
          <div><i class="bi bi-geo-alt me-1"></i> Tìm trong cửa hàng</div>
        </div>
        <hr class="product-detail-divider" />

        <!-- Mô tả sản phẩm -->
        <div class="mb-4">
          <ul class="nav nav-tabs mb-3" id="productTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="desc-tab"
                data-bs-toggle="tab"
                data-bs-target="#desc"
                type="button"
                role="tab"
              >
                Mô tả
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="size-tab"
                data-bs-toggle="tab"
                data-bs-target="#size"
                type="button"
                role="tab"
              >
                Bảng kích thước
              </button>
            </li>
          </ul>
          <div class="tab-content" id="productTabContent">
            <div class="tab-pane fade show active" id="desc" role="tabpanel">
              <h5 class="fw-bold mb-2">Mô tả</h5>
              <p>
                {{ product.description }}
              </p>
            </div>
            <div class="tab-pane fade" id="size" role="tabpanel">
              <div class="text-center">
                <img
                  :src="getImageUrl(product.variants[0]?.imageName)"
                  class="img-fluid img-hover"
                  :alt="product.name + ' Hover'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ĐÁNH GIÁ KHÁCH HÀNG -->
    <ReviewComponent :productId="product.productId" />
  </div>

  <div v-if="relatedProducts.length > 0" class="container mb-3">
    <h4 class="text-center mt-4 fw-bold">SẢN PHẨM LIÊN QUAN</h4>
    <div class="row g-3 mt-3">
      <div
        v-for="item in relatedProducts"
        :key="item.productId"
        class="col-6 col-sm-6 col-md-4 col-lg-3"
      >
        <RouterLink
          :to="`/product-detail/${item.productId}`"
          class="product-link"
          @click.prevent="handleProductClick(item.productId)"
        >
          <div class="product-item position-relative">
            <span v-if="item.variants?.[0]?.discountPercent > 0" class="discount-badge">
              -{{ item.variants[0].discountPercent }}%
            </span>
            <img
              :src="getImageUrl(item.variants?.[0]?.imageName)"
              class="img-fluid img-default"
              :alt="item.name"
            />
            <img
              :src="
                getImageUrl(item.variants?.[1]?.imageName) ||
                getImageUrl(item.variants?.[0]?.imageName)
              "
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
              v-if="
                item.variants?.[0]?.discountedPrice < item.variants?.[0]?.originalPrice
              "
              class="original-price text-muted text-decoration-line-through ms-2"
            >
              {{ item.variants?.[0]?.originalPrice?.toLocaleString() }}₫
            </span>
          </div>
          <div class="product-rating">
            <span v-for="i in 5" :key="i">
              <i
                class="bi"
                :class="
                  i <= Math.round(item.averageRating || 0)
                    ? 'bi-star-fill text-warning'
                    : 'bi-star text-muted'
                "
              ></i>
            </span>
            <span class="ms-1 text-muted">
              ({{ item.averageRating?.toFixed(1) || "0.0" }})
            </span>
          </div>
          <div class="view-count text-muted" style="font-size: 14px">
            <i class="bi bi-eye me-1"></i>{{ item.viewCount || 0 }} lần
          </div>
          <div class="sold-count text-muted" style="font-size: 14px">
            <i class="bi bi-cart me-1"></i>{{ item.soldCount || 0 }} sản phẩm
          </div>
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- Swiper Modal -->
  <div id="galleryModal" v-show="isModalOpen" @click="closeGallery">
    <div class="pd-modal-slider">
      <div class="swiper pd-modal-swiper">
        <div class="swiper-wrapper" ref="modalWrapper">
          <div class="swiper-slide" v-for="(src, index) in imageSources" :key="index">
            <img :src="src" :alt="'Hình ảnh gallery ' + index" />
          </div>
        </div>
        <div class="swiper-button-next pd-modal-swiper-next"></div>
        <div class="swiper-button-prev pd-modal-swiper-prev"></div>
        <div class="swiper-pagination pd-modal-swiper-pagination"></div>
      </div>
      <span class="pd-modal-close-btn" @click="closeGallery">&times;</span>
    </div>
  </div>
</template>

<style>
.color-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 40px;
  border: 0.5px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  padding: 5px;
}

.color-option:hover {
  transform: scale(1.05);
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-option.selected {
  border-color: #007bff;
  background-color: #e7f0ff;
}

.color-name {
  margin-right: 5px;
}

.check-mark {
  color: #007bff;
  font-weight: bold;
}

.color-options-wrapper {
  margin-left: 0;
}
</style>

<style src="@/assets/css/product-detail.css"></style>
