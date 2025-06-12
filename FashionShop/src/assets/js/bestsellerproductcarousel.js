import Swiper from "swiper/bundle";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

let bestsellerSwiperInstance = null;
let lastBestsellerDeviceMode = window.innerWidth < 992 ? 'mobile' : 'desktop';

export const bestSellerProducts = [
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

export function initializeBestsellerSwiper() {
  bestsellerSwiperInstance = new Swiper(".bestseller-products-swiper", {
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
      el: ".bestseller-swiper-pagination",
      clickable: true,
      renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>`,
    },
    breakpoints: {
      0: {
        slidesPerView: 2,
        grid: { rows: 2 },
        loop: false,
      },
      576: {
        slidesPerView: 3,
        grid: { rows: 2 },
        loop: false,
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

  return bestsellerSwiperInstance;
}

export function handleResizeBestsellerSwiper() {
  const currentDeviceMode = window.innerWidth < 992 ? 'mobile' : 'desktop';
  if (currentDeviceMode !== lastBestsellerDeviceMode) {
    if (bestsellerSwiperInstance) {
      bestsellerSwiperInstance.destroy(true, true);
    }
    bestsellerSwiperInstance = initializeBestsellerSwiper();
    lastBestsellerDeviceMode = currentDeviceMode;
  } else {
    bestsellerSwiperInstance?.update();
  }
}

export function destroyBestsellerSwiper() {
  bestsellerSwiperInstance?.destroy(true, true);
}
