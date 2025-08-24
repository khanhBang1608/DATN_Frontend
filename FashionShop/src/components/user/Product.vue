<script setup>
import { onMounted, ref, nextTick, watch } from "vue";
import { setupFilterSidebar } from "@/assets/js/product";
import {
  getAllProducts,
  searchProductsByName,
  getAllColors,
  getAllSizes,
} from "@/api/ProductClient";
import promotionApi from "@/api/PromotionClien";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const searchKeyword = ref(route.query.keyword || "");
const products = ref([]);
const filteredProducts = ref([]); // Store filtered products
const similarProducts = ref([]);
const isSidebarOpen = ref(false);
const sortOption = ref("Mới nhất");
const showNoProductsMessage = ref(false);

// Filter states
const colors = ref([]);
const sizes = ref([]);
const selectedColors = ref([]);
const selectedSizes = ref([]);
const priceMin = ref(0);
const priceMax = ref(10000000);

// Show more states
const showMoreColors = ref(false);
const showMoreSizes = ref(false);

// Fetch colors and sizes
const fetchColorsAndSizes = async () => {
  try {
    const colorRes = await getAllColors();
    colors.value = colorRes.data;

    const sizeRes = await getAllSizes();
    sizes.value = sizeRes.data;
  } catch (error) {
    console.error("Lỗi khi tải màu & size:", error);
  }
};

const getImageUrl = (imageName) => {
  return imageName ? `http://localhost:8080/images/${imageName}` : "/default.jpg";
};

const handleProductClick = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post("/api/user/product-views/record", null, {
        params: { productId },
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    router.push(`/product-detail/${productId}`);
  } catch (error) {
    console.error("Lỗi khi ghi nhận lượt xem:", error);
    router.push(`/product-detail/${productId}`);
  }
};

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

        let minVariant = product.variants.find((v) => v.imageName) || product.variants[0];
        let hoverVariant =
          product.variants.find(
            (v) => v.imageName && v.imageName !== minVariant.imageName
          ) || minVariant;

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
          product.originalPrice = originalPrice;
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

        const soldResponse = await axios.get(
          `/api/public/products/${product.productId}/sold-count`
        );
        product.soldCount = soldResponse.data.soldCount || 0;

        const ratingResponse = await axios.get(
          `/api/public/products/${product.productId}/average-rating`
        );
        product.averageRating = ratingResponse.data || 0;

        product.totalStock = product.variants.reduce(
          (sum, variant) => sum + (variant.stock || 0),
          0
        );

        product.variants = [minVariant, hoverVariant];
        return product;
      })
    );
  } catch (err) {
    console.error("Lỗi khi xử lý sản phẩm:", err);
    return products;
  }
};

const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(8);

const fetchProducts = async (page = 0, size = pageSize.value) => {
  try {
    const res = await getAllProducts(page, size);
    const data = res.data;

    const processed = await processProducts(data.content || []);
    products.value = processed;
    filteredProducts.value = processed; // Initialize filtered products
    totalPages.value = data.totalPages;
    currentPage.value = data.number;

    showNoProductsMessage.value = processed.length === 0;
    handleSort(sortOption.value);
    applyFilters(); // Apply filters after fetching
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
    showNoProductsMessage.value = true;
  }
};

const handleSearch = async (page = 0, size = pageSize.value) => {
  try {
    const response = await searchProductsByName(searchKeyword.value, page, size);
    const data = response.data;

    const processed = await processProducts(data.content || []);
    products.value = processed;
    filteredProducts.value = processed;
    totalPages.value = data.totalPages;
    currentPage.value = data.number;

    showNoProductsMessage.value = processed.length === 0;
    handleSort(sortOption.value);
    applyFilters();
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    showNoProductsMessage.value = true;
  }
};

const fetchSimilarProducts = async () => {
  try {
    const response = await searchProductsByName(searchKeyword.value || "default", 0, 8);
    similarProducts.value = await processProducts(
      response.data.content.filter(
        (product) =>
          product.variants &&
          product.variants.length > 0 &&
          product.variants[0]?.price !== undefined
      )
    );
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm tương tự:", error);
  }
};

