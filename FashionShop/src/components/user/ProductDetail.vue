<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getProductDetail } from "@/api/ProductClient";
import ReviewComponent from "@/components/user/Review.vue";


const route = useRoute();
const product = ref({ variants: [] });
const selectedColorId = ref(null);
const selectedSizeId = ref(null);

const displayedPrice = computed(() => {
  if (!product.value.variants || product.value.variants.length === 0) return 0;

  // Nếu đã chọn cả màu và kích thước
  if (selectedColorId.value && selectedSizeId.value) {
    const match = product.value.variants.find(
      (v) => v.colorId === selectedColorId.value && v.sizeId === selectedSizeId.value
    );
    return match ? match.price : "Không có giá";
  }

  // Nếu chưa chọn → lấy giá nhỏ nhất
  const prices = product.value.variants.map((v) => v.price);
  return Math.min(...prices);
});

onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await getProductDetail(id);
    product.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
});

// Tạo danh sách màu sắc duy nhất
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

// Tạo danh sách kích thước duy nhất
const uniqueSizes = computed(() => {
  const seen = new Set();
  return product.value.variants.filter((v) => {
    if (!seen.has(v.sizeId)) {
      seen.add(v.sizeId);
      return true;
    }
    return false;
  });
});

// Hàm chuyển tên màu thành mã màu (tùy chỉnh theo màu của bạn)
function getColorHex(colorName) {
  const map = {
    Đen: "#000000",
    Trắng: "#ffffff",
    Đỏ: "#ff0000",
    Vàng: "#ffff00",
    Xanh: "#008000",
    // Thêm nếu cần
  };
  return map[colorName] || "#cccccc";
}

// Lấy đường dẫn ảnh
function getImageUrl(imageName) {
  return imageName ? `http://localhost:8080/images/${imageName}` : "/default.jpg";
}
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
          <span class="text-muted"> {{ product.name }}</span>
        </h4>
        <div class="price fs-4 fw-bold mb-4">
          {{
            typeof displayedPrice === "number"
              ? displayedPrice.toLocaleString() + "₫"
              : displayedPrice
          }}
        </div>

        <hr class="product-detail-divider" />

        <!-- Màu sắc -->
        <div class="mb-4">
          <div class="fw-semibold mb-1">Màu sắc: <span class="text-muted"></span></div>
          <div
            v-for="(color, index) in uniqueColors"
            :key="index"
            class="product-detail-color"
            :title="color.colorName"
            :style="{ backgroundColor: getColorHex(color.colorName) }"
            @click="selectedColorId = color.colorId"
          ></div>

          <hr class="product-detail-divider" />
        </div>

        <!-- Kích thước -->
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold">Kích thước: <strong>S</strong></span>
          </div>
          <div class="d-flex gap-2 py-2">
            <div
              v-for="(size, index) in uniqueSizes"
              :key="index"
              class="product-detail-size"
              @click="selectedSizeId = size.sizeId"
            >
              {{ size.sizeName }}
            </div>
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
