<template>
  <div>
    <!-- Danh mục -->
    <div class="scroll-wrapper mt-3" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
      <div class="scroll-content" ref="scrollContent">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="product-category"
        >
          <a href="#" class="product-link">
            <img
              :src="category.image"
              :alt="category.alt"
              class="product-image"
              onerror="this.onerror=null;this.src='https://placehold.co/150x150?text=Image+Not+Found';"
            />
            <div class="product-title">{{ category.title }}</div>
          </a>
        </div>
      </div>
    </div>

    <!-- Sản phẩm mới -->
    <div class="product-content-wrapper">
      <div class="container mt-5">
        <h3 class="text-center mb-4 fw-bold">TOP 10 SẢN PHẨM MỚI NHẤT</h3>
        <div class="row g-3">
          <template v-for="product in topNewestProducts" :key="product.productId">
            <div
              v-if="product.variants && product.variants.length > 0"
              class="col-6 col-sm-6 col-md-4 col-lg-3"
            >
              <a
                href="#"
                class="product-link"
                @click.prevent="handleProductClick(product.productId)"
              >
                <div class="product-item">
                  <span class="discount-badge" v-if="product.discount">
                    -{{ product.discount }}%
                  </span>
                  <img
                    :src="
                      product.variants[0]?.imageName
                        ? `http://localhost:8080/images/${product.variants[0].imageName}`
                        : '/default.jpg'
                    "
                    class="img-fluid img-default"
                    :alt="`${product.name} Hover`"
                  />
                  <img
                    :src="
                      product.variants[1]?.imageName
                        ? `http://localhost:8080/images/${product.variants[1].imageName}`
                        : '/default.jpg'
                    "
                    class="img-fluid img-hover"
                    :alt="`${product.name} Hover`"
                  />
                </div>
                <div class="product-name">{{ product.name }}</div>
                <div>
                  <span class="discounted-price">
                    {{
                      product.variants[0]?.price ? product.variants[0].price.toLocaleString() : '0'
                    }}₫
                  </span>
                  <span
                    class="original-price"
                    v-if="
                      product.originalPrice && product.originalPrice > product.variants[0]?.price
                    "
                  >
                    {{ product.originalPrice.toLocaleString() }}₫
                  </span>
                </div>
                <div class="product-rating">
                  <span v-for="i in 5" :key="i">
                    <i
                      class="bi"
                      :class="
                        i <= Math.round(product.averageRating || 0)
                          ? 'bi-star-fill text-warning'
                          : 'bi-star text-muted'
                      "
                    ></i>
                  </span>
                  <span class="ms-1 text-muted"
                    >({{ product.averageRating?.toFixed(1) || '0.0' }})</span
                  >
                </div>
                <div class="sold-count text-muted" style="font-size: 14px">
                  Đã bán: {{ product.soldCount || 0 }} sản phẩm
                </div>
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Bộ sưu tập -->
    <section class="dreams-section">
      <div class="row align-items-center">
        <div class="col-12 col-md-6 dreams-image">
          <a href="#">
            <img
              src="https://placehold.co/700x500?text=City+Crosswalk+View"
              alt="Aerial view of a busy pedestrian crosswalk"
            />
          </a>
        </div>
        <div class="col-12 col-md-6 dreams-text">
          <a href="#" style="text-decoration: none; color: inherit">
            <h2>GIẤC MƠ NGỌT NGÀO</h2>
            <p>
              Bộ sưu tập này là sự giao thoa giữa tinh thần bay bổng của L'hex và vẻ dễ
              thương vượt thời gian của Hello Kitty. Từng thiết kế là một lời nhắc dịu
              dàng rằng: yêu thương, tình bạn và trí tưởng tượng chính là những gam màu
              đẹp nhất của cuộc sống.
            </p>
          </a>
          <a href="#" class="dreams-btn">XEM THÊM</a>
        </div>
      </div>
    </section>

    <!-- Top 50 sản phẩm bán chạy -->
    <div class="product-content-wrapper">
      <div class="container mt-5">
        <h3 class="text-center mb-4 fw-bold">TOP SẢN PHẨM BÁN CHẠY NHẤT</h3>
        <div class="row g-3">
          <template v-for="product in topBestSellingProducts" :key="product.productId">
            <div
              v-if="product.variants && product.variants.length > 0"
              class="col-6 col-sm-6 col-md-4 col-lg-3"
            >
              <a
                href="#"
                class="product-link"
                @click.prevent="handleProductClick(product.productId)"
              >
                <div class="product-item">
                  <span class="discount-badge" v-if="product.discount">
                    -{{ product.discount }}%
                  </span>
                  <img
                    :src="
                      product.variants[0]?.imageName
                        ? `http://localhost:8080/images/${product.variants[0].imageName}`
                        : '/default.jpg'
                    "
                    class="img-fluid img-default"
                    :alt="`${product.name} Hover`"
                  />
                  <img
                    :src="
                      product.variants[1]?.imageName
                        ? `http://localhost:8080/images/${product.variants[1].imageName}`
                        : '/default.jpg'
                    "
                    class="img-fluid img-hover"
                    :alt="`${product.name} Hover`"
                  />
                </div>
                <div class="product-name">{{ product.name }}</div>
                <div>
                  <span class="discounted-price">
                    {{
                      product.variants[0]?.price ? product.variants[0].price.toLocaleString() : '0'
                    }}₫
                  </span>
                  <span
                    class="original-price"
                    v-if="
                      product.originalPrice && product.originalPrice > product.variants[0]?.price
                    "
                  >
                    {{ product.originalPrice.toLocaleString() }}₫
                  </span>
                </div>
                <div class="product-rating">
                  <span v-for="i in 5" :key="i">
                    <i
                      class="bi"
                      :class="
                        i <= Math.round(product.averageRating || 0)
                          ? 'bi-star-fill text-warning'
                          : 'bi-star text-muted'
                      "
                    ></i>
                  </span>
                  <span class="ms-1 text-muted"
                    >({{ product.averageRating?.toFixed(1) || '0.0' }})</span
                  >
                </div>
                <div class="sold-count text-muted" style="font-size: 14px">
                  Đã bán: {{ product.soldCount || 0 }} sản phẩm
                </div>
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Đã xem gần đây -->
    <div class="product-content-wrapper">
      <div class="container mt-5">
        <h3 class="text-center mb-4 fw-bold">ĐÃ XEM GẦN ĐÂY</h3>
        <div class="row g-3">
          <template v-for="product in recentViewedProducts" :key="product.productId">
            <div
              v-if="product.variants && product.variants.length > 0"
              class="col-6 col-sm-6 col-md-4 col-lg-3"
            >
              <a
                href="#"
                class="product-link"
                @click.prevent="handleProductClick(product.productId)"
              >
                <div class="product-item">
                  <span class="discount-badge" v-if="product.discount">
                    -{{ product.discount }}%
                  </span>
                  <img
                    :src="
                      product.variants[0]?.imageName
                        ? `http://localhost:8080/images/${product.variants[0].imageName}`
                        : '/default.jpg'
                    "
                    class="img-fluid img-default"
                    :alt="`${product.name} Hover`"
                  />
                  <img
                    :src="
                      product.variants[1]?.imageName
                        ? `http://localhost:8080/images/${product.variants[1].imageName}`
                        : '/default.jpg'
                    "
                    class="img-fluid img-hover"
                    :alt="`${product.name} Hover`"
                  />
                </div>
                <div class="product-name">{{ product.name }}</div>
                <div>
                  <span class="discounted-price">
                    {{
                      product.variants[0]?.price ? product.variants[0].price.toLocaleString() : '0'
                    }}₫
                  </span>
                  <span
                    class="original-price"
                    v-if="
                      product.originalPrice && product.originalPrice > product.variants[0]?.price
                    "
                  >
                    {{ product.originalPrice.toLocaleString() }}₫
                  </span>
                </div>
                <div class="product-rating">
                  <span v-for="i in 5" :key="i">
                    <i
                      class="bi"
                      :class="
                        i <= Math.round(product.averageRating || 0)
                          ? 'bi-star-fill text-warning'
                          : 'bi-star text-muted'
                      "
                    ></i>
                  </span>
                  <span class="ms-1 text-muted"
                    >({{ product.averageRating?.toFixed(1) || '0.0' }})</span
                  >
                </div>
                <div class="view-count text-muted" style="font-size: 14px">
                  Đã xem: {{ product.viewCount || 0 }} lần
                </div>
                <div class="sold-count text-muted" style="font-size: 14px">
                  Đã bán: {{ product.soldCount || 0 }} sản phẩm
                </div>
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";
import { categories, useScrollCategory } from "@/assets/js/scrollcategory.js";
import { fetchAverageRating } from '@/api/ProductClient';
import promotionApi from '@/api/PromotionClien';

