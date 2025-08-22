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
                <div class="product-item position-relative">
                  <span
                    v-if="product.variants[0]?.discountPercent > 0"
                    class="discount-badge"
                  >
                    -{{ product.variants[0].discountPercent }}%
                  </span>
                  <img
                    :src="
                      getImageUrl(
                        product.variants[0]?.imageName || 'fallback-image-default.jpg'
                      )
                    "
                    class="img-fluid img-default"
                    :alt="`${product.name} Default`"
                  />
                  <img
                    :src="
                      getImageUrl(
                        product.variants[1]?.imageName || 'fallback-image-hover.jpg'
                      )
                    "
                    class="img-fluid img-hover"
                    :alt="`${product.name} Hover`"
                  />
                </div>
                <div class="product-name text-truncate">{{ product.name }}</div>
                <div>
                  <span class="discounted-price text-danger fw-bold">
                    {{
                      product.variants[0]?.discountedPrice
                        ? product.variants[0].discountedPrice.toLocaleString()
                        : product.variants[0]?.price.toLocaleString() || "0"
                    }}₫
                  </span>
                  <span
                    class="original-price text-muted text-decoration-line-through ms-2"
                    v-if="
                      product.variants[0]?.originalPrice &&
                      product.variants[0]?.originalPrice >
                        product.variants[0]?.discountedPrice
                    "
                  >
                    {{ product.variants[0].originalPrice.toLocaleString() }}₫
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
                <div class="product-item position-relative">
                  <span
                    v-if="product.variants[0]?.discountPercent > 0"
                    class="discount-badge"
                  >
                    -{{ product.variants[0].discountPercent }}%
                  </span>
                  <img
                    :src="
                      getImageUrl(
                        product.variants[0]?.imageName || 'fallback-image-default.jpg'
                      )
                    "
                    class="img-fluid img-default"
                    :alt="`${product.name} Default`"
                  />
                  <img
                    :src="
                      getImageUrl(
                        product.variants[1]?.imageName || 'fallback-image-hover.jpg'
                      )
                    "
                    class="img-fluid img-hover"
                    :alt="`${product.name} Hover`"
                  />
                </div>
                <div class="product-name text-truncate">{{ product.name }}</div>
                <div>
                  <span class="discounted-price text-danger fw-bold">
                    {{
                      product.variants[0]?.discountedPrice
                        ? product.variants[0].discountedPrice.toLocaleString()
                        : product.variants[0]?.price.toLocaleString() || "0"
                    }}₫
                  </span>
                  <span
                    class="original-price text-muted text-decoration-line-through ms-2"
                    v-if="
                      product.variants[0]?.originalPrice &&
                      product.variants[0]?.originalPrice >
                        product.variants[0]?.discountedPrice
                    "
                  >
                    {{ product.variants[0].originalPrice.toLocaleString() }}₫
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
                <div class="product-item position-relative">
                  <span
                    v-if="product.variants[0]?.discountPercent > 0"
                    class="discount-badge"
                  >
                    -{{ product.variants[0].discountPercent }}%
                  </span>
                  <img
                    :src="
                      getImageUrl(
                        product.variants[0]?.imageName || 'fallback-image-default.jpg'
                      )
                    "
                    class="img-fluid img-default"
                    :alt="`${product.name} Default`"
                  />
                  <img
                    :src="
                      getImageUrl(
                        product.variants[1]?.imageName || 'fallback-image-hover.jpg'
                      )
                    "
                    class="img-fluid img-hover"
                    :alt="`${product.name} Hover`"
                  />
                </div>
                <div class="product-name text-truncate">{{ product.name }}</div>
                <div>
                  <span class="discounted-price text-danger fw-bold">
                    {{
                      product.variants[0]?.discountedPrice
                        ? product.variants[0].discountedPrice.toLocaleString()
                        : product.variants[0]?.price.toLocaleString() || "0"
                    }}₫
                  </span>
                  <span
                    class="original-price text-muted text-decoration-line-through ms-2"
                    v-if="
                      product.variants[0]?.originalPrice &&
                      product.variants[0]?.originalPrice >
                        product.variants[0]?.discountedPrice
                    "
                  >
                    {{ product.variants[0].originalPrice.toLocaleString() }}₫
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
                  <span class="ms-1 text-muted">
                    ({{ product.averageRating?.toFixed(1) || "0.0" }})
                  </span>
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
const recentPage = ref(0);
const recentTotalPages = ref(0);
const recentPageSize = ref(8);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(8);

// Hàm getImageUrl
const getImageUrl = (imageName) => {
  return imageName && imageName.trim()
    ? `http://localhost:8080/images/${imageName.trim()}`
    : "/images/fallback-image-default.jpg";
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
            variants: [
              { imageName: "fallback-image-default.jpg" },
              { imageName: "fallback-image-hover.jpg" },
            ],
          };
        }

        // Chọn minVariant ưu tiên có imageName
        let minVariant = product.variants.find((v) => v.imageName) || product.variants[0];
        // Chọn hoverVariant khác với minVariant
        let hoverVariant =
          product.variants.find(
            (v) => v.imageName && v.imageName !== minVariant.imageName
          ) || minVariant;

        // Nếu hoverVariant không có imageName hoặc giống minVariant, sử dụng fallback
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

        const rating = await fetchAverageRating(product.productId);
        product.averageRating = rating.data;

        const soldResponse = await axios.get(
          `/api/public/products/${product.productId}/sold-count`
        );
        product.soldCount = soldResponse.data.soldCount || 0;

        // Chỉ giữ hai biến thể: minVariant (default) và hoverVariant (hover)
        product.variants = [minVariant, hoverVariant];

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

    // Chuyển đổi dữ liệu từ API để phù hợp với cấu trúc sản phẩm
    const products = productDTOs
      .map((item) => {
        const product = item.product?.[0];
        const variant = product?.variants?.[0];

        if (
          product?.productId &&
          product.variants?.length > 0 &&
          variant?.price !== undefined
        ) {
          return {
            productId: product.productId,
            name: product.name,
            variants: product.variants, // Giữ nguyên toàn bộ variants để xử lý trong processProducts
            viewCount: product.viewCount || 0,
            soldCount: product.soldCount || 0,
          };
        }
        return null;
      })
      .filter((product) => product !== null);

    // Sử dụng processProducts để xử lý hình ảnh và khuyến mãi
    recentViewedProducts.value = await processProducts(products);
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

// Fetch top best selling products
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

// onMounted hook
onMounted(async () => {
  await fetchTopNewestProducts();
  await fetchRecentViews();
  await fetchTopBestSellingProducts();
  await nextTick();
});
</script>

<style src="./src/assets/css/product.css"></style>
