import Swiper from "swiper/bundle";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

let newSwiperInstance = null;
let lastDeviceMode = window.innerWidth < 992 ? 'mobile' : 'desktop';

export const newProducts = [
  {
    name: "TSUN Quần Dài Rộng Ống Suông Wash Xám",
    discount: "-25%",
    discountedPrice: "630,000",
    originalPrice: "840,000",
    imageDefault: "src/assets/img/slideshow_1.png",
    imageHover: "Logo_1200x1200.png",
  },
    {
    name: "TSUN Quần Dài Rộng Ống Suông Wash Xám",
    discount: "-25%",
    discountedPrice: "630,000",
    originalPrice: "840,000",
    imageDefault: "src/assets/img/slideshow_1.png",
    imageHover: "Logo_1200x1200.png",
  },
    {
    name: "TSUN Quần Dài Rộng Ống Suông Wash Xám",
    discount: "-25%",
    discountedPrice: "630,000",
    originalPrice: "840,000",
    imageDefault: "src/assets/img/slideshow_1.png",
    imageHover: "Logo_1200x1200.png",
  },
    {
    name: "TSUN Quần Dài Rộng Ống Suông Wash Xám",
    discount: "-25%",
    discountedPrice: "630,000",
    originalPrice: "840,000",
    imageDefault: "src/assets/img/slideshow_1.png",
    imageHover: "Logo_1200x1200.png",
  },
    {
    name: "TSUN Quần Dài Rộng Ống Suông Wash Xám",
    discount: "-25%",
    discountedPrice: "630,000",
    originalPrice: "840,000",
    imageDefault: "src/assets/img/slideshow_1.png",
    imageHover: "Logo_1200x1200.png",
  },
    {
    name: "TSUN Quần Dài Rộng Ống Suông Wash Xám",
    discount: "-25%",
    discountedPrice: "630,000",
    originalPrice: "840,000",
    imageDefault: "src/assets/img/slideshow_1.png",
    imageHover: "Logo_1200x1200.png",
  },
    {
    name: "TSUN Quần Dài Rộng Ống Suông Wash Xám",
    discount: "-25%",
    discountedPrice: "630,000",
    originalPrice: "840,000",
    imageDefault: "src/assets/img/slideshow_1.png",
    imageHover: "Logo_1200x1200.png",
  },
    {
    name: "TSUN Quần Dài Rộng Ống Suông Wash Xám",
    discount: "-25%",
    discountedPrice: "630,000",
    originalPrice: "840,000",
    imageDefault: "src/assets/img/slideshow_1.png",
    imageHover: "Logo_1200x1200.png",
  },
    {
    name: "TSUN Quần Dài Rộng Ống Suông Wash Xám",
    discount: "-25%",
    discountedPrice: "630,000",
    originalPrice: "840,000",
    imageDefault: "src/assets/img/slideshow_1.png",
    imageHover: "Logo_1200x1200.png",
  },
];

export function initializeNewSwiper() {
 newSwiperInstance = new Swiper(".new-products-swiper", {
  speed: 800,
  slidesPerView: 4,
  spaceBetween: 16,
  loop: true,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  grid: {
    rows: 2,
    fill: "row",
  },
  pagination: {
    el: ".new-swiper-pagination",
    clickable: true,
    renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>`,
  },
  breakpoints: {
    0: {
      slidesPerView: 2,
      grid: { rows: 2 },
      loop: false,
      pagination: {
        el: ".new-swiper-pagination",
        clickable: true,
      },
    },
    576: {
      slidesPerView: 3,
      grid: { rows: 2 },
      loop: false,
      pagination: {
        el: ".new-swiper-pagination",
        clickable: true,
      },
    },
    992: {
      slidesPerView: 4,
      grid: { rows: 2 },
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      pagination: false,
    },
  },
  on: {
    init() {
      if (window.innerWidth < 992 && this.autoplay) {
        this.autoplay.stop();
      }
    },
    resize() {
      if (window.innerWidth < 992 && this.autoplay) {
        this.autoplay.stop();
      } else if (this.autoplay) {
        this.autoplay.start();
      }
    },
  },
});

  return newSwiperInstance;
}

export function handleResizeNewSwiper() {
  const currentDeviceMode = window.innerWidth < 992 ? 'mobile' : 'desktop';
  if (currentDeviceMode !== lastDeviceMode) {
    if (newSwiperInstance) {
      newSwiperInstance.destroy(true, true);
    }
    newSwiperInstance = initializeNewSwiper();
    lastDeviceMode = currentDeviceMode;
  } else {
    newSwiperInstance?.update();
  }
}

export function destroyNewSwiper() {
  newSwiperInstance?.destroy(true, true);
}
