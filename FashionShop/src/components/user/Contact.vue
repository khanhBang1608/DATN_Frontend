<template>
    <div class="policy-page">
        <!-- Hero -->
        <div class="hero-section">
            <div class="hero-content text-center">
                <h3 class="hero-title">CHÍNH SÁCH & ĐIỀU KHOẢN</h3>
                <p class="hero-subtitle">
                    Cảm ơn bạn đã tin tưởng mua sắm tại <strong>FashionStore</strong>.
                    Vui lòng đọc kỹ các điều khoản để đảm bảo quyền lợi của bạn.
                </p>
            </div>
        </div>

        <!-- Nội dung -->
        <div class="section-container">
            <!-- Mục lục -->
            <div class="policy-toc mb-5">
                <h5 class="fw-bold">Mục lục</h5>
                <a href="#dieu-khoan">1. Điều khoản sử dụng</a>
                <a href="#bao-mat">2. Chính sách bảo mật</a>
                <a href="#doi-tra">3. Chính sách đổi trả</a>
                <a href="#giao-hang">4. Chính sách giao hàng</a>
                <a href="#lien-he">5. Liên hệ hỗ trợ</a>
            </div>

            <!-- Điều khoản sử dụng -->
            <section id="dieu-khoan" class="policy-block">
                <h2 class="section-title">1. Điều khoản sử dụng</h2>
                <p class="section-paragraph">
                    Khi truy cập và mua sắm trên trang web của chúng tôi, bạn đồng ý tuân thủ
                    các điều khoản và điều kiện được nêu ra. Mọi hành vi gian lận, giả mạo thông tin
                    sẽ bị xử lý theo quy định của pháp luật.
                </p>
            </section>

            <!-- Chính sách bảo mật -->
            <section id="bao-mat" class="policy-block">
                <h2 class="section-title">2. Chính sách bảo mật</h2>
                <p class="section-paragraph">
                    Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng.
                    Mọi dữ liệu được thu thập chỉ phục vụ cho mục đích giao dịch và chăm sóc khách hàng,
                    không chia sẻ cho bên thứ ba nếu không có sự đồng ý của bạn.
                </p>
            </section>

            <!-- Chính sách đổi trả -->
            <section id="doi-tra" class="policy-block">
                <h2 class="section-title">3. Chính sách đổi trả</h2>
                <p class="section-paragraph">
                    Bạn có thể đổi/trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng
                    nếu sản phẩm bị lỗi do nhà sản xuất hoặc không đúng với mô tả.
                    Sản phẩm phải còn nguyên tem, nhãn và chưa qua sử dụng.
                </p>
            </section>

            <!-- Chính sách giao hàng -->
            <section id="giao-hang" class="policy-block">
                <h2 class="section-title">4. Chính sách giao hàng</h2>
                <p class="section-paragraph">
                    Thời gian giao hàng từ 2-5 ngày làm việc tùy khu vực.
                    Chúng tôi hợp tác với các đơn vị vận chuyển uy tín để đảm bảo sản phẩm
                    được giao đến tay khách hàng một cách nhanh chóng và an toàn.
                </p>
            </section>

            <!-- Liên hệ hỗ trợ -->
            <!-- Liên hệ hỗ trợ -->
            <section id="lien-he" class="policy-block">
                <h2 class="section-title">5. Liên hệ hỗ trợ</h2>
                <div class="contact-card">
                    <p>
                        Nếu bạn cần hỗ trợ hoặc có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi:
                    </p>
                    <div class="contact-item">
                        <span class="contact-label">📧 Email:</span>
                        <a href="mailto:support@fashionstore.com">support@fashionstore.com</a>
                    </div>
                    <div class="contact-item">
                        <span class="contact-label">📞 Hotline:</span>
                        <a href="tel:0555555555">05555555555</a>
                    </div>
                    <div class="contact-item">
                        <span class="contact-label">💬 Fanpage:</span>
                        <a href="https://www.facebook.com/profile.php?id=61579756310291" target="_blank">Facebook FashionStore</a>
                    </div>
                </div>
            </section>

        </div>
    </div>
</template>

<script>
export default {
    name: "PolicyPage"
};
</script>

<style scoped>
.policy-page {
    background-color: #fff;
    overflow-x: hidden;
}

/* Hero Section */
.hero-section {
    background: url('banner-policy.jpg') no-repeat center center/cover;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    position: relative;
}

.hero-section::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
}

.hero-content {
    position: relative;
    z-index: 1;
    padding: 0 15px;
}

.hero-title {
    font-size: 2.5rem;
    font-weight: bold;
}

.hero-subtitle {
    max-width: 700px;
    margin: 1rem auto 0;
    font-size: 1.1rem;
}

/* Sections */
.section-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 15px;
}

.section-title {
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.4rem;
}

.section-paragraph {
    text-align: justify;
    margin-bottom: 24px;
    line-height: 1.6;
    font-size: 0.95rem;
}

/* TOC */
.policy-toc {
    background: #f8faff;
    border-left: 4px solid #0d6efd;
    padding: 20px;
    border-radius: 8px;
}

.policy-toc a {
    display: block;
    padding: 6px 0;
    color: #0d6efd;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
}

.policy-toc a:hover {
    text-decoration: underline;
    color: #084298;
    padding-left: 4px;
}

.policy-block {
    margin-bottom: 40px;
}

/* Contact list */
.contact-list {
    padding-left: 20px;
    list-style: disc;
}

.contact-list a {
    color: #0d6efd;
    text-decoration: none;
}

.contact-list a:hover {
    text-decoration: underline;
}

/* Responsive */
@media (max-width: 767.98px) {
    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
        padding: 0 10px;
    }

    .section-title {
        font-size: 1.2rem;
    }
}
</style>