// Khởi tạo các ref
const scrollContent = ref(null);
const { pauseScroll, resumeScroll } = useScrollCategory(scrollContent);
const topNewestProducts = ref([]);
const recentViewedProducts = ref([]);
const topBestSellingProducts = ref([]);

// Hàm xử lý khi click vào sản phẩm
const router = useRouter();
const handleProductClick = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post("/api/user/product-views/record", null, {
        params: { productId },
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchRecentViews();
    }
    router.push(`/product-detail/${productId}`);
  } catch (error) {
    console.error("Lỗi khi ghi nhận lượt xem:", error);
    router.push(`/product-detail/${productId}`);
  }
};

// Hàm xử lý khuyến mãi, đánh giá và số lượng bán
const processProducts = async (products) => {
  try {
    const activePromotions = await promotionApi.getActivePromotions();
    const promotionMap = new Map();
    activePromotions.forEach((promo) => {
      promo.productPromotions.forEach((pp) => {
        promotionMap.set(pp.productVariantId, promo);
      });
    });

    return await Promise.all(
      products.map(async (product) => {
        if (!product.variants || product.variants.length === 0) return product;

        let minVariant = product.variants.reduce((min, v) =>
          v.price < min.price ? v : min, product.variants[0]);

        const promo = promotionMap.get(minVariant.productVariantId);
        if (promo) {
          const discountPercent = promo.discountAmount || 0;
          const originalPrice = minVariant.price;
          const discountedPrice = originalPrice * (1 - discountPercent / 100);
          product.originalPrice = originalPrice;
          minVariant = { ...minVariant, price: Math.round(discountedPrice) };
          product.discount = discountPercent;
        }

        const rating = await fetchAverageRating(product.productId);
        product.averageRating = rating.data;

        // Gọi API mới để lấy số lượng đã bán
        const soldResponse = await axios.get(`/api/public/products/${product.productId}/sold-count`);
        product.soldCount = soldResponse.data.soldCount || 0;

        product.variants = [minVariant, ...product.variants.filter((v) => v !== minVariant)];
        return product;
      })
    );
  } catch (err) {
    console.error('Lỗi khi xử lý sản phẩm:', err);
    return products;
  }
};

