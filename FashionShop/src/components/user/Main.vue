<template>
  <div>
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

    <section class="dreams-section">
      <div class="row align-items-center">
        <div class="col-12 col-md-6 dreams-image">
          <a href="#" aria-label="Xem chi tiết bộ sưu tập l'hex x Hello Kitty">
            <img
              src="https://placehold.co/700x500?text=City+Crosswalk+View"
              alt="Aerial view of a busy pedestrian crosswalk with many people walking on striped paths"
            />
          </a>
        </div>

        <div class="col-12 col-md-6 dreams-text">
          <a
            href="#"
            style="text-decoration: none; color: inherit"
            aria-label="Xem chi tiết nội dung bộ sưu tập"
          >
            <h2>GIẤC MƠ NGỌT NGÀO</h2>
            <p>
              Bộ sưu tập này là sự giao thoa giữa tinh thần bay bổng của L'hex và vẻ dễ
              thương vượt thời gian của Hello Kitty. Dành cho những tâm hồn mộng mơ, biết
              trân trọng vẻ đẹp từ những điều nhỏ bé, từng thiết kế là một lời nhắc dịu
              dàng rằng: yêu thương, tình bạn và trí tưởng tượng chính là những gam màu
              đẹp nhất của cuộc sống. Hãy bước vào thế giới nơi mỗi món đồ đều kể một câu
              chuyện ngọt ngào — nơi bạn được truyền cảm hứng để mơ lớn và yêu thương hết
              mình.
            </p>
          </a>
          <a href="#" class="dreams-btn" aria-label="Xem Thêm - Learn More">XEM THÊM</a>
        </div>
      </div>
    </section>

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
  </div>
</template>

<script setup>
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

onMounted(async () => {
  await nextTick();
  initializeNewSwiper();

  resizeNewHandler = () => {
    handleResizeNewSwiper();
  };
  window.addEventListener("resize", resizeNewHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeNewHandler);
  destroyNewSwiper();
});

onMounted(async () => {
  await nextTick();
  initializeBestsellerSwiper();

  resizeBestsellerHandler = () => {
    handleResizeBestsellerSwiper();
  };
  window.addEventListener("resize", resizeBestsellerHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeBestsellerHandler);
  destroyBestsellerSwiper();
});
</script>
<style src="@/assets/css/main.css"></style>
