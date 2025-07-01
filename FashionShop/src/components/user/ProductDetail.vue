<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import Swiper from "swiper/bundle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const imageSources = [
  new URL("@/assets/img/slideshow_1.png", import.meta.url).href,
  new URL("@/assets/img/slideshow_1.png", import.meta.url).href,
  new URL("@/assets/img/slideshow_1.png", import.meta.url).href,
  new URL("@/assets/img/slideshow_1.png", import.meta.url).href,
];

const currentIndex = ref(0);
const isManualScroll = ref(false);
const mobileSwiperInitialized = ref(false);

const thumbnailList = ref(null);
const largeImagesContainer = ref(null);
const scrollArea = ref(null);
const galleryModal = ref(null);
const swiperWrapper = ref(null);
const mobileSwiperWrapper = ref(null);


let mySwiper = null;
let mobileSwiper = null;
let scrollTimeout;

function scrollToImage(index) {
  const largeImages = largeImagesContainer.value.querySelectorAll("img");
  const thumbnails = thumbnailList.value.querySelectorAll("img");
  largeImages[index].scrollIntoView({ behavior: "smooth", block: "start" });
  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });
  currentIndex.value = index;
  setTimeout(() => (isManualScroll.value = false), 500);
}

function openCurrentGallery() {
  openGallery(currentIndex.value);
}

function openGallery(startIndex) {
  if (!swiperWrapper.value || !galleryModal.value) return;

  swiperWrapper.value.innerHTML = "";
  imageSources.forEach((src) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `<img src="${src}" />`;
    swiperWrapper.value.appendChild(slide);
  });

  galleryModal.value.style.display = "flex";

  nextTick(() => {
    if (mySwiper) mySwiper.destroy(true, true);
    mySwiper = new Swiper(".pd-modal-swiper", {
      initialSlide: startIndex,
      loop: true,
      navigation: {
        nextEl: ".pd-modal-swiper-next",
        prevEl: ".pd-modal-swiper-prev",
      },
      pagination: {
        el: ".pd-modal-swiper-pagination",
        clickable: true,
      },
    });
  });
}

function closeGallery(e) {
  if (
    e.target === galleryModal.value ||
    e.target.classList.contains("pd-modal-close-btn")
  ) {
    galleryModal.value.style.display = "none";
  }
}

function initMobileSwiper() {
const wrapper = mobileSwiperWrapper.value;
  if (!wrapper) return;
  wrapper.innerHTML = "";

  imageSources.forEach((src) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `<img src="${src}" class="img-fluid" />`;
    wrapper.appendChild(slide);
  });

  mobileSwiper = new Swiper(".pd-mobile-swiper-core", {
    loop: true,
    pagination: {
      el: ".pd-mobile-swiper-pagination",
      clickable: true,
    },
  });
}

function swiperSlidePrev() {
  if (mobileSwiper) mobileSwiper.slidePrev();
}

function swiperSlideNext() {
  if (mobileSwiper) mobileSwiper.slideNext();
}

onMounted(() => {
  imageSources.forEach((src, index) => {
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.loading = "lazy";
    if (index === 0) thumb.classList.add("active");
    thumb.onclick = () => {
      isManualScroll.value = true;
      scrollToImage(index);
    };
    thumbnailList.value.appendChild(thumb);

    const zoomContainer = document.createElement("div");
    zoomContainer.className = "product-detail-zoom-container";
    const largeImg = document.createElement("img");
    largeImg.src = src;
    largeImg.loading = "lazy";
    largeImg.id = "img" + index;
    zoomContainer.appendChild(largeImg);
    largeImagesContainer.value.appendChild(zoomContainer);
  });

  scrollArea.value.addEventListener("scroll", () => {
    if (isManualScroll.value) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const areaTop = scrollArea.value.getBoundingClientRect().top;
      let minDiff = Infinity;
      let activeIndex = 0;

      const largeImages = largeImagesContainer.value.querySelectorAll("img");
      largeImages.forEach((img, i) => {
        const diff = Math.abs(img.getBoundingClientRect().top - areaTop);
        if (diff < minDiff) {
          minDiff = diff;
          activeIndex = i;
        }
      });

      const thumbnails = thumbnailList.value.querySelectorAll("img");
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === activeIndex);
      });
      currentIndex.value = activeIndex;
    }, 100);
  });

  setTimeout(() => {
    scrollToImage(0);
    if (window.innerWidth <= 768) {
      initMobileSwiper();
      mobileSwiperInitialized.value = true;
    }
  }, 100);

  window.addEventListener("resize", () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && !mobileSwiperInitialized.value) {
      initMobileSwiper();
      mobileSwiperInitialized.value = true;
    }
  });
});

