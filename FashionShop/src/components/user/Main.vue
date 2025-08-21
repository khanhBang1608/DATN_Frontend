```vue
<template>
  <div>
    <!-- Sản phẩm mới -->
    <div class="product-content-wrapper">
      <div class="container mt-5">
        <h3 class="text-center mb-4 fw-bold">TOP 8 SẢN PHẨM MỚI NHẤT</h3>
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
                    :src="getImageUrl(product.variants[0]?.imageName)"
                    class="img-fluid img-default"
                    :alt="`${product.name} Default`"
                  />
                  <img
                    :src="getImageUrl(product.variants[1]?.imageName)"
                    class="img-fluid img-hover"
                    :alt="`${product.name} Hover`"
                  />
                </div>
                <div class="product-name">{{ product.name }}</div>
                <div>
                  <span class="discounted-price">
                    {{
                      product.variants[0]?.price
                        ? product.variants[0].price.toLocaleString()
                        : "0"
                    }}₫
                  </span>
                  <span
                    class="original-price"
                    v-if="
                      product.originalPrice &&
                      product.originalPrice > product.variants[0]?.price
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
                    >({{ product.averageRating?.toFixed(1) || "0.0" }})</span
                  >
                </div>
                <div class="sold-count text-muted" style="font-size: 14px">
                  <i class="bi bi-bag-check me-1"></i>{{ product.soldCount || 0 }} sản
                  phẩm
                </div>
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>

    <section class="dreams-section">
      <div class="row align-items-center">
        <div class="col-12 col-md-6 dreams-image">
          <a href="#">
            <img
              src="https://placehold.co/700x500?text=Fashion+Store+L'hex"
              alt="Cửa hàng thời trang L'hex"
            />
          </a>
        </div>
        <div class="col-12 col-md-6 dreams-text">
          <a href="#" style="text-decoration: none; color: inherit">
            <h2>CHÀO MỪNG ĐẾN VỚI L'HEX</h2>
            <p>
              L'hex là thương hiệu thời trang mang phong cách hiện đại, trẻ trung và tinh
              tế. Chúng tôi mang đến cho bạn những bộ sưu tập độc đáo, kết hợp giữa thiết
              kế sáng tạo và chất lượng cao cấp. Mỗi sản phẩm của L'hex không chỉ là trang
              phục, mà còn là một phần của phong cách sống – tự tin, năng động và khác
              biệt.
            </p>
          </a>
          <a href="#" class="dreams-btn">KHÁM PHÁ NGAY</a>
        </div>
      </div>
    </section>

    <!-- Top sản phẩm bán chạy có phân trang -->
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
                    :src="getImageUrl(product.variants[0]?.imageName)"
                    class="img-fluid img-default"
                    :alt="`${product.name} Default`"
                  />
                  <img
                    :src="getImageUrl(product.variants[1]?.imageName)"
                    class="img-fluid img-hover"
                    :alt="`${product.name} Hover`"
                  />
                </div>
                <div class="product-name">{{ product.name }}</div>
                <div>
                  <span class="discounted-price">
                    {{
                      product.variants[0]?.price
                        ? product.variants[0].price.toLocaleString()
                        : "0"
                    }}₫
                  </span>
                  <span
                    class="original-price"
                    v-if="
                      product.originalPrice &&
                      product.originalPrice > product.variants[0]?.price
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
                  <span class="ms-1 text-muted">
                    ({{ product.averageRating?.toFixed(1) || "0.0" }})
                  </span>
                </div>
                <div class="sold-count text-muted" style="font-size: 14px">
                  <i class="bi bi-bag-check me-1"></i>{{ product.soldCount || 0 }} sản
                  phẩm
                </div>
              </a>
            </div>
          </template>
        </div>
        <nav class="mt-4 d-flex justify-content-center" v-if="totalPages > 1">
          <ul class="pagination mt-3">
            <li
              class="pagination-item pagination-arrow"
              :class="{ 'pagination-disabled': currentPage === 0 }"
              @click="fetchTopBestSellingProducts(currentPage - 1)"
            >
              &lt;
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="pagination-item"
              :class="{ 'pagination-active': page - 1 === currentPage }"
              @click="fetchTopBestSellingProducts(page - 1)"
            >
              {{ page }}
            </li>
            <li
              class="pagination-item pagination-arrow"
              :class="{ 'pagination-disabled': currentPage === totalPages - 1 }"
              @click="fetchTopBestSellingProducts(currentPage + 1)"
            >
              &gt;
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Đã xem gần đây -->
    <div class="product-content-wrapper" v-if="recentViewedProducts.length > 0">
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
                    :src="getImageUrl(product.variants[0]?.imageName)"
                    class="img-fluid img-default"
                    :alt="`${product.name} Default`"
                  />
                  <img
                    :src="getImageUrl(product.variants[1]?.imageName)"
                    class="img-fluid img-hover"
                    :alt="`${product.name} Hover`"
                  />
                </div>
                <div class="product-name">{{ product.name }}</div>
                <div>
                  <span class="discounted-price">
                    {{
                      product.variants[0]?.price
                        ? product.variants[0].price.toLocaleString()
                        : "0"
                    }}₫
                  </span>
                  <span
                    class="original-price"
                    v-if="
                      product.originalPrice &&
                      product.originalPrice > product.variants[0]?.price
                    "
                  >
                    {{ product.originalPrice.toLocaleString() }}₫
                  </span>
                </div>
                <div class="view-count text-muted" style="font-size: 14px">
                  <i class="bi bi-eye me-1"></i>{{ product.viewCount || 0 }}
                  <i class="bi bi-bag-check me-1 ms-3"></i>{{ product.soldCount || 0 }}
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
                    >({{ product.averageRating?.toFixed(1) || "0.0" }})</span
                  >
                </div>
              </a>
            </div>
          </template>
          <nav class="mt-4 d-flex justify-content-center" v-if="recentTotalPages > 1">
            <ul class="pagination mt-3">
              <li
                class="pagination-item pagination-arrow"
                :class="{ 'pagination-disabled': recentPage === 0 }"
                @click="goToRecentPage(recentPage - 1)"
              >
                &lt;
              </li>
              <li
                v-for="page in recentTotalPages"
                :key="page"
                class="pagination-item"
                :class="{ 'pagination-active': page - 1 === recentPage }"
                @click="goToRecentPage(page - 1)"
              >
                {{ page }}
              </li>
              <li
                class="pagination-item pagination-arrow"
                :class="{ 'pagination-disabled': recentPage === recentTotalPages - 1 }"
                @click="goToRecentPage(recentPage + 1)"
              >
                &gt;
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { fetchAverageRating } from "@/api/ProductClient";
import promotionApi from "@/api/PromotionClien";

// Khởi tạo các ref
const topNewestProducts = ref([]);
const recentViewedProducts = ref([]);
const topBestSellingProducts = ref([]);

// Hàm getImageUrl
const getImageUrl = (imageName) => {
  return imageName && imageName.trim()
    ? `http://localhost:8080/images/${imageName.trim()}`
    : "/images/fallback-image.jpg";
};

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
        if (!product.variants || product.variants.length === 0) {
          console.log(`Sản phẩm ${product.productId} không có biến thể`);
          return {
            ...product,
            variants: [{ imageName: "fallback-image.jpg", price: 0 }],
          };
        }

        // Chọn minVariant ưu tiên có imageName
        let minVariant = product.variants.reduce((min, v) => {
          if (!v.imageName && min.imageName) return min;
          if (v.imageName && !min.imageName) return v;
          return v.price < min.price ? v : min;
        }, product.variants.find((v) => v.imageName) || product.variants[0]);

        // Nếu minVariant không có imageName, lấy từ variant khác
        if (!minVariant.imageName && product.variants.length > 1) {
          const fallbackVariant = product.variants.find((v) => v.imageName);
          minVariant.imageName = fallbackVariant
            ? fallbackVariant.imageName
            : "fallback-image.jpg";
        }

        console.log(
          `minVariant imageName cho sản phẩm ${product.productId}:`,
          minVariant.imageName
        );

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

        const soldResponse = await axios.get(
          `/api/public/products/${product.productId}/sold-count`
        );
        product.soldCount = soldResponse.data.soldCount || 0;

        product.variants = [
          minVariant,
          ...product.variants.filter((v) => v !== minVariant),
        ];
        return product;
      })
    );
  } catch (err) {
    console.error("Lỗi khi xử lý sản phẩm:", err);
    return products;
  }
};

