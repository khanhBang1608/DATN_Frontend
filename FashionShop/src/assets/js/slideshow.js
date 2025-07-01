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
      img: "https://picsum.photos/id/1025/1920/1080",
      title: "Galaxy S24 Ultra",
      description:
        "Trải nghiệm đột phá với AI. Sáng tạo, mạnh mẽ và hiệu quả hơn bao giờ hết.",
      button: "Tìm hiểu ngay",
    },
    {
      img: "https://picsum.photos/id/1026/1920/1080",
      title: "Neo QLED 8K",
      description: "Mở ra kỷ nguyên TV siêu thực, với độ chi tiết vượt thời gian.",
      button: "Khám phá",
    },
    {
      img: "https://picsum.photos/id/1027/1920/1080",
      title: "Galaxy Watch6",
      description: "Giấc ngủ trọn vẹn, sức khỏe toàn diện trong tầm tay bạn.",
      button: "Đặt mua ngay",
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
