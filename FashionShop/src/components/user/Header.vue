<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import initHeader from "@/assets/js/header.js";
import axios from "axios";
import { getCart, getCartItemCount } from "@/api/user/cartAPI";

const isLoggedIn = ref(false);
const router = useRouter();
const userInfo = ref(null);
const categories = ref([]); // Lưu danh sách danh mục từ API
const activeSubmenu = ref(null); // Theo dõi danh mục cha đang mở submenu
const cart = ref({ details: [] }); // Lưu dữ liệu giỏ hàng
const cartItemCount = ref(0); // Số lượng sản phẩm trong giỏ hàng từ API

async function fetchUserInfo() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await axios.get("http://localhost:8080/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    userInfo.value = response.data;
  } catch (error) {
    console.error("Không thể lấy thông tin user:", error.response?.data || error.message);
  }
}

async function fetchCategories() {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/public/category/categories"
    );
    categories.value = response.data; // Lưu roots (danh mục cha với children)
  } catch (error) {
    console.error("Không thể lấy danh mục:", error);
  }
}

async function fetchCart() {
  try {
    const cartData = await getCart();
    cart.value = cartData;
  } catch (error) {
    console.error("Không thể lấy dữ liệu giỏ hàng:", error.message);
  }
}

async function fetchCartItemCount() {
  try {
    const count = await getCartItemCount();
    cartItemCount.value = count;
  } catch (error) {
    console.error("Không thể lấy số lượng giỏ hàng:", error.message);
    cartItemCount.value = 0;
  }
}

function checkLoginStatus() {
  isLoggedIn.value = !!localStorage.getItem("token");
}

function goToLogin() {
  router.push("/login");
}

function resetScrollLock() {
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
  document.body.style.paddingRight = "0";
}

function goToLogout() {
  localStorage.removeItem("token");
  isLoggedIn.value = false;
  resetScrollLock();
  router.push("/login");
}

function handleUserIconClick() {
  if (isLoggedIn.value) {
    router.push("/user/account");
  } else {
    router.push("/login");
  }
}

function navigateToProducts(categoryName) {
  router.push({ path: "/product", query: { keyword: categoryName } });
}

function toggleSubmenu(categoryId) {
  if (activeSubmenu.value === categoryId) {
    activeSubmenu.value = null;
  } else {
    activeSubmenu.value = categoryId;
  }
}

onMounted(async () => {
  checkLoginStatus();
  await fetchUserInfo();
  await fetchCategories();
  await fetchCart();
  await fetchCartItemCount(); // Gọi API để lấy số lượng giỏ hàng
  nextTick(() => {
    initHeader(); // Gọi lại initHeader sau khi DOM được cập nhật
  });

  window.addEventListener("storage", () => {
    checkLoginStatus();
    fetchUserInfo();
    fetchCartItemCount(); // Cập nhật số lượng khi có thay đổi
  });
});

watch(isLoggedIn, (newVal) => {
  if (newVal) {
    fetchCartItemCount(); // Cập nhật số lượng khi đăng nhập
    nextTick(() => {
      initHeader();
    });
  } else {
    cartItemCount.value = 0; // Reset khi đăng xuất
  }
});

const searchKeyword = ref("");

function handleSearch() {
  const keyword = searchKeyword.value.trim();
  if (keyword) {
    router.push({ path: "/product", query: { keyword } });
  } else {
    router.push({ path: "/product" });
  }
}
</script>

