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
    title: "L'Hex Fashion",
    description:
      "L'Hex – thương hiệu thời trang mang phong cách tinh tế và hiện đại. Chúng tôi mang đến những thiết kế độc quyền, chất liệu cao cấp, giúp bạn tự tin khẳng định dấu ấn riêng.",
    button: "Khám phá ngay",
    link: "/about"
  },
  {
  img: "https://pos.nvncdn.com/0406df-94299/bn/20250322_RxPFgkXR.gif?v=1742614529",
  title: "Liên Hệ L'Hex",
  description:
    "Bạn cần hỗ trợ hoặc tư vấn? Đội ngũ L'Hex luôn sẵn sàng đồng hành cùng bạn.",
  button: "Liên hệ ngay",
  link: "/contact-us" // trang liên hệ của bạn
},
  {
  img: "https://pos.nvncdn.com/0406df-94299/bn/20250321_tlTuPeU0.gif?v=1742614357",
  title: "Sản Phẩm Nổi Bật",
  description:
    "Khám phá bộ sưu tập thời trang đa dạng tại L'Hex – phong cách hiện đại, chất lượng vượt trội.",
  button: "Xem sản phẩm",
  link: "/product"
}
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
