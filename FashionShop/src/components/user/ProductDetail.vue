<script setup>
import { ref, computed, onMounted, watch } from "vue";
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

// iziToast
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";

const product = ref({ variants: [] });
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
  updateImageSources,
} = userProductDetail(product);

const router = useRouter();
const route = useRoute();
const isFavorite = ref(false);
const favoriteCount = ref(0);
const selectedColorId = ref(null);
const selectedSizeId = ref(null);
const relatedProducts = ref([]);
const relatedPage = ref(0);
const relatedTotalPages = ref(1);

const goToPage = (page) => {
  if (page >= 0 && page < relatedTotalPages.value) {
    relatedPage.value = page;
    fetchRelatedProducts();
  }
};

const handleToggleFavorite = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    iziToast.warning({
      title: "Cảnh báo",
      message: "Bạn cần đăng nhập để yêu thích sản phẩm.",
      position: "topRight",
    });
    router.push({
      path: "/login",
      query: { redirect: route.fullPath },
    });
    return;
  }

  try {
    await toggleFavorite(product.value.productId);
    isFavorite.value = !isFavorite.value;
    const countRes = await getFavoriteCount(product.value.productId);
    favoriteCount.value = countRes.data.favoriteCount;
  } catch (err) {
    console.error("Lỗi khi thay đổi trạng thái yêu thích:", err);
    iziToast.error({
      title: "Lỗi",
      message: "Không thể thay đổi trạng thái yêu thích.",
      position: "topRight",
    });
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
    iziToast.warning({
      title: "Cảnh báo",
      message: "Bạn cần đăng nhập để thêm vào giỏ hàng.",
      position: "topRight",
    });
    router.push({
      path: "/login",
      query: { redirect: route.fullPath },
    });
    return;
  }

  if (!selectedColorId.value) {
    iziToast.warning({
      title: "Thiếu màu sắc",
      message: "Vui lòng chọn màu sắc trước.",
      position: "topRight",
    });
    return;
  }

  if (!selectedSizeId.value) {
    iziToast.warning({
      title: "Thiếu kích thước",
      message: "Vui lòng chọn kích thước trước.",
      position: "topRight",
    });
    return;
  }

  const variant = selectedVariant.value;
  if (!variant) {
    iziToast.error({
      title: "Lỗi",
      message: "Không tìm thấy biến thể phù hợp.",
      position: "topRight",
    });
    return;
  }

  try {
    await addToCart(variant.productVariantId, 1);
    iziToast.success({
      title: "Thành công",
      message: "Sản phẩm đã được thêm vào giỏ hàng!",
      position: "topRight",
    });
  } catch (error) {
    iziToast.error({
      title: "Thất bại",
      message: "Thêm vào giỏ hàng thất bại: " + (error.message || "Lỗi không xác định"),
      position: "topRight",
    });
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

const allSizes = computed(() => {
  const seen = new Set();
  return product.value.variants
    .map((v) => ({ sizeId: v.sizeId, sizeName: v.sizeName }))
    .filter((v) => {
      if (!seen.has(v.sizeId)) {
        seen.add(v.sizeId);
        return true;
      }
      return false;
    });
});

const uniqueSizes = computed(() => {
  if (!selectedColorId.value) return allSizes.value;
  return allSizes.value.map((size) => ({
    sizeId: size.sizeId,
    sizeName: size.sizeName,
  }));
});

const hasStock = (sizeId) => {
  const variant = product.value.variants.find(
    (v) => v.colorId === selectedColorId.value && v.sizeId === sizeId
  );
  return variant ? variant.stock > 0 : false;
};

const displayedStock = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.stock;
  }
  return product.value.variants.reduce((sum, v) => sum + v.stock, 0);
});

function getImageUrl(imageName) {
  return imageName ? `http://localhost:8080/images/${imageName}` : "/default.jpg";
}

// Hàm tải dữ liệu sản phẩm
const loadProductData = async (productId) => {
  try {
    const res = await getProductDetail(productId);
    const data = res.data;

    if (!data || Object.keys(data).length === 0) {
      router.push({ name: "NotFound" });
      return;
    }

    product.value = { ...data, variants: data.variants || [] };
    if (product.value.variants.length > 0) {
      selectedColorId.value = product.value.variants[0].colorId;
      selectedSizeId.value = null; // Reset size khi sản phẩm thay đổi
    }

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

    updateImageSources();

    const soldResponse = await axios.get(`/api/public/products/${productId}/sold-count`);
    product.value.soldCount = soldResponse.data.soldCount || 0;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const checkRes = await checkFavorite(productId);
        isFavorite.value = checkRes === true;
      } catch (err) {
        console.error("Lỗi khi kiểm tra yêu thích:", err);
      }
    }

    const countRes = await getFavoriteCount(productId);
    favoriteCount.value = countRes.data.favoriteCount;

    await fetchRelatedProducts();
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    router.push({ name: "NotFound" });
  }
};

