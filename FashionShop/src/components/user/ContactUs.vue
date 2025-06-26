<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Liên hệ</a
      >
    </nav>
  </div>
  <div class="container contact-section">
    <div class="row">
      <!-- Form liên hệ -->
      <div class="col-md-6 border-md-end pe-md-4 mb-4 mb-md-0">
        <h4 class="contact-title">LIÊN HỆ VỚI CHÚNG TÔI</h4>
        <p class="contact-subtitle">
          Chúng tôi ở đây để giúp bạn! Hãy liên hệ với chúng tôi bằng cách nhấp vào các
          liên kết này hoặc điền vào biểu mẫu bên dưới.
        </p>

        <div class="contact-icons">
          <a href="tel:02836205555" class="text-dark" title="Gọi điện">
            <i class="bi bi-telephone"></i>
          </a>
          <a href="mailto:email@example.com" class="text-dark" title="Gửi email">
            <i class="bi bi-envelope"></i>
          </a>
          <a
            href="https://www.facebook.com/tentrangcuaban"
            target="_blank"
            class="text-dark"
            title="Facebook"
          >
            <i class="bi bi-facebook"></i>
          </a>
          <a
            href="https://www.instagram.com/ten_trang_cua_ban"
            target="_blank"
            class="text-dark"
            title="Instagram"
          >
            <i class="bi bi-instagram"></i>
          </a>
        </div>

        <form class="contact-form">
          <div class="row mb-3">
            <div class="col">
              <input type="text" class="form-control" placeholder="Họ và tên" />
            </div>
            <div class="col">
              <input type="email" class="form-control" placeholder="Email" />
            </div>
          </div>
          <div class="mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Số điện thoại (Ví dụ: 02836205555)"
            />
          </div>
          <div class="mb-3">
            <select class="form-select">
              <option selected disabled>Vui lòng chọn lý do liên hệ</option>
              <option>Hỗ trợ kỹ thuật</option>
              <option>Yêu cầu báo giá</option>
              <option>Góp ý / Khiếu nại</option>
              <option>Khác</option>
            </select>
          </div>
          <div class="mb-3">
            <textarea
              class="form-control"
              rows="5"
              placeholder="Nội dung tin nhắn"
            ></textarea>
          </div>
          <button type="submit" class="btn contact-send-btn w-100">GỬI TIN NHẮN</button>
        </form>
      </div>

      <!-- Bản đồ -->
      <div class="col-md-6 contact-map ps-md-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.4204947420253!2d105.7556524748455!3d9.982081490122395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08906415c355f%3A0x416815a99ebd841e!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1750357924571!5m2!1svi!2s"
          width="600"
          height="450"
          style="border: 0"
          allowfullscreen="true"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/contact-us.css"></style>
