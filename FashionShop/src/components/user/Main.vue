```vue
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
    <div class="container my-5" v-if="topNewestProducts.length > 0">
      <h3 class="text-center mb-4 fw-bold">TOP 10 SẢN PHẨM MỚI NHẤT</h3>
      <div class="swiper top-newest-products-swiper">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(product, index) in topNewestProducts"
            :key="index"
          >
            <a
              href="#"
              class="product-link"
              @click.prevent="handleProductClick(product.productId)"
            >
              <div class="product-item">
                <img
                  :src="getProductImage(product)"
                  class="img-fluid img-default"
                  alt="Hình sản phẩm"
                  onerror="this.onerror=null;this.src='https://via.placeholder.com/200x200?text=No+Image';"
                />
              </div>
              <div class="product-name">{{ product.name }}</div>
              <div>
                <span class="discounted-price">
                  {{ formatPrice(product.variants[0]?.price) }}₫
                </span>
              </div>
            </a>
          </div>
        </div>
        <div class="top-newest-swiper-pagination mt-5"></div>
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
    <div class="container my-5" v-if="topBestSellingProducts.length > 0">
      <h3 class="text-center mb-4 fw-bold">TOP 50 SẢN PHẨM BÁN CHẠY NHẤT</h3>
      <div class="row">
        <div
          class="col-6 col-md-3 mb-4"
          v-for="(product, index) in topBestSellingProducts"
          :key="index"
        >
          <a
            href="#"
            class="product-link"
            @click.prevent="handleProductClick(product.productId)"
          >
            <div class="product-item">
              <img
                :src="getProductImage(product)"
                class="img-fluid img-default"
                alt="Hình sản phẩm"
                onerror="this.onerror=null;this.src='https://via.placeholder.com/200x200?text=No+Image';"
              />
            </div>
            <div class="product-name mt-2">{{ product.name }}</div>
            <div class="product-info mt-2">
              Giá: <span class="discounted-price">{{ formatPrice(product.variants[0]?.price) }}₫</span>
            </div>
            <div class="sold-count text-muted" style="font-size: 14px">
              Đã bán: {{ product.viewCount }} sản phẩm
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Đã xem gần đây -->
    <div class="container my-5" v-if="recentViewedProducts.length > 0">
      <h3 class="text-center mb-4 fw-bold">ĐÃ XEM GẦN ĐÂY</h3>
      <div class="row">
        <div
          class="col-6 col-md-3 mb-4"
          v-for="(item, index) in recentViewedProducts"
          :key="index"
        >
          <a
            href="#"
            class="product-link"
            @click.prevent="handleProductClick(item.productId)"
          >
            <div class="product-item">
              <img
                :src="
                  item.image
                    ? `http://localhost:8080/images/${item.image}`
                    : 'https://via.placeholder.com/60'
                "
                alt="Ảnh sản phẩm"
                width="60"
                class="img-fluid"
              />
            </div>
            <div class="product-name mt-2">{{ item.name }}</div>
            <div>
              <span class="discounted-price">{{ formatPrice(item.price) }}₫</span>
            </div>
            <div class="view-count text-muted" style="font-size: 14px">
              Đã xem: {{ item.viewCount }} lần
            </div>
          </a>
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

// Khởi tạo các ref
const scrollContent = ref(null);
const { pauseScroll, resumeScroll } = useScrollCategory(scrollContent);
const topNewestProducts = ref([]);
const recentViewedProducts = ref([]);
const topBestSellerVariants = ref([]);
const topBestSellingProducts = ref([]); // Thêm ref cho top 50 sản phẩm
let resizeTopNewestHandler;
let resizeBestSellerVariantsHandler;

// Hàm lấy ảnh sản phẩm
const getProductImage = (product) => {
  return product.variants?.[0]?.imageName
    ? `http://localhost:8080/images/${product.variants[0].imageName}`
    : "https://via.placeholder.com/200x200?text=No+Image";
};