const fetchRelatedProducts = async () => {
  try {
    const resRelated = await getRelatedProducts(
      product.value.categoryId,
      product.value.productId,
      relatedPage.value,
      4
    );

    const related = resRelated.data.content || [];
    relatedTotalPages.value = resRelated.data.totalPages || 1;

    const activePromotions = await promotionApi.getActivePromotions();
    const promotionMap = new Map();
    activePromotions.forEach((promo) => {
      promo.productPromotions.forEach((pp) => {
        promotionMap.set(pp.productVariantId, promo);
      });
    });

    relatedProducts.value = await Promise.all(
      related.map(async (product) => {
        if (!product.variants || product.variants.length === 0) {
          console.log(`Sản phẩm ${product.productId} không có biến thể`);
          return {
            ...product,
            variants: [
              { imageName: "fallback-image-default.jpg" },
              { imageName: "fallback-image-hover.jpg" },
            ],
          };
        }

        let minVariant = product.variants.find((v) => v.imageName) || product.variants[0];
        let hoverVariant =
          product.variants.find(
            (v) => v.imageName && v.imageName !== minVariant.imageName
          ) || minVariant;

        if (!hoverVariant.imageName || hoverVariant.imageName === minVariant.imageName) {
          hoverVariant = {
            ...minVariant,
            imageName: "fallback-image-hover.jpg",
          };
        }

        const promo = promotionMap.get(minVariant.productVariantId);
        if (promo) {
          const discountPercent = promo.discountAmount || 0;
          const originalPrice = minVariant.price;
          const discountedPrice = originalPrice * (1 - discountPercent / 100);
          product.originalPrice = originalPrice;
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

        product.variants = [minVariant, hoverVariant];

        const soldResponse = await axios.get(
          `/api/public/products/${product.productId}/sold-count`
        );
        product.soldCount = soldResponse.data.soldCount || 0;

        const rating = await fetchAverageRating(product.productId);
        product.averageRating = rating.data;

        return product;
      })
    );
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm liên quan:", err);
    relatedProducts.value = [];
  }
};

const handleProductClick = (productId) => {
  router.push(`/product-detail/${productId}`);
};

// Tải dữ liệu ban đầu
onMounted(() => {
  loadProductData(route.params.id);
});

// Theo dõi thay đổi route.params.id
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadProductData(newId);
    }
  }
);
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
          <div class="fw-semibold mb-2">
            Màu sắc:
            <span v-if="selectedColorId">
              {{
                uniqueColors.find((color) => color.colorId === selectedColorId)
                  ?.colorName || ""
              }}
            </span>
          </div>

          <div class="d-flex gap-2 py-2 flex-wrap">
            <div
              v-for="(color, index) in uniqueColors"
              :key="index"
              class="product-detail-color"
              :class="{ active: selectedColorId === color.colorId }"
              @click="
                selectedColorId = selectedColorId === color.colorId ? null : color.colorId
              "
            >
              {{ color.colorName }}
            </div>
          </div>
        </div>

        <!-- Kích thước -->
        <div class="mb-4">
          <div class="fw-semibold mb-2">
            Kích thước:
            <span v-if="selectedSizeId">
              {{
                uniqueSizes.find((size) => size.sizeId === selectedSizeId)?.sizeName || ""
              }}
            </span>
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <div
              v-for="(size, index) in uniqueSizes"
              :key="index"
              class="product-detail-size"
              :class="{
                active: selectedSizeId === size.sizeId,
                disabled: !hasStock(size.sizeId),
              }"
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
          <strong>Tình trạng kho: </strong>
          <span v-if="selectedVariant">
            Còn lại {{ displayedStock }} sản phẩm cho kích thước đã chọn
          </span>
          <span v-else> Tổng số lượng còn lại: {{ displayedStock }} sản phẩm </span>
        </div>

        <!-- Thêm vào giỏ -->
        <button
          class="btn product-detail-btn w-100 py-2 text-uppercase"
          @click="handleAddToCart"
        >
          Thêm vào giỏ hàng
        </button>

        <!-- Yêu thích & Tìm -->
        <div class="d-flex justify-content-between text-muted mt-2">
          <div @click="handleToggleFavorite" style="cursor: pointer">
            <i
              :class="isFavorite ? 'bi bi-heart-fill text-danger' : 'bi bi-heart me-1'"
            ></i>
            <span class="ms-1"> Đã thích ({{ favoriteCount }})</span>
          </div>
          <!-- <div><i class="bi bi-geo-alt me-1"></i> Tìm trong cửa hàng</div> -->
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
              <div v-html="product.description"></div>
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
              :src="
                getImageUrl(item.variants?.[0]?.imageName || 'fallback-image-default.jpg')
              "
              class="img-fluid img-default"
              :alt="`${item.name} Default`"
            />
            <img
              :src="
                getImageUrl(item.variants?.[1]?.imageName || 'fallback-image-hover.jpg')
              "
              class="img-fluid img-hover"
              :alt="`${item.name} Hover`"
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
      <!-- Phân trang cho sản phẩm liên quan -->
      <ul class="pagination mt-3" v-if="relatedTotalPages > 1">
        <!-- Trang trước -->
        <li
          class="pagination-item pagination-arrow"
          :class="{ 'pagination-disabled': relatedPage === 0 }"
          @click="goToPage(relatedPage - 1)"
        >
          &lt;
        </li>

        <!-- Danh sách số trang -->
        <li
          v-for="page in relatedTotalPages"
          :key="page"
          class="pagination-item"
          :class="{ 'pagination-active': relatedPage === page - 1 }"
          @click="goToPage(page - 1)"
        >
          {{ page }}
        </li>

        <!-- Trang sau -->
        <li
          class="pagination-item pagination-arrow"
          :class="{ 'pagination-disabled': relatedPage === relatedTotalPages - 1 }"
          @click="goToPage(relatedPage + 1)"
        >
          &gt;
        </li>
      </ul>
    </div>
  </div>

  <!-- Swiper Modal -->
  <div id="galleryModal" v-show="isModalOpen" @click="closeGallery">
    <div class="pd-modal-slider">
      <div class="swiper pd-modal-swiper">
        <div class="swiper-wrapper" ref="modalWrapper">
          <div class="swiper-slide" v-for="(src, index) in imageSources" :key="index">
            <img :src="src" :alt="'Hình ảnh gallery ' + index" loading="lazy" />
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

<style src="@/assets/css/product-detail.css"></style>
