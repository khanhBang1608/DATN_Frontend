<script setup>
import { onMounted, ref, nextTick, watch } from "vue";
import { setupFilterSidebar } from "@/assets/js/product";
import { getAllProducts, searchProductsByName } from "@/api/ProductClient";
import promotionApi from "@/api/PromotionClien";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const searchKeyword = ref(route.query.keyword || "");
const products = ref([]);
const isSidebarOpen = ref(false);
const sortOption = ref("Mới nhất"); // Biến theo dõi tiêu chí sắp xếp

onMounted(async () => {
  if (searchKeyword.value) {
    await handleSearch();
  } else {
    await fetchProducts();
  }
  await nextTick();
  setupFilterSidebar();
});

// Theo dõi thay đổi URL keyword
watch(
  () => route.query.keyword,
  async (newKeyword) => {
    searchKeyword.value = newKeyword || "";
    if (searchKeyword.value) {
      await handleSearch();
    } else {
      await fetchProducts();
    }
  }
);

// Hàm xử lý khi click vào sản phẩm
const handleProductClick = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post("/api/user/product-views/record", null, {
        params: { productId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    router.push(`/product-detail/${productId}`);
  } catch (error) {
    console.error("Lỗi khi ghi nhận lượt xem:", error);
    router.push(`/product-detail/${productId}`);
  }
};

// Hàm lấy tất cả sản phẩm
const fetchProducts = async () => {
  try {
    const res = await getAllProducts();
    const activePromotions = await promotionApi.getActivePromotions();

    const promotionMap = new Map();
    activePromotions.forEach((promo) => {
      promo.productPromotions.forEach((pp) => {
        promotionMap.set(pp.productVariantId, promo);
      });
    });

    res.data.forEach((product) => {
      if (!product.variants || product.variants.length === 0) return;

      let minVariant = product.variants[0];
      product.variants.forEach((v) => {
        if (v.price < minVariant.price) {
          minVariant = v;
        }
      });

      const promo = promotionMap.get(minVariant.productVariantId);
      if (promo) {
        const discountPercent = promo.discountAmount || 0;
        const originalPrice = minVariant.price;
        const discountedPrice = originalPrice * (1 - discountPercent / 100);

        product.originalPrice = originalPrice;
        minVariant = {
          ...minVariant,
          price: Math.round(discountedPrice),
        };
        product.discount = discountPercent;
      }

      product.variants = [
        minVariant,
        ...product.variants.filter((v) => v !== minVariant),
      ];
    });

    products.value = res.data;
    handleSort(sortOption.value); // Áp dụng sắp xếp mặc định
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
};

// Hàm tìm kiếm sản phẩm
const handleSearch = async () => {
  try {
    const response = await searchProductsByName(searchKeyword.value);
    products.value = response.data.length > 0 ? response.data : [];
    if (!response.data.length) {
      console.log("Không tìm thấy sản phẩm phù hợp.");
    }
    handleSort(sortOption.value); // Áp dụng sắp xếp sau khi tìm kiếm
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
  }
};

// Hàm xử lý sắp xếp
const handleSort = (option) => {
  sortOption.value = option;
  let sortedProducts = [...products.value];

  switch (option) {
    case "Giá: Tăng dần":
      sortedProducts.sort(
        (a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
      );
      break;
    case "Giá: Giảm dần":
      sortedProducts.sort(
        (a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0)
      );
      break;
    case "Tên: A-Z":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "Tên: Z-A":
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "Tồn kho: Giảm dần":
      sortedProducts.sort(
        (a, b) => (b.variants[0]?.stock || 0) - (a.variants[0]?.stock || 0)
      );
      break;
    default:
      break;
  }

  products.value = sortedProducts;
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
      <hr class="my-2 mt-2" style="height: 0.5px; background-color: #000; border: none" />
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
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <div id="mobileFilterContent">
              <div class="accordion product-accordion" id="filterAccordionMobile">
                <div class="product-accordion-item">
                  <h2 class="accordion-header" id="headingColorMobile">
                    <button
                      class="accordion-button accordion-btn collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseColorMobile"
                      aria-controls="collapseColorMobile"
                      aria-expanded="false"
                    >
                      <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                      MÀU SẮC
                    </button>
                  </h2>
                  <div
                    id="collapseColorMobile"
                    class="accordion-collapse collapse"
                    data-bs-parent="#filterAccordionMobile"
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

                <div class="product-accordion-item">
                  <h2 class="accordion-header" id="headingSizeMobile">
                    <button
                      class="accordion-button accordion-btn collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseSizeMobile"
                      aria-expanded="false"
                      aria-controls="collapseSizeMobile"
                    >
                      <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                      KÍCH THƯỚC
                    </button>
                  </h2>
                  <div
                    id="collapseSizeMobile"
                    class="accordion-collapse collapse"
                    data-bs-parent="#filterAccordionMobile"
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

                <div class="product-accordion-item">
                  <h2 class="accordion-header" id="headingPriceMobile">
                    <button
                      class="accordion-button accordion-btn collapsed ps-3"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsePriceMobile"
                      aria-expanded="false"
                      aria-controls="collapsePriceMobile"
                    >
                      <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                      GIÁ
                    </button>
                  </h2>
                  <div
                    id="collapsePriceMobile"
                    class="accordion-collapse collapse"
                    data-bs-parent="#filterAccordionMobile"
                  >
                    <div class="accordion-body">
                      <div class="range-slider mb-3">
                        <input
                          type="range"
                          class="form-range price-range-slider"
                          min="0"
                          max="10000000"
                          step="100000"
                          id="priceMinMobile"
                        />
                        <input
                          type="range"
                          class="form-range price-range-slider"
                          min="0"
                          max="10000000"
                          step="100000"
                          id="priceMaxMobile"
                        />
                      </div>
                      <div class="d-flex justify-content-between">
                        <div class="form-group me-2">
                          <label class="form-label small">Từ</label>
                          <input
                            type="text"
                            class="form-control"
                            id="priceFromMobile"
                            value="1,690,000"
                          />
                        </div>
                        <div class="form-group">
                          <label class="form-label small">Đến</label>
                          <input
                            type="text"
                            class="form-control"
                            id="priceToMobile"
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
          <div class="accordion" id="filterAccordionDesktop">
            <div class="product-accordion-item">
              <h2 class="accordion-header" id="headingColorDesktop">
                <button
                  class="accordion-button accordion-btn collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseColorDesktop"
                  aria-expanded="false"
                  aria-controls="collapseColorDesktop"
                >
                  <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                  MÀU SẮC
                </button>
              </h2>
              <div
                id="collapseColorDesktop"
                class="accordion-collapse collapse"
                data-bs-parent="#filterAccordionDesktop"
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

            <div class="product-accordion-item">
              <h2 class="accordion-header" id="headingSizeDesktop">
                <button
                  class="accordion-button accordion-btn collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSizeDesktop"
                  aria-expanded="false"
                  aria-controls="collapseSizeDesktop"
                >
                  <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                  KÍCH THƯỚC
                </button>
              </h2>
              <div
                id="collapseSizeDesktop"
                class="accordion-collapse collapse"
                data-bs-parent="#filterAccordionDesktop"
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

            <div class="product-accordion-item">
              <h2 class="accordion-header" id="headingPriceDesktop">
                <button
                  class="accordion-button accordion-btn collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsePriceDesktop"
                  aria-expanded="false"
                  aria-controls="collapsePriceDesktop"
                >
                  <i class="bi bi-chevron-down me-2 rotate-icon"></i>
                  GIÁ
                </button>
              </h2>
              <div
                id="collapsePriceDesktop"
                class="accordion-collapse collapse"
                data-bs-parent="#filterAccordionDesktop"
              >
                <div class="accordion-body">
                  <div class="range-slider mb-3">
                    <input
                      type="range"
                      class="form-range"
                      min="0"
                      max="10000000"
                      step="100000"
                      id="priceMinDesktop"
                    />
                    <input
                      type="range"
                      class="form-range"
                      min="0"
                      max="10000000"
                      step="100000"
                      id="priceMaxDesktop"
                    />
                  </div>
                  <div class="d-flex justify-content-between">
                    <div class="form-group me-2">
                      <label class="form-label small">Từ</label>
                      <input
                        type="text"
                        class="form-control price-input"
                        id="priceFromDesktop"
                        value="1,690,000"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label small">Đến</label>
                      <input
                        type="text"
                        class="form-control price-input"
                        id="priceToDesktop"
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
          <i class="bi bi-sort-alpha-down ms-2"></i>
          {{ sortOption }}
        </button>
        <ul class="dropdown-menu product-dropdown-box">
          <li>
            <a class="dropdown-item" @click="handleSort('Giá: Tăng dần')"
              >Giá: Tăng dần</a
            >
          </li>
          <li>
            <a class="dropdown-item" @click="handleSort('Giá: Giảm dần')"
              >Giá: Giảm dần</a
            >
          </li>
          <li><a class="dropdown-item" @click="handleSort('Tên: A-Z')">Tên: A-Z</a></li>
          <li><a class="dropdown-item" @click="handleSort('Tên: Z-A')">Tên: Z-A</a></li>
          <li>
            <a class="dropdown-item" @click="handleSort('Tồn kho: Giảm dần')"
              >Tồn kho: Giảm dần</a
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="product-content-wrapper">
      <div class="container mt-5">
        <div class="row g-3">
          <template v-for="product in products" :key="product.productId">
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
              </a>
            </div>
          </template>
        </div>
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
```
