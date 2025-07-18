<script setup>
import { onMounted, ref, nextTick } from "vue";
import { setupFilterSidebar } from "@/assets/js/product";
import { getAllProducts } from "@/api/ProductClient";
import promotionApi from "@/api/PromotionClien";

const products = ref([]);

onMounted(async () => {
  await fetchProducts();
  await nextTick();
  setupFilterSidebar();
});

const fetchProducts = async () => {
  try {
    const res = await getAllProducts();
    const activePromotions = await promotionApi.getActivePromotions();

    const promotionMap = new Map();

    // Gộp toàn bộ productPromotions (bạn có thể tối ưu về sau)
    activePromotions.forEach(promo => {
      promo.productPromotions.forEach(pp => {
        promotionMap.set(pp.productVariantId, promo);
      });
    });

    // Áp dụng khuyến mãi vào sản phẩm
    res.data.forEach(product => {
      const variant = product.variants?.[0]; // Chỉ xét biến thể đầu tiên
      if (variant) {
        const promo = promotionMap.get(variant.productVariantId);
        if (promo) {
          const discountAmount = promo.discountAmount || 0;
          const originalPrice = variant.price;
          const discountedPrice = originalPrice - discountAmount;

          product.originalPrice = originalPrice;
          product.variants[0].price = discountedPrice;
          product.discount = Math.round((discountAmount / originalPrice) * 100); // %
        }
      }
    });

    products.value = res.data;

  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
};
</script>

<template>
  <main>
    <div class="mainProduct">
      <div class="custom-breadcrumb-wrapper">
        <nav class="custom-breadcrumb container">
          <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
          <span class="custom-breadcrumb-separator">/</span>
          <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
            >Sản phẩm</a
          >
        </nav>
      </div>

      <h4 class="text-center mt-4 fw-bold">TẤT CẢ SẢN PHẨM</h4>
      <hr class="my-2 mt-2" style="height: 1px; background-color: #000; border: none" />
    </div>

    <div
      class="container product-sticky-toolbar d-flex flex-responsive justify-content-between align-items-start mt-2"
      :class="{ 'sidebar-open': isSidebarOpen }"
    >
      <div class="filter-sidebar-wrapper mt-2">
        <div class="filter-header" id="toggleSidebarBtn">
          <i class="bi bi-sliders"></i>
          <span class="filter-title">BỘ LỌC</span>
        </div>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileFilterSidebar">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title">BỘ LỌC</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          <div class="offcanvas-body">
            <div id="mobileFilterContent">
              <div class="accordion product-accordion" id="filterAccordion">
                <!-- Accordion Item: MÀU SẮC -->
                <div class="product-accordion-item">
                  <h2 class="accordion-header" id="headingColor">
                    <button
                      class="accordion-button accordion-btn collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseColor"
                    >
                      <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                      MÀU SẮC
                    </button>
                  </h2>
                  <div
                    id="collapseColor"
                    class="accordion-collapse collapse"
                    data-bs-parent="#filterAccordion"
                  >
                    <div class="accordion-body">
                      <ul class="list-unstyled mb-2">
                        <li class="d-flex align-items-center mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <span
                            class="color-dot me-2"
                            style="background-color: black"
                          ></span>
                          <span>Đen <span class="text-muted">(52)</span></span>
                        </li>
                        <li class="d-flex align-items-center mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <span
                            class="color-dot me-2"
                            style="background-color: white; border: 1px solid #ccc"
                          ></span>
                          <span>Trắng <span class="text-muted">(33)</span></span>
                        </li>
                        <li class="d-flex align-items-center mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <span
                            class="color-dot me-2"
                            style="background-color: #8b4513"
                          ></span>
                          <span>Nâu <span class="text-muted">(9)</span></span>
                        </li>
                        <li class="d-flex align-items-center mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <span
                            class="color-dot me-2"
                            style="background-color: #f5f5f5"
                          ></span>
                          <span>Trắng Xám <span class="text-muted">(9)</span></span>
                        </li>
                        <li class="d-flex align-items-center mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <span
                            class="color-dot me-2"
                            style="background-color: silver"
                          ></span>
                          <span>Bạc <span class="text-muted">(5)</span></span>
                        </li>
                        <li class="d-flex align-items-center mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <span
                            class="color-dot me-2"
                            style="background-color: #6a5acd"
                          ></span>
                          <span>Xanh Dương <span class="text-muted">(4)</span></span>
                        </li>
                      </ul>
                      <a href="#" class="text-decoration-underline small">Xem Thêm</a>
                    </div>
                  </div>
                </div>

                <!-- Accordion Item: KÍCH THƯỚC -->
                <div class="product-accordion-item">
                  <h2 class="accordion-header" id="headingSize">
                    <button
                      class="accordion-button accordion-btn"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseSize"
                      aria-expanded="true"
                      aria-controls="collapseSize"
                    >
                      <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                      KÍCH THƯỚC
                    </button>
                  </h2>
                  <div
                    id="collapseSize"
                    class="accordion-collapse collapse show"
                    data-bs-parent="#filterAccordion"
                  >
                    <div class="accordion-body">
                      <ul class="list-unstyled mb-0">
                        <li class="mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <label class="form-check-label"
                            >S <span class="text-muted">(58)</span></label
                          >
                        </li>
                        <li class="mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <label class="form-check-label"
                            >M <span class="text-muted">(51)</span></label
                          >
                        </li>
                        <li class="mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <label class="form-check-label"
                            >L <span class="text-muted">(16)</span></label
                          >
                        </li>
                        <li class="mb-2">
                          <input type="checkbox" class="form-check-input me-2" />
                          <label class="form-check-label"
                            >XL <span class="text-muted">(2)</span></label
                          >
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Accordion Item: GIÁ -->
                <div class="product-accordion-item">
                  <h2 class="accordion-header" id="headingPrice">
                    <button
                      class="accordion-button accordion-btn"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsePrice"
                      aria-expanded="true"
                      aria-controls="collapsePrice"
                    >
                      <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                      GIÁ
                    </button>
                  </h2>
                  <div
                    id="collapsePrice"
                    class="accordion-collapse collapse show"
                    data-bs-parent="#filterAccordion"
                  >
                    <div class="accordion-body">
                      <div class="range-slider mb-3">
                        <input
                          type="range"
                          class="form-range price-range-slider"
                          min="0"
                          max="10000000"
                          step="100000"
                          id="priceMin"
                        />
                        <input
                          type="range"
                          class="form-range price-range-slider"
                          min="0"
                          max="10000000"
                          step="100000"
                          id="priceMax"
                        />
                      </div>

                      <div class="d-flex justify-content-between">
                        <div class="form-group me-2">
                          <label class="form-label small">Từ</label>
                          <input
                            type="text"
                            class="form-control"
                            id="priceFrom"
                            value="1,690,000"
                          />
                        </div>
                        <div class="form-group">
                          <label class="form-label small">Đến</label>
                          <input
                            type="text"
                            class="form-control"
                            id="priceTo"
                            value="4,190,000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="product-sidebar" id="desktopFilterContent">
          <div class="accordion" id="filterAccordion">
            <!-- Accordion Item: MÀU SẮC -->
            <div class="product-accordion-item">
              <h2 class="accordion-header" id="headingColor">
                <button
                  class="accordion-button accordion-btn collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseColor"
                >
                  <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                  MÀU SẮC
                </button>
              </h2>
              <div
                id="collapseColor"
                class="accordion-collapse collapse"
                data-bs-parent="#filterAccordion"
              >
                <div class="accordion-body">
                  <ul class="list-unstyled mb-2">
                    <li class="d-flex align-items-center mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <span class="color-dot me-2" style="background-color: black"></span>
                      <span>Đen <span class="text-muted">(52)</span></span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <span
                        class="color-dot me-2"
                        style="background-color: white; border: 1px solid #ccc"
                      ></span>
                      <span>Trắng <span class="text-muted">(33)</span></span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <span
                        class="color-dot me-2"
                        style="background-color: #8b4513"
                      ></span>
                      <span>Nâu <span class="text-muted">(9)</span></span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <span
                        class="color-dot me-2"
                        style="background-color: #f5f5f5"
                      ></span>
                      <span>Trắng Xám <span class="text-muted">(9)</span></span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <span
                        class="color-dot me-2"
                        style="background-color: silver"
                      ></span>
                      <span>Bạc <span class="text-muted">(5)</span></span>
                    </li>
                    <li class="d-flex align-items-center mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <span
                        class="color-dot me-2"
                        style="background-color: #6a5acd"
                      ></span>
                      <span>Xanh Dương <span class="text-muted">(4)</span></span>
                    </li>
                  </ul>
                  <a href="#" class="text-decoration-underline small">Xem Thêm</a>
                </div>
              </div>
            </div>

            <!-- Accordion Item: KÍCH THƯỚC -->
            <div class="product-accordion-item">
              <h2 class="accordion-header" id="headingSize">
                <button
                  class="accordion-button accordion-btn"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSize"
                  aria-expanded="true"
                  aria-controls="collapseSize"
                >
                  <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                  KÍCH THƯỚC
                </button>
              </h2>
              <div
                id="collapseSize"
                class="accordion-collapse collapse show"
                data-bs-parent="#filterAccordion"
              >
                <div class="accordion-body">
                  <ul class="list-unstyled mb-0">
                    <li class="mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <label class="form-check-label"
                        >S <span class="text-muted">(58)</span></label
                      >
                    </li>
                    <li class="mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <label class="form-check-label"
                        >M <span class="text-muted">(51)</span></label
                      >
                    </li>
                    <li class="mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <label class="form-check-label"
                        >L <span class="text-muted">(16)</span></label
                      >
                    </li>
                    <li class="mb-2">
                      <input type="checkbox" class="form-check-input me-2" />
                      <label class="form-check-label"
                        >XL <span class="text-muted">(2)</span></label
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Accordion Item: GIÁ -->
            <div class="product-accordion-item">
              <h2 class="accordion-header" id="headingPrice">
                <button
                  class="accordion-button accordion-btn"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsePrice"
                  aria-expanded="true"
                  aria-controls="collapsePrice"
                >
                  <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                  GIÁ
                </button>
              </h2>
              <div
                id="collapsePrice"
                class="accordion-collapse collapse show"
                data-bs-parent="#filterAccordion"
              >
                <div class="accordion-body">
                  <div class="range-slider mb-3">
                    <input
                      type="range"
                      class="form-range"
                      min="0"
                      max="10000000"
                      step="100000"
                      id="priceMin"
                    />
                    <input
                      type="range"
                      class="form-range"
                      min="0"
                      max="10000000"
                      step="100000"
                      id="priceMax"
                    />
                  </div>
                  <div class="d-flex justify-content-between">
                    <div class="form-group me-2">
                      <label class="form-label small">Từ</label>
                      <input
                        type="text"
                        class="form-control price-input"
                        id="priceFrom"
                        value="1,690,000"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label small">Đến</label>
                      <input
                        type="text"
                        class="form-control price-input"
                        id="priceTo"
                        value="4,190,000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p
        class="ps-5 product-count-text d-none d-md-block mt-2"
        style="font-style: italic; color: #999; font-size: 14px"
      >
        Hiển thị 1 - 80 trong tổng số 127 sản phẩm
      </p>

      <div class="dropdown product-sort-dropdown">
        <button
          class="btn btn-light dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-sort-alpha-down ms-2"></i> Mới nhất
        </button>
        <ul class="dropdown-menu product-dropdown-menu">
          <li><a class="dropdown-item" href="#">Giá: Tăng dần</a></li>
          <li><a class="dropdown-item" href="#">Giá: Giảm dần</a></li>
          <li><a class="dropdown-item" href="#">Tên: A-Z</a></li>
          <li><a class="dropdown-item" href="#">Tên: Z-A</a></li>
          <li><a class="dropdown-item" href="#">Cũ nhất</a></li>
          <li><a class="dropdown-item" href="#">Mới nhất</a></li>
          <!-- mục có sẵn background -->
          <li><a class="dropdown-item" href="#">Bán chạy nhất</a></li>
          <li><a class="dropdown-item" href="#">Tồn kho: Giảm dần</a></li>
        </ul>
      </div>
    </div>

    <div class="product-content-wrapper">
      <div class="container mt-5">
        <div class="row g-3">
          <div
            v-for="product in products"
            :key="product.productId"
            class="col-6 col-sm-6 col-md-4 col-lg-3"
          >
            <a :href="`product-detail/${product.productId}`" class="product-link">
              <div class="product-item">
                <!-- Nếu có biến thể và có discount -->
                <span class="discount-badge" v-if="product.discount"
                  >-{{ product.discount }}%</span
                >

                <!-- Ảnh mặc định -->
                <img
                  :src="product.variants[0]?.imageName || '/default.jpg'"
                  class="img-fluid img-default"
                  :alt="product.name"
                />
                <img
                  :src="
                    product.variants[0]?.imageName
                      ? `http://localhost:8080/images/${product.variants[0].imageName}`
                      : '/default.jpg'
                  "
                  class="img-fluid img-hover"
                  :alt="`${product.name} Hover`"
                />
              </div>

              <!-- Tên sản phẩm -->
              <div class="product-name">{{ product.name }}</div>

              <!-- Giá -->
              <div>
                <span class="discounted-price">
                  {{
                    product.variants[0]?.price
                      ? product.variants[0].price.toLocaleString()
                      : "0"
                  }}₫
                </span>

                <!-- Giá gạch nếu có originalPrice (tùy bạn tính thêm discount ở backend) -->
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
            </a>
          </div>
        </div>

        <!-- phân trang giả lập -->
        <ul class="pagination mt-3">
          <li class="pagination-item pagination-active">1</li>
          <li class="pagination-item">2</li>
          <li class="pagination-item">3</li>
          <li class="pagination-item pagination-disabled">...</li>
          <li class="pagination-item">15</li>
          <li class="pagination-item pagination-arrow">&gt;</li>
        </ul>
      </div>
    </div>
  </main>
</template>
<style src="./src/assets/css/product.css"></style>