// Filter logic
const applyFilters = () => {
  let filtered = products.value;

  // Filter by color
  if (selectedColors.value.length > 0) {
    filtered = filtered.filter((product) =>
      product.variants.some((variant) => selectedColors.value.includes(variant.colorId))
    );
  }

  // Filter by size
  if (selectedSizes.value.length > 0) {
    filtered = filtered.filter((product) =>
      product.variants.some((variant) => selectedSizes.value.includes(variant.sizeId))
    );
  }

  // Filter by price
  filtered = filtered.filter((product) =>
    product.variants.some(
      (variant) =>
        variant.discountedPrice >= priceMin.value &&
        variant.discountedPrice <= priceMax.value
    )
  );

  filteredProducts.value = filtered;
  showNoProductsMessage.value = filtered.length === 0;
  handleSort(sortOption.value); // Reapply sorting after filtering
};

const handleSort = (option) => {
  sortOption.value = option;
  let sortedProducts = [...filteredProducts.value];

  switch (option) {
    case "Giá: Tăng dần":
      sortedProducts.sort(
        (a, b) =>
          (a.variants[0]?.discountedPrice || 0) - (b.variants[0]?.discountedPrice || 0)
      );
      break;
    case "Giá: Giảm dần":
      sortedProducts.sort(
        (a, b) =>
          (b.variants[0]?.discountedPrice || 0) - (a.variants[0]?.discountedPrice || 0)
      );
      break;
    case "Tên: A-Z":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "Tên: Z-A":
      sortedProducts.sort((a, b) => b.name.localeCompare(b.name));
      break;
    case "Tồn kho: Giảm dần":
      sortedProducts.sort((a, b) => (b.totalStock || 0) - (a.totalStock || 0));
      break;
    default:
      break;
  }

  filteredProducts.value = sortedProducts;
};

const goToPage = async (page) => {
  if (page >= 0 && page < totalPages.value) {
    if (searchKeyword.value) {
      await handleSearch(page);
    } else {
      await fetchProducts(page);
    }
  }
};

// Watch for filter changes
watch([selectedColors, selectedSizes, priceMin, priceMax], () => {
  applyFilters();
});

onMounted(async () => {
  if (searchKeyword.value) {
    await handleSearch();
  } else {
    await fetchProducts();
  }
  await fetchSimilarProducts();
  await fetchColorsAndSizes();
  await nextTick();
  setupFilterSidebar();
});

