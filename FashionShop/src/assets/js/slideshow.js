import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import CSS nếu bạn chưa import qua CDN
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function initSlideshow() {
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
}