// Hàm định dạng giá
const formatPrice = (value) => {
  if (!value) return "0";
  return value.toLocaleString("vi-VN");
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

// Hàm lấy sản phẩm mới nhất
const fetchTopNewestProducts = async () => {
  try {
    const response = await axios.get("/api/public/products/top10");
    topNewestProducts.value = response.data.filter(
      (product) =>
        product.variants &&
        product.variants.length > 0 &&
        product.variants[0]?.price !== undefined
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
          const image = variant?.imageName || "";
          seen.set(product.productId, {
            productId: product.productId,
            name: product.name,
            price: variant?.price || 0,
            image,
            viewCount: product.viewCount || 0,
          });
        }
      });
      recentViewedProducts.value = Array.from(seen.values());
    }
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm đã xem gần đây:", error);
  }
};

// Hàm lấy top 50 sản phẩm bán chạy
const fetchTopBestSellingProducts = async () => {
  try {
    const response = await axios.get("/api/public/top50-products");
    topBestSellingProducts.value = response.data.filter(
      (product) =>
        product.variants &&
        product.variants.length > 0 &&
        product.variants[0]?.price !== undefined
    );
  } catch (error) {
    console.error("Lỗi khi lấy top 50 sản phẩm bán chạy:", error);
  }
};

// Khởi tạo Swiper cho sản phẩm mới nhất
const initializeTopNewestSwiper = () => {
  new Swiper(".top-newest-products-swiper", {
    slidesPerView: 2,
    spaceBetween: 20,
    breakpoints: {
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
      1200: { slidesPerView: 5 },
    },
    pagination: {
      el: ".top-newest-swiper-pagination",
      clickable: true,
    },
  });
};

// Khởi tạo Swiper cho biến thể bán chạy
const initializeBestSellerVariantsSwiper = () => {
  new Swiper(".bestseller-variants-swiper", {
    slidesPerView: 2,
    spaceBetween: 20,
    breakpoints: {
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
      1200: { slidesPerView: 5 },
    },
    pagination: {
      el: ".bestseller-swiper-pagination",
      clickable: true,
    },
  });
};

// onMounted hook
onMounted(async () => {
  await fetchTopNewestProducts();
  await fetchRecentViews();
  await fetchTopBestSellingProducts(); // Thêm hàm gọi API top 50 sản phẩm
  await nextTick();
  initializeTopNewestSwiper();
  initializeBestSellerVariantsSwiper();
  resizeTopNewestHandler = () => initializeTopNewestSwiper();
  resizeBestSellerVariantsHandler = () => initializeBestSellerVariantsSwiper();
  window.addEventListener("resize", resizeTopNewestHandler);
  window.addEventListener("resize", resizeBestSellerVariantsHandler);
});

// onBeforeUnmount hook
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeTopNewestHandler);
  window.removeEventListener("resize", resizeBestSellerVariantsHandler);
});
</script>

<style scoped>
/* Scoped styles để tránh ảnh hưởng đến các component khác */
.scroll-wrapper {
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
}
.scroll-content {
  display: inline-flex;
}
.product-category {
  display: inline-block;
  margin-right: 15px;
  text-align: center;
}
.product-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
.product-title {
  font-size: 14px;
  margin-top: 5px;
}
.product-link {
  text-decoration: none;
  color: inherit;
}
.dreams-section {
  padding: 20px;
}
.dreams-image img {
  width: 100%;
  height: auto;
}
.dreams-text {
  padding: 20px;
}
.dreams-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 10px;
}
.bestseller-variants-swiper .swiper-slide .product-item {
  position: relative;
  overflow: hidden;
}
.bestseller-variants-swiper .swiper-slide .product-item img {
  width: 100%;
  height: auto;
  transition: transform 0.3s ease;
}
.bestseller-variants-swiper .swiper-slide .product-item:hover img {
  transform: scale(1.05);
}
.bestseller-variants-swiper .product-name {
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
  text-align: center;
}
.bestseller-variants-swiper .discounted-price {
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
}
.bestseller-variants-swiper .original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}
.bestseller-variants-swiper .discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #e74c3c;
  color: #fff;
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 3px;
}
.bestseller-swiper-pagination {
  text-align: center;
}

</style>