watch(
  () => route.query.keyword,
  async (newKeyword) => {
    searchKeyword.value = newKeyword || "";
    if (searchKeyword.value) {
      await handleSearch();
    } else {
      await fetchProducts();
    }
    await fetchSimilarProducts();
  }
);
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
                        <li
                          v-for="color in showMoreColors ? colors : colors.slice(0, 5)"
                          :key="color.colorId"
                          class="d-flex align-items-center mb-2"
                        >
                          <input
                            type="checkbox"
                            class="form-check-input me-2"
                            v-model="selectedColors"
                            :value="color.colorId"
                          />
                          <!-- <span
                            class="color-dot me-2"
                            :style="{ backgroundColor: color.hexCode || '#ccc' }"
                          ></span> -->
                          <span>
                            {{ color.colorName }}
                          </span>
                        </li>
                      </ul>
                      <a
                        v-if="colors.length > 5 && !showMoreColors"
                        href="#"
                        class="text-decoration-underline small"
                        @click.prevent="showMoreColors = true"
                        >Xem Thêm</a
                      >
                      <a
                        v-else-if="colors.length > 5 && showMoreColors"
                        href="#"
                        class="text-decoration-underline small"
                        @click.prevent="showMoreColors = false"
                        >Thu Gọn</a
                      >
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
                        <li
                          v-for="size in showMoreSizes ? sizes : sizes.slice(0, 5)"
                          :key="size.sizeId"
                          class="mb-2"
                        >
                          <input
                            type="checkbox"
                            class="form-check-input me-2"
                            v-model="selectedSizes"
                            :value="size.sizeId"
                          />
                          <label class="form-check-label">
                            {{ size.sizeName }}
                          </label>
                        </li>
                      </ul>
                      <a
                        v-if="sizes.length > 5 && !showMoreSizes"
                        href="#"
                        class="text-decoration-underline small"
                        @click.prevent="showMoreSizes = true"
                        >Xem Thêm</a
                      >
                      <a
                        v-else-if="sizes.length > 5 && showMoreSizes"
                        href="#"
                        class="text-decoration-underline small"
                        @click.prevent="showMoreSizes = false"
                        >Thu Gọn</a
                      >
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
                          v-model="priceMin"
                          min="0"
                          max="10000000"
                          step="100000"
                          id="priceMinMobile"
                        />
                        <input
                          type="range"
                          class="form-range price-range-slider"
                          v-model="priceMax"
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
                            v-model="priceMin"
                            id="priceFromMobile"
                          />
                        </div>
                        <div class="form-group">
                          <label class="form-label small">Đến</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="priceMax"
                            id="priceToMobile"
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
                    <li
                      v-for="color in showMoreColors ? colors : colors.slice(0, 5)"
                      :key="color.colorId"
                      class="d-flex align-items-center mb-2"
                    >
                      <input
                        type="checkbox"
                        class="form-check-input me-2"
                        v-model="selectedColors"
                        :value="color.colorId"
                      />
                      <span>
                        {{ color.colorName }}
                      </span>
                    </li>
                  </ul>
                  <a
                    v-if="colors.length > 5 && !showMoreColors"
                    href="#"
                    class="text-decoration-underline small"
                    @click.prevent="showMoreColors = true"
                    >Xem Thêm</a
                  >
                  <a
                    v-else-if="colors.length > 5 && showMoreColors"
                    href="#"
                    class="text-decoration-underline small"
                    @click.prevent="showMoreColors = false"
                    >Thu Gọn</a
                  >
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
                    <li
                      v-for="size in showMoreSizes ? sizes : sizes.slice(0, 5)"
                      :key="size.sizeId"
                      class="mb-2"
                    >
                      <input
                        type="checkbox"
                        class="form-check-input me-2"
                        v-model="selectedSizes"
                        :value="size.sizeId"
                      />
                      <label class="form-check-label">
                        {{ size.sizeName }}
                      </label>
                    </li>
                  </ul>
                  <a
                    v-if="sizes.length > 5 && !showMoreSizes"
                    href="#"
                    class="text-decoration-underline small"
                    @click.prevent="showMoreSizes = true"
                    >Xem Thêm</a
                  >
                  <a
                    v-else-if="sizes.length > 5 && showMoreSizes"
                    href="#"
                    class="text-decoration-underline small"
                    @click.prevent="showMoreSizes = false"
                    >Thu Gọn</a
                  >
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
                      v-model="priceMin"
                      min="0"
                      max="10000000"
                      step="100000"
                      id="priceMinDesktop"
                    />
                    <input
                      type="range"
                      class="form-range"
                      v-model="priceMax"
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
                        v-model="priceMin"
                        id="priceFromDesktop"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label small">Đến</label>
                      <input
                        type="text"
                        class="form-control price-input"
                        v-model="priceMax"
                        id="priceToDesktop"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

    <div class="product-content-wrapper mb-3">
      <div class="container mt-5">
        <div class="row g-3">
          <template v-for="product in filteredProducts" :key="product.productId">
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
                  <span
                    class="discount-badge"
                    v-if="product.variants[0]?.discountPercent > 0"
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
                <div class="product-name">{{ product.name }}</div>
                <div>
                  <span class="discounted-price">
                    {{
                      product.variants[0]?.discountedPrice
                        ? product.variants[0].discountedPrice.toLocaleString()
                        : "0"
                    }}₫
                  </span>
                  <span
                    class="original-price"
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
                  <span class="ms-1 text-muted"
                    >({{ product.averageRating?.toFixed(1) || "0.0" }})</span
                  >
                </div>
                <div class="sold-count text-muted" style="font-size: 14px">
                  <i class="bi bi-bag-check me-1"></i>{{ product.soldCount || 0 }} sản
                  phẩm
                </div>
                <div class="stock-count text-danger" v-if="product.totalStock <= 20">
                  <i class="bi bi-exclamation-triangle me-1"></i>Còn
                  {{ product.totalStock }} sản phẩm
                </div>
              </a>
            </div>
          </template>
          <div v-if="showNoProductsMessage" class="container text-center py-5">
            <i class="bi bi-emoji-frown fs-1 text-secondary mb-3"></i>
            <p class="text-muted fs-5 mb-4">Không có sản phẩm nào tìm thấy.</p>
          </div>
        </div>
        <ul class="pagination mt-3" v-if="totalPages > 1">
          <li
            class="pagination-item pagination-arrow"
            :class="{ 'pagination-disabled': currentPage === 0 }"
            @click="goToPage(currentPage - 1)"
          >
            &lt;
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="pagination-item"
            :class="{ 'pagination-active': page - 1 === currentPage }"
            @click="goToPage(page - 1)"
          >
            {{ page }}
          </li>
          <li
            class="pagination-item pagination-arrow"
            :class="{ 'pagination-disabled': currentPage === totalPages - 1 }"
            @click="goToPage(currentPage + 1)"
          >
            &gt;
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style>
.stock-count {
  font-size: 12px;
}
.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
}
</style>
