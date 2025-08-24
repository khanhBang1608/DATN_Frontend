<template>
  <footer class="footer text-dark pt-5" style="background-color: #f1f1f1">
    <div class="container footer-container">
      <div class="row g-4">
        <!-- Mobile layout -->
        <div class="d-block d-md-none">
          <div class="col-md-4 footer-column">
            <p class="mb-1">
              <strong>CÔNG TY CỔ PHẦN MAISON RETAIL MANAGEMENT INTERNATIONAL</strong>
            </p>
            <p class="mb-1">
              Địa chỉ:
              <a
                href="https://maps.app.goo.gl/a6NAqAEtyZ1hUZKc8"
                target="_blank"
                class="text-decoration-none text-dark"
              >
                Toà nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ
              </a>
            </p>
            <p class="mb-1">
              Hotline:
              <a href="tel:0779824008" class="text-decoration-none text-dark">
                077 9824 008
              </a>
            </p>
            <p class="mb-2">
              Email:
              <a href="mailto:Bangtkpc08621@gmail.com" class="text-decoration-none text-dark">
                Bangtkpc08621@gmail.com
              </a>
            </p>
          </div>
          <!-- <div class="footer-column mb-4">
            <h6 class="footer-heading fw-bold">
              ĐĂNG KÝ ĐỂ NHẬN CÁC THÔNG TIN THỜI TRANG MỚI NHẤT
            </h6>
            <form class="footer-newsletter d-flex">
              <input
                type="email"
                class="footer-input"
                placeholder="Đăng ký nhận bản tin của chúng tôi"
              />
              <button class="footer-btn">Đăng Ký</button>
            </form>
          </div> -->

          <div class="col-md-4 text-md-start">
            <div class="footer-social d-flex justify-content-md-start gap-3">
              <a
                href="https://www.facebook.com/tenTrangFacebookCuaBan"
                target="_blank"
                class="footer-social-icon"
              >
                <i class="bi bi-facebook fs-4"></i>
              </a>
              <a
                href="https://www.instagram.com/tenInstagramCuaBan"
                target="_blank"
                class="footer-social-icon"
              >
                <i class="bi bi-instagram fs-4"></i>
              </a>
              <a
                href="https://www.youtube.com/channel/tenKenhYouTubeCuaBan"
                target="_blank"
                class="footer-social-icon"
              >
                <i class="bi bi-youtube fs-4"></i>
              </a>
              <a
                href="https://www.tiktok.com/@tenTikTokCuaBan"
                target="_blank"
                class="footer-social-icon"
              >
                <i class="bi bi-tiktok fs-4"></i>
              </a>
            </div>
          </div>

          <div class="accordion mt-3" id="footerAccordionMobile">
            <!-- Cột 1 -->
            <div class="accordion-item">
              <h2 class="accordion-header" id="heading1">
                <button
                  class="accordion-button collapsed accordion-button-custom"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse1"
                  aria-expanded="false"
                  aria-controls="collapse1"
                >
                  CẦN GIÚP ĐỠ?
                </button>
              </h2>
              <div
                id="collapse1"
                class="accordion-collapse collapse"
                aria-labelledby="heading1"
                data-bs-parent="#footerAccordionMobile"
              >
                <div class="accordion-body">
                  <ul class="list-unstyled small ps-3">
                    <li><a href="#">Kiểm tra trạng thái đơn hàng</a></li>
                    <li><a href="#">Câu hỏi thường gặp</a></li>
                    <li><a href="#">Liên hệ</a></li>
                    <li><a href="#">CẢNH GIÁC LỪA ĐẢO</a></li>
                    <li><a href="#">Ưu đãi thành viên</a></li>
                    <li><a href="#">Chính sách Giao Hàng</a></li>
                    <li><a href="#">Chính sách Bảo hành & Đổi trả</a></li>
                    <li><a href="#">Bảng quy đổi kích thước</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="heading2">
                <button
                  class="accordion-button collapsed accordion-button-custom"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse2"
                  aria-expanded="false"
                  aria-controls="collapse2"
                >
                  VỀ CHÚNG TÔI
                </button>
              </h2>
              <div
                id="collapse2"
                class="accordion-collapse collapse"
                aria-labelledby="heading2"
                data-bs-parent="#footerAccordionMobile"
              >
                <div class="accordion-body">
                  <ul class="list-unstyled small ps-3">
                    <li><a href="#">Về thương hiệu</a></li>
                    <li><a href="#">Phát triển bền vững</a></li>
                    <li><a href="#">Nhượng quyền thương mại</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="heading3">
                <button
                  class="accordion-button collapsed accordion-button-custom"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse3"
                  aria-expanded="false"
                  aria-controls="collapse3"
                >
                  MUA SẮM NÀO
                </button>
              </h2>
              <div
                id="collapse3"
                class="accordion-collapse collapse"
                aria-labelledby="heading3"
                data-bs-parent="#footerAccordionMobile"
              >
                <div class="accordion-body">
                  <ul class="list-unstyled small ps-3">
                    <li><a href="#">Định vị cửa hàng</a></li>
                    <li><a href="#">Hướng dẫn thời trang</a></li>
                    <li><a href="#">Khuyến mãi</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="heading4">
                <button
                  class="accordion-button collapsed accordion-button-custom"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse4"
                  aria-expanded="false"
                  aria-controls="collapse4"
                >
                  PHÁP LÝ
                </button>
              </h2>
              <div
                id="collapse4"
                class="accordion-collapse collapse"
                aria-labelledby="heading4"
                data-bs-parent="#footerAccordionMobile"
              >
                <div class="accordion-body">
                  <ul class="list-unstyled small ps-3">
                    <li><a href="#">Điều khoản sử dụng</a></li>
                    <li><a href="#">Chính sách bảo mật</a></li>
                    <li><a href="#">Chính sách Cookies</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop layout -->
        <div class="d-none d-md-flex flex-wrap w-100">
          <div class="col-md-2 footer-column">
            <h6 class="footer-heading fw-bold">CẦN GIÚP ĐỠ?</h6>
            <ul class="footer-list list-unstyled small">
              <li><a href="#">Kiểm tra trạng thái đơn hàng</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">CẢNH GIÁC LỪA ĐẢO</a></li>
              <li><a href="#">Ưu đãi thành viên</a></li>
              <li><a href="#">Chính sách Giao Hàng</a></li>
              <li><a href="#">Chính sách Bảo hành & Đổi trả</a></li>
              <li><a href="#">Bảng quy đổi kích thước</a></li>
            </ul>
          </div>

          <div class="col-md-2 footer-column">
            <h6 class="footer-heading fw-bold">VỀ CHÚNG TÔI</h6>
            <ul class="footer-list list-unstyled small">
              <li><a href="#">Về thương hiệu</a></li>
              <li><a href="#">Phát triển bền vững</a></li>
              <li><a href="#">Nhượng quyền thương mại</a></li>
            </ul>
          </div>

          <div class="col-md-2 footer-column">
            <h6 class="footer-heading fw-bold">MUA SẮM NÀO</h6>
            <ul class="footer-list list-unstyled small">
              <li><a href="#">Định vị cửa hàng</a></li>
              <li><a href="#">Hướng dẫn thời trang</a></li>
              <li><a href="#">Khuyến mãi</a></li>
            </ul>
          </div>

          <div class="col-md-2 footer-column">
            <h6 class="footer-heading fw-bold">PHÁP LÝ</h6>
            <ul class="footer-list list-unstyled small">
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Chính sách Cookies</a></li>
            </ul>
          </div>

          <!-- <div class="col-md-4 footer-column">
            <h6 class="footer-heading fw-bold">
              ĐĂNG KÝ ĐỂ NHẬN CÁC THÔNG TIN THỜI TRANG MỚI NHẤT
            </h6>
            <form class="footer-newsletter d-flex">
              <input
                type="email"
                class="footer-input"
                placeholder="Đăng ký nhận bản tin của chúng tôi"
              />
              <button class="footer-btn">Đăng Ký</button>
            </form>
          </div> -->
          <div class="col-md-4 footer-column">
            <p class="mb-1">
              <strong>CÔNG TY CỔ PHẦN L'HEX INTERNATIONAL FASHION TRADING</strong>
            </p>
            <p class="mb-1">
              Địa chỉ:
              <a
                href="https://maps.app.goo.gl/a6NAqAEtyZ1hUZKc8"
                target="_blank"
                class="text-decoration-none text-dark"
              >
                Toà nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ
              </a>
            </p>
            <p class="mb-1">
              Hotline:
              <a href="tel:0779824008" class="text-decoration-none text-dark">
                077 9824 008
              </a>
            </p>
            <p class="mb-2">
              Email:
              <a href="mailto:Bangtkpc08621@gmail.com" class="text-decoration-none text-dark">
                Bangtkpc08621@gmail.com
              </a>
            </p>

            <p class="footer-heading fw-bold mb-2 mt-5">THEO DÕI CHÚNG TÔI</p>
            <div class="footer-social d-flex justify-content-md-start gap-3">
              <a
                href="https://www.facebook.com/tenTrangFacebookCuaBan"
                target="_blank"
                class="footer-social-icon"
              >
                <i class="bi bi-facebook fs-4"></i>
              </a>
              <a
                href="https://www.instagram.com/tenInstagramCuaBan"
                target="_blank"
                class="footer-social-icon"
              >
                <i class="bi bi-instagram fs-4"></i>
              </a>
              <a
                href="https://www.youtube.com/channel/tenKenhYouTubeCuaBan"
                target="_blank"
                class="footer-social-icon"
              >
                <i class="bi bi-youtube fs-4"></i>
              </a>
              <a
                href="https://www.tiktok.com/@tenTikTokCuaBan"
                target="_blank"
                class="footer-social-icon"
              >
                <i class="bi bi-tiktok fs-4"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="row mt-3">
        <div class="col-md-8 footer-company-info small">
          <p class="mb-1">
            <strong>CÔNG TY CỔ PHẦN MAISON RETAIL MANAGEMENT INTERNATIONAL</strong>
          </p>
          <p class="mb-1">
            Địa chỉ:
            <a
              href="https://maps.app.goo.gl/a6NAqAEtyZ1hUZKc8"
              target="_blank"
              class="text-decoration-none text-dark"
            >
              Toà nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ
            </a>
          </p>
          <p class="mb-1">
            Hotline:
            <a href="tel:0378447716" class="text-decoration-none text-dark">
              0378 447 716
            </a>
          </p>
          <p class="mb-0">
            Email:
            <a href="mailto:customers@lhex.vn" class="text-decoration-none text-dark">
              customers@lhex.vn
            </a>
          </p>
        </div>

        <div class="col-md-4 text-md-start d-none d-md-block">
          <p class="footer-heading fw-bold mb-2">THEO DÕI CHÚNG TÔI</p>
          <div class="footer-social d-flex justify-content-md-start gap-3">
            <a
              href="https://www.facebook.com/tenTrangFacebookCuaBan"
              target="_blank"
              class="footer-social-icon"
            >
              <i class="bi bi-facebook fs-4"></i>
            </a>
            <a
              href="https://www.instagram.com/tenInstagramCuaBan"
              target="_blank"
              class="footer-social-icon"
            >
              <i class="bi bi-instagram fs-4"></i>
            </a>
            <a
              href="https://www.youtube.com/channel/tenKenhYouTubeCuaBan"
              target="_blank"
              class="footer-social-icon"
            >
              <i class="bi bi-youtube fs-4"></i>
            </a>
            <a
              href="https://www.tiktok.com/@tenTikTokCuaBan"
              target="_blank"
              class="footer-social-icon"
            >
              <i class="bi bi-tiktok fs-4"></i>
            </a>
          </div>
        </div>
      </div> -->
    </div>

    <hr
      class="my-2 d-none d-md-block"
      style="height: 1px; background-color: #000; border: none"
    />

    <div class="text-center mt-3 text-muted small footer-copyright">
      © L'HEX, bản quyền được bảo hộ
    </div>
  </footer>
</template>
<style src="@/assets/css/footer.css"></style>