// Fetch top 8 newest products (no pagination)
const fetchTopNewestProducts = async () => {
  try {
    const response = await axios.get("/api/public/products/top8");
    const filtered = response.data.filter(
      (product) =>
        product.variants &&
        product.variants.length > 0 &&
        product.variants[0]?.price !== undefined
    );
    topNewestProducts.value = await processProducts(filtered);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm mới nhất:", error);
  }
};

// Hàm lấy sản phẩm đã xem gần đây
const recentPage = ref(0);
const recentTotalPages = ref(0);
const recentPageSize = ref(8); // số sản phẩm/ trang

const fetchRecentViews = async (page = 0) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await axios.get("/api/user/product-views/recent", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page,
        size: recentPageSize.value,
      },
    });

    const productDTOs = response.data.content || [];

    const seen = new Map();
    productDTOs.forEach((item) => {
      const product = item.product?.[0];
      const variant = product?.variants?.[0];

      if (
        product?.productId &&
        !seen.has(product.productId) &&
        product.variants?.length > 0 &&
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
    recentPage.value = response.data.number;
    recentTotalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm đã xem gần đây:", error);
  }
};

const goToRecentPage = async (page) => {
  if (page >= 0 && page < recentTotalPages.value) {
    await fetchRecentViews(page);
  }
};

const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(8);

const fetchTopBestSellingProducts = async (page = 0) => {
  try {
    const response = await axios.get("/api/public/top50-products", {
      params: { page, size: pageSize.value },
    });

    const processed = await processProducts(
      response.data.content.filter(
        (product) =>
          product.variants &&
          product.variants.length > 0 &&
          product.variants[0]?.price !== undefined
      )
    );

    topBestSellingProducts.value = processed;
    currentPage.value = response.data.number;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
  }
};

import { computed } from "vue";

const chunkedBestSellingProducts = computed(() => {
  const chunks = [];
  for (let i = 0; i < topBestSellingProducts.value.length; i += 4) {
    chunks.push(topBestSellingProducts.value.slice(i, i + 4));
  }
  return chunks;
});

// onMounted hook
onMounted(async () => {
  await fetchTopNewestProducts();
  await fetchRecentViews();
  await fetchTopBestSellingProducts();
  await nextTick();
});
</script>

<style src="./src/assets/css/product.css"></style>
  ```
