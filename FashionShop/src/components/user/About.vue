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
          LHEX được thành lập với mục tiêu mang đến cho giới trẻ Việt Nam những thiết kế thời trang hiện đại, 
          cá tính và luôn bắt kịp xu hướng quốc tế. Chúng tôi không chỉ bán sản phẩm, mà còn truyền tải phong cách 
          sống năng động, tự tin và sáng tạo cho thế hệ mới.
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
              <p>Trở thành thương hiệu thời trang Việt dẫn đầu tại Đông Nam Á, vươn tầm quốc tế.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="value-card p-4 h-100">
              <h4>Sứ Mệnh</h4>
              <p>Mang lại sản phẩm thời trang chất lượng, sáng tạo và phù hợp phong cách sống hiện đại.</p>
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
            <img src="@/assets/img/slideshow_1.png" alt="LHEX Logo" class="img-fluid rounded shadow-sm" />
          </div>
          <div class="col-md-4">
            <img src="@/assets/img/slideshow_1.png" alt="LHEX Logo" class="img-fluid rounded shadow-sm" />
          </div>
          <div class="col-md-4">
            <img src="@/assets/img/slideshow_1.png" alt="LHEX Logo" class="img-fluid rounded shadow-sm" />
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
        <p class="mb-4">Trải nghiệm phong cách hiện đại và cá tính từ những bộ sưu tập mới nhất.</p>
        <a href="/product" class="btn btn-dark px-4 py-2">Mua Sắm Ngay</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero */
.hero-section {
  background: url("https://source.unsplash.com/1600x800/?fashion,brand") center/cover no-repeat;
  min-height: 80vh;
  position: relative;
  color: #fff;
}
.hero-section .overlay {
  position: absolute;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.55);
}
.hero-title {
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
}
.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-top: 10px;
}

/* Highlights */
.highlight-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111;
}

/* Sections */
.section-container {
  padding: 70px 20px;
}
.section-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: bold;
  position: relative;
}
.section-title::after {
  content: "";
  width: 60px; height: 3px;
  background: #111;
  display: block;
  margin: 10px auto 0;
}
.section-paragraph {
  line-height: 1.8;
  font-size: 1rem;
  color: #444;
  text-align: justify;
}

/* Values */
.value-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}
.value-card:hover {
  transform: translateY(-5px);
}

/* Timeline */
.timeline {
  list-style: none;
  padding-left: 0;
  position: relative;
}
.timeline li {
  padding: 15px 0;
  border-left: 3px solid #111;
  padding-left: 20px;
  margin-left: 20px;
  position: relative;
}
.timeline li::before {
  content: "";
  width: 14px; height: 14px;
  background: #111;
  border-radius: 50%;
  position: absolute;
  left: -8px; top: 20px;
}
.timeline .year {
  font-weight: bold;
  margin-right: 10px;
  color: #111;
}

/* CTA */
.cta-section {
  background: #f8f9fa;
}
.cta-section h2 {
  font-weight: bold;
}
</style>