<template>
  <header>
    <div class="header" style="background-color: #f1f1f1">
      <div
        class="container d-flex flex-column flex-md-row justify-content-between align-items-center py-2"
      >
        <div class="contact-info d-none d-md-block">
          <a href="tel:0378447716">Hotline: 037 844 7716</a> |
          <a href="mailto:bytecrew@gmail.com">Gmail: customers@lhex.vn</a>
        </div>

        <div
          class="announcement-animated text-primary fw-semibold small text-center mx-md-3 flex-grow-1"
        >
          <div class="scrolling-text">
            Đổi trả dễ dàng trong vòng 30 ngày kể từ khi nhận sản phẩm.
          </div>
          <div class="scrolling-text">Miễn phí vận chuyển cho khách hàng mới</div>
        </div>

        <div class="d-none d-md-flex align-items-center">
          <a href="/about" class="text-dark text-decoration-none me-3">Giới thiệu</a>
          <a href="/contact-us" class="text-dark text-decoration-none me-3">Liên hệ</a>
          <a href="/contact" class="text-dark text-decoration-none me-3">Chính sách</a>
          <a
            href="/user/profile"
            class="text-dark text-decoration-none me-3 small"
            v-if="userInfo"
          >
            xin chào, <span class="fw-bold">{{ userInfo.name }}</span>
          </a>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-light bg-white d-block d-lg-none">
      <div class="container">
        <a class="navbar-brand" href="/">
          <img src="@/assets/img/logo-brand.png" alt="Nike Logo" height="45" />
        </a>
        <div class="d-flex align-items-center d-lg-none">
          <a
            href="#"
            @click.prevent="handleUserIconClick"
            class="text-dark text-decoration-none mx-2"
          >
            <i class="bi bi-people fs-4"></i>
          </a>
          <a href="/user/favorite" class="text-dark text-decoration-none mx-2">
            <i class="bi bi-heart fs-4"></i>
          </a>
          <a
            href="/user/cart"
            class="text-dark text-decoration-none mx-2 position-relative d-inline-block"
          >
            <i class="bi bi-cart3 fs-4"></i>
            <span v-if="cartItemCount > 0" class="cart-badge">
              {{ cartItemCount }}
            </span>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileSidebar"
            aria-controls="mobileSidebar"
            aria-label="Mở menu"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="mobileSidebar"
            aria-labelledby="mobileSidebarLabel"
          >
            <div class="offcanvas-header justify-content-end">
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body p-0 position-relative">
              <ul class="navbar-nav fw-normal text-dark custom-main-menu">
                <li class="nav-item">
                  <a class="custom-nav-link" href="/">TRANG CHỦ</a>
                </li>
                <li class="nav-item">
                  <a class="custom-nav-link" href="/product">SẢN PHẨM</a>
                </li>
                <li
                  v-for="parent in categories"
                  :key="parent.categoryId"
                  class="nav-item custom-has-dropdown"
                  :data-category-id="parent.categoryId"
                >
                  <a class="custom-nav-link custom-submenu-toggle" href="#">
                    {{ parent.categoryName }} <span class="float-end">></span>
                  </a>
                  <ul
                    class="custom-submenu"
                    v-show="parent.children && parent.children.length"
                  >
                    <li>
                      <a href="#" class="custom-back-btn"
                        >&lt; {{ parent.categoryName }}</a
                      >
                    </li>
                    <li v-for="child in parent.children" :key="child.categoryId">
                      <a
                        href="#"
                        @click.prevent="navigateToProducts(child.categoryName)"
                        data-bs-dismiss="offcanvas"
                      >
                        {{ child.categoryName }}
                      </a>
                    </li>
                  </ul>
                </li>
                <li v-if="isLoggedIn" class="nav-item custom-has-dropdown">
                  <a class="custom-nav-link custom-submenu-toggle" href="#"
                    >TỔNG QUAN TÀI KHOẢN <span class="float-end">></span></a
                  >
                  <ul class="custom-submenu">
                    <li>
                      <a href="#" class="custom-back-btn">&lt; TỔNG QUAN TÀI KHOẢN</a>
                    </li>
                    <li><a href="/user/profile">THÔNG TIN CỦA TÔI</a></li>
                    <li><a href="/user/change-password">ĐỔI MẬT KHẨU</a></li>
                    <li><a href="/user/address">ĐỊA CHỈ ĐẶT HÀNG</a></li>
                    <li><a href="#">ĐÁNH GIÁ CỦA TÔI</a></li>
                    <li><a href="#">MUA HÀNG & TRẢ HÀNG</a></li>
                    <li><a href="#">DANH SÁCH YÊU THÍCH</a></li>
                  </ul>
                </li>
              </ul>
              <div class="custom-bottom-section">
                <ul class="navbar-nav">
                  <li class="nav-item">
                    <a
                      class="custom-nav-link"
                      href="#"
                      v-if="!isLoggedIn"
                      @click.prevent="goToLogin"
                    >
                      <i class="bi bi-person fs-5"></i> ĐĂNG NHẬP
                    </a>
                    <a
                      class="custom-nav-link"
                      href="#"
                      v-else
                      @click.prevent="goToLogout"
                    >
                      <i class="bi bi-box-arrow-right fs-5"></i> ĐĂNG XUẤT
                    </a>
                  </li>
                  <li class="nav-item">
                    <div class="custom-sidebar-footer py-2 mt-3">
                      <p class="mb-0">Copyright © 2025 L'Hex</p>
                      <p class="mb-0">Powered by Haravan</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-100" style="border-bottom: 2px solid #e0e0e0"></div>
      <div class="mobile-search-wrapper d-lg-none">
        <form class="search-form" @submit.prevent="handleSearch">
          <div class="input-group">
            <input
              type="text"
              class="form-control search-input"
              placeholder="Tìm kiếm sản phẩm..."
              v-model="searchKeyword"
            />
            <button class="btn search-btn" type="submit">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </form>
      </div>
    </nav>

    <nav class="navbar navbar-expand-lg navbar-light bg-white d-none d-lg-block">
      <div class="container">
        <a class="navbar-brand" href="/">
          <img src="@/assets/img/logo-brand.png" alt="Nike Logo" height="54" />
        </a>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto fw-bold text-dark d-none d-lg-flex">
            <li class="nav-item">
              <a class="nav-link" href="/">Trang Chủ</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/product">Sản Phẩm</a>
            </li>
            <li
              v-for="parent in categories"
              :key="parent.categoryId"
              class="nav-item dropdown"
            >
              <a
                class="nav-link dropdown-toggle"
                href="#"
                :id="`desktopProductDropdown-${parent.categoryId}`"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ parent.categoryName }}
              </a>

              <ul
                v-if="parent.children && parent.children.length"
                class="dropdown-menu shadow border-0 rounded-4 mt-2 p-2 elegant-dropdown"
                :aria-labelledby="`desktopProductDropdown-${parent.categoryId}`"
              >
                <li v-for="child in parent.children" :key="child.categoryId" class="mb-1">
                  <a
                    class="dropdown-item px-3 py-2 rounded-3 fw-medium text-dark elegant-item"
                    href="#"
                    @click.prevent="navigateToProducts(child.categoryName)"
                  >
                    {{ child.categoryName }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <div class="d-none d-lg-flex align-items-center">
            <div v-if="isLoggedIn" class="dropdown position-relative">
              <a
                href="#"
                class="text-dark text-decoration-none mx-2"
                id="desktopUserDropdownToggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person fs-4"></i>
              </a>
              <ul
                class="dropdown-menu header_login_menu_dropdown custom-dropdown shadow-sm border-0 rounded-3 header_login_menu_registered"
                aria-labelledby="desktopUserDropdownToggle"
              >
                <li>
                  <a class="dropdown-item" href="/user/account">Tổng quan tài khoản</a>
                </li>
                <li>
                  <a class="dropdown-item" href="/user/order-management"
                    >Mua hàng & Trả hàng</a
                  >
                </li>
                <li>
                  <a class="dropdown-item text-danger" href="/logout">Đăng xuất</a>
                </li>
              </ul>
            </div>
            <div v-else>
              <a
                href="#"
                class="text-dark text-decoration-none mx-2"
                @click.prevent="goToLogin"
              >
                <i class="bi bi-person fs-4"></i>
              </a>
            </div>
            <a href="/user/favorite" class="text-dark text-decoration-none mx-2">
              <i class="bi bi-heart fs-4"></i>
            </a>
            <a
              href="/user/cart"
              class="text-dark text-decoration-none mx-2 position-relative d-inline-block"
            >
              <i class="bi bi-cart3 fs-4"></i>
              <span v-if="cartItemCount > 0" class="cart-badge">
                {{ cartItemCount }}
              </span>
            </a>
            <form
              @submit.prevent="handleSearch"
              class="search-box d-flex align-items-center ms-3"
            >
              <i class="bi bi-search me-2"></i>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm"
                v-model="searchKeyword"
              />
            </form>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style src="@/assets/css/header.css"></style>

<style scoped>
.badge {
  font-size: 0.75rem;
  line-height: 1;
  padding: 4px 6px;
  min-width: 20px;
  text-align: center;
}

.dropdown-submenu {
  position: relative;
}

.dropdown-submenu .dropdown-submenu-list {
  display: none;
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 200px;
  z-index: 1000;
  background-color: #fff;
  border-radius: 0.3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-submenu .dropdown-submenu-list.show {
  display: block;
}

#categoryDropdown {
  font-weight: bold;
  color: #333;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  color: #333;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #000;
}

.navbar-nav .dropdown-menu {
  min-width: 200px;
}
.elegant-dropdown {
  background: #fff; /* nền trắng tinh */
  backdrop-filter: blur(10px);
  min-width: 220px;
}

.elegant-item {
  transition: all 0.25s ease;
  border-left: 3px solid transparent;
}

.elegant-item:hover {
  background: #f2f2f2; /* nền xám nhạt khi hover */
  border-left: 3px solid #000; /* line đen khi hover */
  color: #000 !important; /* chữ đen rõ ràng */
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>