// Hàm lấy sản phẩm mới nhất
const fetchTopNewestProducts = async () => {
  try {
    const response = await axios.get("/api/public/products/top10");
    topNewestProducts.value = await processProducts(
      response.data.filter(
        (product) =>
          product.variants &&
          product.variants.length > 0 &&
          product.variants[0]?.price !== undefined
      )
    );
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm mới nhất:", error);
  }
};

// Hàm lấy sản phẩm đã xem gần đây
const fetchRecentViews = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await axios.get("/api/user/product-views/recent", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(response.data)) {
      const seen = new Map();
      response.data.forEach((item) => {
        const product = item.product?.[0];
        const variant = product?.variants?.[0];
        if (
          product?.productId &&
          !seen.has(product.productId) &&
          product.variants &&
          product.variants.length > 0 &&
          variant?.price !== undefined
        ) {
          seen.set(product.productId, {
            productId: product.productId,
            name: product.name,
            variants: [variant],
            viewCount: product.viewCount || 0,
          });
        }
      });
      recentViewedProducts.value = await processProducts(Array.from(seen.values()));
    }
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm đã xem gần đây:", error);
  }
};

// Hàm lấy top 50 sản phẩm bán chạy
const fetchTopBestSellingProducts = async () => {
  try {
    const response = await axios.get("/api/public/top50-products");
    topBestSellingProducts.value = await processProducts(
      response.data.filter(
        (product) =>
          product.variants &&
          product.variants.length > 0 &&
          product.variants[0]?.price !== undefined
      )
    );
  } catch (error) {
    console.error("Lỗi khi lấy top 50 sản phẩm bán chạy:", error);
  }
};

// onMounted hook
onMounted(async () => {
  await fetchTopNewestProducts();
  await fetchRecentViews();
  await fetchTopBestSellingProducts();
  await nextTick();
});

// onBeforeUnmount hook
onBeforeUnmount(() => {
  // Không cần xóa sự kiện vì không sử dụng Swiper
});
</script>

<style src="./src/assets/css/product.css"></style>

