import { onMounted, nextTick } from "vue";
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function useSlideshow() {
  const slides = [
  {
    img: "https://theme.hstatic.net/200001023102/1001370296/14/slide_3_img.jpg?v=106",
    title: "Bộ sưu tập Thu Đông 2025",
    description:
      "Phong cách hiện đại, chất liệu cao cấp – Tỏa sáng mọi khoảnh khắc.",
    button: "Mua ngay",
  },
  {
    img: "https://pos.nvncdn.com/0406df-94299/bn/20250322_RxPFgkXR.gif?v=1742614529",
    title: "Áo Khoác Thời Thượng",
    description: "Giữ ấm và nổi bật – thiết kế dành riêng cho bạn.",
    button: "Khám phá ngay",
  },
  {
    img: "https://pos.nvncdn.com/0406df-94299/bn/20250321_tlTuPeU0.gif?v=1742614357",
    title: "Giày Sneaker Hot Trend",
    description: "Thoải mái vận động – Đậm cá tính thời trang.",
    button: "Thêm vào giỏ",
  },
];


  const initSlideshow = () => {
    new Swiper('.slider', {
      modules: [Navigation, Pagination, Autoplay, EffectFade],
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: '.slider-nav-next',
        prevEl: '.slider-nav-prev',
      },
      pagination: {
        el: '.slider-pagination',
        clickable: true,
        bulletClass: 'slider-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
        renderBullet: function (index, className) {
          return `<span class="${className}"></span>`;
        },
      },

    });
  };

  onMounted(() => {
    nextTick(() => {
      initSlideshow();
    });
  });

  return { slides };
}
