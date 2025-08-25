<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="hero-section d-flex align-items-center text-center">
      <div class="overlay"></div>
      <div class="container position-relative">
        <h1 class="hero-title">LHEX</h1>
        <p class="hero-subtitle">Khẳng định phong cách – Dẫn đầu xu hướng</p>
      </div>
    </section>

    <!-- Highlights -->
    <section class="highlights py-5 bg-light">
      <div class="container text-center">
        <div class="row g-4">
          <div class="col-md-3">
            <h2 class="highlight-number">1+</h2>
            <p>Năm kinh nghiệm</p>
          </div>
          <div class="col-md-3">
            <h2 class="highlight-number">1+</h2>
            <p>Cửa hàng trên toàn quốc</p>
          </div>
          <div class="col-md-3">
            <h2 class="highlight-number">1M+</h2>
            <p>Khách hàng hài lòng</p>
          </div>
          <div class="col-md-3">
            <h2 class="highlight-number">200+</h2>
            <p>Mẫu thiết kế mỗi năm</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us -->
    <section class="section-container">
      <div class="container">
        <h2 class="section-title">Về Chúng Tôi</h2>
        <p class="section-paragraph">
          LHEX được thành lập với mục tiêu mang đến cho giới trẻ Việt Nam những thiết kế
          thời trang hiện đại, cá tính và luôn bắt kịp xu hướng quốc tế. Chúng tôi không
          chỉ bán sản phẩm, mà còn truyền tải phong cách sống năng động, tự tin và sáng
          tạo cho thế hệ mới.
        </p>
      </div>
    </section>

    <!-- Vision - Mission - Values -->
    <section class="values py-5 bg-light">
      <div class="container">
        <div class="row g-4 text-center">
          <div class="col-md-4">
            <div class="value-card p-4 h-100">
              <h4>Tầm Nhìn</h4>
              <p>
                Trở thành thương hiệu thời trang Việt dẫn đầu tại Đông Nam Á, vươn tầm
                quốc tế.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="value-card p-4 h-100">
              <h4>Sứ Mệnh</h4>
              <p>
                Mang lại sản phẩm thời trang chất lượng, sáng tạo và phù hợp phong cách
                sống hiện đại.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="value-card p-4 h-100">
              <h4>Giá Trị Cốt Lõi</h4>
              <p>Đổi mới – Sáng tạo – Trách nhiệm xã hội – Khách hàng là trung tâm.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="gallery-section py-5">
      <div class="container">
        <h2 class="section-title">Không Gian & Bộ Sưu Tập</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <img
              src="@/assets/img/AO31.jpg"
              alt="LHEX Logo"
              class="img-fluid rounded shadow-sm"
            />
          </div>
          <div class="col-md-4">
            <img
              src="@/assets/img/slideshow_1.png"
              alt="LHEX Logo"
              class="img-fluid rounded shadow-sm"
            />
          </div>
          <div class="col-md-4">
            <img
              src="@/assets/img/AO34.jpeg"
              alt="LHEX Logo"
              class="img-fluid rounded shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="timeline-section py-5 bg-light">
      <div class="container">
        <h2 class="section-title">Hành Trình LHEX</h2>
        <ul class="timeline">
          <li>
            <span class="year">2025</span>
            Thành lập thương hiệu LHEX với cửa hàng đầu tiên tại TP.Cần Thơ.
          </li>
          <!-- <li>
            <span class="year">2016</span>
            Ra mắt bộ sưu tập "Urban Streetwear" – đánh dấu bước đột phá.
          </li>
          <li>
            <span class="year">2020</span>
            Mở rộng hệ thống 30 cửa hàng trên toàn quốc và kênh bán hàng online.
          </li>
          <li>
            <span class="year">2024+</span>
            Định hướng phát triển ra thị trường Đông Nam Á.
          </li> -->
        </ul>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section text-center py-5">
      <div class="container">
        <h2 class="mb-3">Khám Phá Thế Giới Thời Trang Cùng LHEX</h2>
        <p class="mb-4">
          Trải nghiệm phong cách hiện đại và cá tính từ những bộ sưu tập mới nhất.
        </p>
        <a href="/product" class="btn btn-dark px-4 py-2">Mua Sắm Ngay</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero */
/* Hero */
.hero-section {
  background: #3b3a3a; /* nền đen sang trọng */
  min-height: 45vh; /* thấp hơn thay vì 85vh */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  padding: 60px 20px; /* thêm padding cho thoáng */
}
.hero-section .overlay {
  display: none; /* bỏ overlay vì không còn ảnh */
}
.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.hero-subtitle {
  font-size: 1.2rem;
  margin-top: 10px;
  opacity: 0.9;
}

/* Highlights */
.highlights {
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
}
.highlight-number {
  font-size: 2.8rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 5px;
}
.highlights p {
  font-size: 1rem;
  color: #555;
  margin: 0;
}

/* Sections */
.section-container {
  padding: 80px 20px;
}
.section-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #111;
  position: relative;
}
.section-title::after {
  content: "";
  width: 80px;
  height: 3px;
  background: #000;
  display: block;
  margin: 12px auto 0;
  border-radius: 2px;
}
.section-paragraph {
  line-height: 1.9;
  font-size: 1.05rem;
  color: #444;
  text-align: justify;
  max-width: 850px;
  margin: 0 auto;
}

/* Values */
.values {
  background: #f8f9fa;
}
.value-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #eee;
}
.value-card h4 {
  font-weight: 700;
  margin-bottom: 12px;
}
.value-card p {
  color: #555;
  line-height: 1.7;
}
.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

/* Gallery */
.gallery-section img {
  transition: all 0.4s ease;
  border-radius: 12px;
}
.gallery-section img:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Timeline */
.timeline {
  list-style: none;
  padding-left: 0;
  margin: 0 auto;
  max-width: 700px;
  position: relative;
}
.timeline li {
  padding: 20px 0 20px 25px;
  border-left: 3px solid #111;
  position: relative;
  color: #444;
}
.timeline li::before {
  content: "";
  width: 16px;
  height: 16px;
  background: #111;
  border-radius: 50%;
  position: absolute;
  left: -9px;
  top: 28px;
  box-shadow: 0 0 0 4px #fff;
}
.timeline .year {
  font-weight: 700;
  color: #000;
  margin-right: 8px;
  font-size: 1.1rem;
}

/* CTA */
.cta-section {
  background: linear-gradient(135deg, #111, #333);
  color: #fff;
}
.cta-section h2 {
  font-weight: 700;
  font-size: 2rem;
}
.cta-section p {
  font-size: 1.1rem;
  opacity: 0.9;
}
.cta-section .btn {
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}
.cta-section .btn:hover {
  background: #fff;
  color: #111;
}
</style>