onBeforeUnmount(() => {
  if (mySwiper) mySwiper.destroy();
  if (mobileSwiper) mobileSwiper.destroy();
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
          <div class="product-detail-thumbnails" ref="thumbnailList"></div>

          <div class="product-detail-scroll-wrapper position-relative">
            <div class="product-detail-scroll-area" ref="scrollArea">
              <div class="product-detail-large-images" ref="largeImagesContainer"></div>
            </div>
          </div>

          <div
            class="product-detail-fullscreen-icon d-flex justify-content-center"
            @click="openCurrentGallery"
          >
            <i class="bi bi-arrows-fullscreen"></i>
          </div>

          <!-- Mobile Swiper -->
          <div class="pd-mobile-swiper">
            <div class="swiper pd-mobile-swiper-core">
              <div
                class="swiper-wrapper pd-mobile-swiper-wrapper"
                ref="mobileSwiperWrapper"
              ></div>
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
          Túi hobo hình thang Atwood Crinkle-Effect Chain-Embellished -
          <span class="text-muted">Noir</span>
        </h4>
        <div class="price fs-4 fw-bold mb-4">2,150,000 ₫</div>
        <hr class="product-detail-divider" />

        <!-- Màu sắc -->
        <div class="mb-4">
          <div class="fw-semibold mb-1">
            Màu sắc: <span class="text-muted">Noir</span>
          </div>
          <div class="d-flex gap-2 py-2">
            <div class="product-detail-color" style="background-color: #f3f1df"></div>
            <div class="product-detail-color" style="background-color: #e2e2e2"></div>
            <div class="product-detail-color" style="background-color: #ddd"></div>
            <div class="product-detail-color" style="background-color: #9b6a5d"></div>
            <div class="product-detail-color" style="background-color: #000"></div>
            <div
              class="product-detail-color border border-dark"
              style="background-color: #1e1e1e"
            ></div>
          </div>
          <hr class="product-detail-divider" />
        </div>

        <!-- Kích thước -->
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold">Kích thước: <strong>S</strong></span>
          </div>
          <div class="d-flex gap-2 py-2">
            <div class="product-detail-size">S</div>
            <div class="product-detail-size">M</div>
            <div class="product-detail-size">L</div>
            <div class="product-detail-size">XL</div>
          </div>
          <hr class="product-detail-divider" />
        </div>

        <!-- Thêm vào giỏ -->
        <div class="mb-4">
          <button class="btn product-detail-btn w-100 py-2 text-uppercase">
            Thêm vào giỏ hàng
          </button>
        </div>

        <!-- Yêu thích & Tìm -->
        <div class="mb-2">
          <div class="d-flex justify-content-between text-muted small">
            <div><i class="bi bi-heart me-1"></i> Thêm vào Danh sách yêu thích</div>
            <div><i class="bi bi-geo-alt me-1"></i> Tìm trong cửa hàng</div>
          </div>
        </div>
        <hr class="product-detail-divider" />

        <!-- Mô tả sản phẩm -->
        <div class="mb-4">
          <!-- Không còn bị ẩn trên desktop -->
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
                Dòng sản phẩm Nỉ chân cua (French Terry) mang đến sự thoải mái và thoáng
                khí:
              </p>
              <ul>
                <li><strong>Chất liệu:</strong> Nỉ chân cua - French Terry</li>
                <li>
                  <strong>Thành phần:</strong> 100% Cotton, đảm bảo độ mềm mại và thấm hút
                  tốt.
                </li>
                <li>
                  <strong>Đặc điểm nổi bật:</strong> Bề mặt ngoài là cotton mịn như hoodie
                  nỉ bông, nhưng mặt trong là sợi vải dạng vòng lặp (loop), không có phần
                  bông xù, giúp thoáng khí hơn và phù hợp cho nhiều điều kiện thời tiết.
                </li>
                <li><strong>Xuất xứ:</strong> Sản xuất tại Việt Nam.</li>
              </ul>
            </div>
            <div class="tab-pane fade" id="size" role="tabpanel">
              <div class="text-center">
                <img
                  src="https://file.hstatic.net/200000321981/file/sc_flag_sweat_short_grande.jpg"
                  alt="Bảng kích thước nỉ chân cua"
                  class="img-fluid rounded border"
                  style="max-width: 80%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ĐÁNH GIÁ KHÁCH HÀNG -->
    <div class="review-section container my-5">
      <h5 class="review-title text-center mb-3">Khách hàng đánh giá (0)</h5>

      <!-- Tổng sao -->
      <div class="review-rating-summary text-center mb-3">
        <div class="review-stars fs-3 text-warning">
          <i class="bi bi-star"></i>
          <i class="bi bi-star"></i>
          <i class="bi bi-star"></i>
          <i class="bi bi-star"></i>
          <i class="bi bi-star"></i>
        </div>
        <div class="review-average fw-semibold mt-2">Chưa có đánh giá</div>
      </div>

      <!-- Tabs sao -->
      <!-- Tabs sao: Trên desktop dùng tab, mobile dùng dropdown -->
      <div class="review-tabs mb-3">
        <!-- Dropdown cho mobile -->
        <div class="d-md-none mb-2">
          <select class="form-select" id="reviewFilterSelect">
            <option value="all">Tất cả (0)</option>
            <option value="5">5 sao (0)</option>
            <option value="4">4 sao (0)</option>
            <option value="3">3 sao (0)</option>
            <option value="2">2 sao (0)</option>
            <option value="1">1 sao (0)</option>
          </select>
        </div>

        <!-- Tabs cho desktop -->
        <ul class="nav nav-tabs justify-content-center d-none d-md-flex" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active review-tab" data-value="all">
              Tất cả (0)
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link review-tab" data-value="5">5 sao (0)</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link review-tab" data-value="4">4 sao (0)</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link review-tab" data-value="3">3 sao (0)</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link review-tab" data-value="2">2 sao (0)</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link review-tab" data-value="1">1 sao (0)</button>
          </li>
        </ul>
      </div>

      <!-- Bộ lọc -->
      <div
        class="review-filters d-flex justify-content-between align-items-center mb-3 px-2"
      >
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="filterImage" />
          <label class="form-check-label" for="filterImage">Có hình ảnh</label>
        </div>
        <div class="review-login text-end">
          <a href="#" class="text-decoration-underline text-dark">Đăng nhập</a>
          để viết đánh giá của bạn
        </div>
      </div>
      <hr class="review-divider" />
      <!-- Danh sách đánh giá -->
      <div class="review-empty text-center text-muted py-5">
        <p class="mb-0">Chưa có đánh giá của khách hàng</p>
      </div>
    </div>
  </div>

  <div class="container mb-3">
    <h4 class="text-center mt-4 fw-bold">SẢN PHẦM LIÊN QUAN</h4>
    <div class="row g-3 mt-3">
      <!-- Sản phẩm 1 -->
      <div class="col-6 col-sm-6 col-md-4 col-lg-3">
        <a href="#" class="product-link">
          <div class="product-item">
            <span class="discount-badge">-25%</span>
            <img
              src="@/assets/img/slideshow_1.png"
              class="img-fluid img-default"
              alt="Quần Dài Wash Xám"
            />
            <img
              src="@/assets/img/slideshow_1.png"
              class="img-fluid img-hover"
              alt="Quần Dài Wash Xám Hover"
            />
          </div>
          <div class="product-name">TSUN Quần Dài Rộng Ống Suông Wash Xám</div>
          <div>
            <span class="discounted-price">630,000₫</span>
            <span class="original-price">840,000₫</span>
          </div>
        </a>
      </div>
      <div class="col-6 col-sm-6 col-md-4 col-lg-3">
        <a href="#" class="product-link">
          <div class="product-item">
            <span class="discount-badge">-25%</span>
            <img
              src="@/assets/img/slideshow_1.png"
              class="img-fluid img-default"
              alt="Quần Dài Wash Xám"
            />
            <img
              src="@/assets/img/slideshow_1.png"
              class="img-fluid img-hover"
              alt="Quần Dài Wash Xám Hover"
            />
          </div>
          <div class="product-name">TSUN Quần Dài Rộng Ống Suông Wash Xám</div>
          <div>
            <span class="discounted-price">630,000₫</span>
            <span class="original-price">840,000₫</span>
          </div>
        </a>
      </div>
    </div>
  </div>

  <!-- Swiper Modal -->
  <div ref="galleryModal" id="galleryModal" @click="closeGallery">
    <div class="pd-modal-slider">
      <div class="swiper pd-modal-swiper">
        <div class="swiper-wrapper pd-modal-swiper-wrapper" ref="swiperWrapper"></div>
        <div class="swiper-button-next pd-modal-swiper-next"></div>
        <div class="swiper-button-prev pd-modal-swiper-prev"></div>
        <div class="swiper-pagination pd-modal-swiper-pagination"></div>
      </div>
      <span class="pd-modal-close-btn" @click="closeGallery($event)">&times;</span>
    </div>
  </div>
</template>
<style src="@/assets/css/product-detail.css"></style>
