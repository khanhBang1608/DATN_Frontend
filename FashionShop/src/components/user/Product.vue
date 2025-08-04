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
const similarProducts = ref([]); // Thêm biến để lưu sản phẩm tương tự
const isSidebarOpen = ref(false);
const sortOption = ref("Mới nhất");

// Hàm xử lý khi click vào sản phẩm
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

// Hàm xử lý khuyến mãi
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
        if (!product.variants || product.variants.length === 0) return product;

        let minVariant = product.variants.reduce(
          (min, v) => (v.price < min.price ? v : min),
          product.variants[0]
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

        // Gọi API để lấy số lượng đã bán
        const soldResponse = await axios.get(
          `/api/public/products/${product.productId}/sold-count`
        );
        product.soldCount = soldResponse.data.soldCount || 0;

        // Gọi API để lấy đánh giá trung bình
        const ratingResponse = await axios.get(
          `/api/public/products/${product.productId}/average-rating`
        );
        product.averageRating = ratingResponse.data || 0;

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

// Hàm lấy tất cả sản phẩm
const fetchProducts = async () => {
  try {
    const res = await getAllProducts();
    products.value = await processProducts(res.data);
    handleSort(sortOption.value);
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
};

// Hàm tìm kiếm sản phẩm
const handleSearch = async () => {
  try {
    const response = await searchProductsByName(searchKeyword.value);
    products.value = response.data.length > 0 ? await processProducts(response.data) : [];
    if (!response.data.length) {
      console.log("Không tìm thấy sản phẩm phù hợp.");
    }
    handleSort(sortOption.value);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
  }
};

// Hàm lấy sản phẩm tương tự
const fetchSimilarProducts = async () => {
  try {
    // Giả sử có API để lấy sản phẩm tương tự, ví dụ dựa trên danh mục
    const response = await axios.get("/api/public/products/similar", {
      params: { categoryId: route.query.categoryId || 1 }, // Thay categoryId bằng giá trị phù hợp
    });
    similarProducts.value = await processProducts(
      response.data.filter(
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

// onMounted hook
onMounted(async () => {
  if (searchKeyword.value) {
    await handleSearch();
  } else {
    await fetchProducts();
  }
  await fetchSimilarProducts(); // Gọi hàm lấy sản phẩm tương tự
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
    await fetchSimilarProducts(); // Cập nhật sản phẩm tương tự khi thay đổi keyword
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
      <!-- Bộ lọc sidebar (giữ nguyên) -->
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
                <!-- Giữ nguyên code bộ lọc -->
              </div>
            </div>
          </div>
        </div>

        <div class="product-sidebar" id="desktopFilterContent">
          <div class="accordion" id="filterAccordionDesktop">
            <!-- Giữ nguyên code bộ lọc -->
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

    <!-- Danh sách sản phẩm chính -->
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
                  <i class="bi bi-bag-check me-1"></i>{{ product.soldCount || 0 }} sản phẩm
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

    <!-- Phần sản phẩm tương tự -->
    <div class="product-content-wrapper">
      <div class="container mt-5">
        <h3 class="text-center mb-4 fw-bold">SẢN PHẨM TƯƠNG TỰ</h3>
        <div class="row g-3">
          <template v-for="product in similarProducts" :key="product.productId">
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
                  <i class="bi bi-bag-check me-1"></i>{{ product.soldCount || 0 }} sản phẩm
                </div>
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

<style src="./src/assets/css/product.css"></style>
