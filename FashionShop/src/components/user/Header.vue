<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import initHeader from "@/assets/js/header.js";

const isLoggedIn = ref(false);
const router = useRouter();

function checkLoginStatus() {
  isLoggedIn.value = !!localStorage.getItem("token");
}

function goToLogin() {
  router.push("/login");
}

// Reset toàn bộ scroll của trang
function resetScrollLock() {
  document.body.classList.remove('modal-open');
  document.body.style.overflow = 'auto';
  document.body.style.paddingRight = '0';
}

function goToLogout() {
  localStorage.removeItem("token");
  isLoggedIn.value = false;

  resetScrollLock();
  router.push("/login");
}


onMounted(() => {
  initHeader();
  checkLoginStatus();

  // Theo dõi thay đổi localStorage từ tab khác
  window.addEventListener("storage", () => {
    checkLoginStatus();
  });
});

</script>

<template>
  <header>
    <div class="" style="background-color: #ccffcc">
      <div
        class="container d-flex flex-column flex-md-row justify-content-between align-items-center py-2"
      >
        <div class="contact-info d-none d-md-block">
          <a href="tel:0378447716">Hotline: 037 844 7716</a> |
          <a href="mailto:bytecrew@gmail.com">Gmail: bytecrew@gmail.com</a>
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
          <!-- <router-link to="/login" class="text-dark text-decoration-none me-3"
            >Đăng nhập</router-link
          > -->
        </div>
      </div>
    </div>

    <nav class="navbar navbar-light bg-white d-block d-lg-none">
      <div class="container">
        <a class="navbar-brand" href="#">
          <img src="@/assets/img/logo-brand.png" alt="Nike Logo" height="45" />
        </a>
        <div class="d-flex align-items-center d-lg-none">
          <a
            href="#"
            class="text-dark text-decoration-none mx-2"
            id="mobileUserDropdownToggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-people fs-4"></i>
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="mobileUserDropdownToggle"
            style="min-width: 200px"
          >
            <li>
              <a class="dropdown-item" href="/user/profile"
                ><i class="bi bi-pencil-square me-2"></i> Cập nhật thông tin</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="/user/change-password"
                ><i class="bi bi-key me-2"></i> Đổi mật khẩu</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="/user/address"
                ><i class="bi bi-geo-alt-fill me-2"></i> Địa chỉ của tôi</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="/user/order-history"
                ><i class="bi bi-box-seam me-2"></i> Đơn hàng</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="/user/Review/history"
                ><i class="bi bi-star-fill me-2"></i> Lịch sử đánh giá</a
              >
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <a class="dropdown-item text-danger" href="/logout"
                ><i class="bi bi-box-arrow-right me-2"></i> Đăng xuất</a
              >
            </li>
          </ul>

          <a href="/user/cart" class="text-dark text-decoration-none mx-2">
            <i class="bi bi-heart fs-4"></i>
          </a>

          <a href="/user/cart" class="text-dark text-decoration-none mx-2">
            <i class="bi bi-cart fs-4"></i>
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
                <li class="nav-item"><a class="custom-nav-link" href="#">HÀNG MỚI</a></li>
                <li class="nav-item">
                  <a class="custom-nav-link" href="#">BEST SELLER</a>
                </li>

                <li class="nav-item custom-has-dropdown">
                  <a class="custom-nav-link custom-submenu-toggle" href="#"
                    >TÚI <span class="float-end">></span></a
                  >
                  <ul class="custom-submenu">
                    <li><a href="#" class="custom-back-btn">&lt; TÚI</a></li>
                    <li><a href="#">XEM TẤT CẢ</a></li>
                    <li><a href="#">TÚI XÁCH</a></li>
                    <li><a href="#">TÚI ĐEO CHÉO</a></li>
                    <li><a href="#">TÚI ĐEO VAI</a></li>
                    <li><a href="#">TÚI TOTE & BALO</a></li>
                  </ul>
                </li>

                <li class="nav-item custom-has-dropdown">
                  <a class="custom-nav-link custom-submenu-toggle" href="#"
                    >VÍ <span class="float-end">></span></a
                  >
                  <ul class="custom-submenu">
                    <li><a href="#" class="custom-back-btn">&lt; VÍ</a></li>
                    <li><a href="#">VÍ NAM</a></li>
                    <li><a href="#">VÍ NỮ</a></li>
                  </ul>
                </li>

                <li class="nav-item custom-has-dropdown">
                  <a class="custom-nav-link custom-submenu-toggle" href="#"
                    >GIÀY <span class="float-end">></span></a
                  >
                  <ul class="custom-submenu">
                    <li><a href="#" class="custom-back-btn">&lt; GIÀY</a></li>
                    <li><a href="#">GIÀY SNEAKER</a></li>
                    <li><a href="#">GIÀY LƯỜI</a></li>
                  </ul>
                </li>

                <li class="nav-item custom-has-dropdown">
                  <a class="custom-nav-link custom-submenu-toggle" href="#"
                    >PHỤ KIỆN <span class="float-end">></span></a
                  >
                  <ul class="custom-submenu">
                    <li><a href="#" class="custom-back-btn">&lt; PHỤ KIỆN</a></li>
                    <li><a href="#">MŨ</a></li>
                    <li><a href="#">THẮT LƯNG</a></li>
                  </ul>
                </li>

                <li class="nav-item custom-has-dropdown">
                  <a class="custom-nav-link custom-submenu-toggle" href="#"
                    >BỘ SƯU TẬP <span class="float-end">></span></a
                  >
                  <ul class="custom-submenu">
                    <li><a href="#" class="custom-back-btn">&lt; BỘ SƯU TẬP</a></li>
                    <li><a href="#">XUÂN HÈ 2025</a></li>
                    <li><a href="#">THU ĐÔNG 2024</a></li>
                  </ul>
                </li>

                <li class="nav-item">
                  <a class="custom-nav-link" href="#">CÂU CHUYỆN</a>
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

                    <a class="custom-nav-link" href="#" v-else @click.prevent="goToLogout">
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
        <form class="search-form">
          <div class="input-group">
            <input
              type="text"
              class="form-control search-input"
              placeholder="Tìm kiếm sản phẩm..."
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
        <a class="navbar-brand" href="#">
          <img src="@/assets/img/logo-brand.png" alt="Nike Logo" height="54" />
        </a>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto fw-bold text-dark d-none d-lg-flex">
            <li class="nav-item"><a class="nav-link" href="/">Trang Chủ</a></li>
            <li class="nav-item"><a class="nav-link" href="/product">Sản Phẩm</a></li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="desktopProductDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >Áo</a
              >
              <ul
                class="dropdown-menu custom-dropdown shadow-sm border-0 rounded-3 mt-2"
                aria-labelledby="desktopProductDropdown"
              >
                <li><a class="dropdown-item" href="#">BST Teddy</a></li>
                <li><a class="dropdown-item" href="#">BST WooWoo</a></li>
                <li><a class="dropdown-item" href="#">Jersey</a></li>
                <li><a class="dropdown-item" href="#">Sơ Mi</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="desktopProductDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >Quần</a
              >
              <ul
                class="dropdown-menu custom-dropdown shadow-sm border-0 rounded-3 mt-2"
                aria-labelledby="desktopProductDropdown"
              >
                <li><a class="dropdown-item" href="#">BST Teddy</a></li>
                <li><a class="dropdown-item" href="#">BST WooWoo</a></li>
                <li><a class="dropdown-item" href="#">Jersey</a></li>
                <li><a class="dropdown-item" href="#">Sơ Mi</a></li>
              </ul>
            </li>
          </ul>

          <div class="d-none d-lg-flex align-items-center">
            <!-- Nếu ĐÃ đăng nhập: Hiện dropdown -->
            <div v-if="isLoggedIn" class="dropdown">
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
                class="dropdown-menu custom-dropdown shadow-sm border-0 rounded-3 mt-2"
                style="min-width: 240px"
                aria-labelledby="desktopUserDropdownToggle"
              >
                <li>
                  <a class="dropdown-item" href="/user/profile"
                    ><i class="bi bi-pencil-square me-2"></i> Cập nhật thông tin</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="/user/change-password"
                    ><i class="bi bi-key me-2"></i> Đổi mật khẩu</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="/user/address"
                    ><i class="bi bi-geo-alt-fill me-2"></i> Địa chỉ của tôi</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="/user/order-management"
                    ><i class="bi bi-box-seam me-2"></i> Đơn hàng</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="/user/review-history"
                    ><i class="bi bi-star-fill me-2"></i> Lịch sử đánh giá</a
                  >
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item text-danger" href="/logout"
                    ><i class="bi bi-box-arrow-right me-2"></i> Đăng xuất</a
                  >
                </li>
              </ul>
            </div>

            <!-- Nếu CHƯA đăng nhập: Chuyển đến login -->
            <div v-else>
              <a
                href="#"
                class="text-dark text-decoration-none mx-2"
                @click.prevent="goToLogin"
              >
                <i class="bi bi-person fs-4"></i>
              </a>
            </div>

            <a href="/user/cart" class="text-dark text-decoration-none mx-2">
              <i class="bi bi-heart fs-4"></i>
            </a>

            <a href="/user/cart" class="text-dark text-decoration-none mx-2">
              <i class="bi bi-cart fs-4"></i>
            </a>

            <div class="search-box d-flex align-items-center ms-3">
              <i class="bi bi-search me-2"></i>
              <input type="text" class="form-control" placeholder="Tìm kiếm" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style src="./src/assets/css/header.css"></style>
