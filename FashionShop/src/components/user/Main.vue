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
    <div class="container my-5">
      <h3 class="text-center mb-4 fw-bold">NEW PRODUCTS</h3>
      <div class="swiper new-products-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(product, index) in newProducts" :key="index">
            <a href="#" class="product-link">
              <div class="product-item">
                <span class="discount-badge">{{ product.discount }}</span>
                <img :src="product.imageDefault" class="img-fluid img-default" />
                <img :src="product.imageHover" class="img-fluid img-hover" />
              </div>
              <div class="product-name">{{ product.name }}</div>
              <div>
                <span class="discounted-price">{{ product.discountedPrice }}₫</span>
                <span class="original-price">{{ product.originalPrice }}₫</span>
              </div>
            </a>
          </div>
        </div>
        <div class="new-swiper-pagination mt-5"></div>
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

    <!-- Sản phẩm bán chạy -->
    <div class="container my-5">
      <h3 class="text-center mb-4 fw-bold">BEST SELLERS</h3>
      <div class="swiper bestseller-products-swiper">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(product, index) in bestProductList"
            :key="index"
          >
            <a href="#" class="product-link">
              <div class="product-item">
                <span class="discount-badge">{{ product.discount }}</span>
                <img :src="product.imageDefault" class="img-fluid img-default" />
                <img :src="product.imageHover" class="img-fluid img-hover" />
              </div>
              <div class="product-name">{{ product.name }}</div>
              <div>
                <span class="discounted-price">{{ product.discountedPrice }}₫</span>
                <span class="original-price">{{ product.originalPrice }}₫</span>
              </div>
            </a>
          </div>
        </div>
        <div class="bestseller-swiper-pagination mt-5"></div>
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
          <a :href="`/product/${item.productId}`" class="product-link">
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
                onerror="this.onerror=null;this.src='https://via.placeholder.com/60';"
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
import { categories, useScrollCategory } from "@/assets/js/scrollcategory.js";
import {
  newProducts,
  initializeNewSwiper,
  handleResizeNewSwiper,
  destroyNewSwiper,
} from "@/assets/js/newproductcarousel.js";
import {
  bestSellerProducts,
  initializeBestsellerSwiper,
  handleResizeBestsellerSwiper,
  destroyBestsellerSwiper,
} from "@/assets/js/bestsellerproductcarousel.js";

const scrollContent = ref(null);
const { pauseScroll, resumeScroll } = useScrollCategory(scrollContent);

const newProductList = ref(newProducts);
let resizeNewHandler;

const bestProductList = ref(bestSellerProducts);
let resizeBestsellerHandler;

const recentViewedProducts = ref([]);

const formatPrice = (value) => {
  if (!value) return "0";
  return value.toLocaleString("vi-VN");
};

const fetchRecentViews = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await axios.get(`/api/user/product-views/recent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Dữ liệu từ API:", response.data);

    if (Array.isArray(response.data)) {
      const seen = new Map();

      response.data.forEach((item) => {
        const product = item.product?.[0];
        const variant = product?.variants?.[0];

        if (product?.productId && !seen.has(product.productId)) {
          const image = variant?.imageName || "";
          seen.set(product.productId, {
            productId: product.productId,
            name: product.name,
            price: variant?.price || 0,
            image,
            viewCount: 1,
          });
        } else if (product?.productId) {
          const existing = seen.get(product.productId);
          existing.viewCount++;
        }
      });

      recentViewedProducts.value = Array.from(seen.values());
    }
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm đã xem gần đây:", error);
  }
};

onMounted(fetchRecentViews);

onMounted(async () => {
  await nextTick();
  initializeNewSwiper();
  resizeNewHandler = () => handleResizeNewSwiper();
  window.addEventListener("resize", resizeNewHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeNewHandler);
  destroyNewSwiper();
});

onMounted(async () => {
  await nextTick();
  initializeBestsellerSwiper();
  resizeBestsellerHandler = () => handleResizeBestsellerSwiper();
  window.addEventListener("resize", resizeBestsellerHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeBestsellerHandler);
  destroyBestsellerSwiper();
});
</script>

<style src="@/assets/css/main.css"></style>
