import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import Swiper from 'swiper/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { debounce } from 'lodash';

export function userProductDetail(product) {
  const imageSources = ref([]);
  const currentIndex = ref(0);
  const isManualScroll = ref(false);
  const scrollArea = ref(null);
  const isModalOpen = ref(false);
  const isMobile = ref(window.innerWidth <= 768);
  const modalWrapper = ref(null);
  let mobileSwiper = null;
  let modalSwiper = null;
  let isUnmounting = false;

  // Hàm cập nhật imageSources
  const updateImageSources = () => {
    if (product.value?.variants?.length) {
      const uniqueImages = new Set(
        product.value.variants
          .filter((v) => v.imageName && v.imageName.trim() !== '')
          .map((v) => `http://localhost:8080/images/${v.imageName}`)
      );
      imageSources.value = [...uniqueImages];
      console.log('Đã cập nhật imageSources:', imageSources.value);
    } else {
      imageSources.value = ['/default.jpg'];
      console.log('Không tìm thấy variants, sử dụng ảnh mặc định');
    }
  };

  // Theo dõi thay đổi của product
  watch(product, () => {
    console.log('Product changed:', product.value);
    updateImageSources();
  }, { immediate: true });

  // Theo dõi imageSources để khởi tạo lại Swiper trên mobile
  watch(imageSources, () => {
    if (isMobile.value) {
      nextTick(() => {
        initMobileSwiper();
      });
    }
  });

  const scrollToImage = (index) => {
  const area = scrollArea.value;
  const target = document.getElementById('img' + index);

  if (area && target) {
    const offsetTop = target.offsetTop;
    area.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });

    currentIndex.value = index;
    isManualScroll.value = true;
    setTimeout(() => (isManualScroll.value = false), 500);
  }
};

  const handleScroll = () => {
    if (isManualScroll.value || !scrollArea.value) return;
    const areaTop = scrollArea.value.getBoundingClientRect().top;
    let minDiff = Infinity;
    let activeIndex = 0;
    [...scrollArea.value.querySelectorAll('img')].forEach((img, i) => {
      const diff = Math.abs(img.getBoundingClientRect().top - areaTop);
      if (diff < minDiff) {
        minDiff = diff;
        activeIndex = i;
      }
    });
    currentIndex.value = activeIndex;
  };

  const openCurrentGallery = debounce(() => {
    console.log('Mở gallery, isModalOpen:', isModalOpen.value);
    isModalOpen.value = true;

    nextTick(() => {
      const modal = document.getElementById('galleryModal');
      const swiperContainer = document.querySelector('.pd-modal-swiper');
      const swiperWrapper = document.querySelector('.pd-modal-swiper .swiper-wrapper');

      if (!modal || !swiperContainer || !swiperWrapper || !imageSources.value.length || swiperWrapper.children.length === 0) {
        console.error('Không thể khởi tạo modalSwiper do thiếu phần tử hoặc dữ liệu');
        return;
      }

      modal.style.display = 'flex';

      if (modalSwiper) {
        try {
          modalSwiper.destroy(true, true);
          console.log('Đã hủy modalSwiper trước đó');
        } catch (error) {
          console.error('Lỗi khi hủy modalSwiper:', error);
        }
        modalSwiper = null;
      }

      try {
        modalSwiper = new Swiper('.pd-modal-swiper', {
          initialSlide: currentIndex.value,
          loop: imageSources.value.length > 1,
          slidesPerView: 1,
          slidesPerGroup: 1,
          navigation: {
            nextEl: '.pd-modal-swiper-next',
            prevEl: '.pd-modal-swiper-prev',
            disabledClass: 'swiper-button-disabled',
          },
          pagination: {
            el: '.pd-modal-swiper-pagination',
            clickable: true,
          },
          on: {
            init: () => {
              console.log('Khởi tạo Modal Swiper thành công');
              console.log('Số lượng slide:', swiperWrapper.children.length);
              if (modalSwiper) {
                modalSwiper.update();
              }
            },
            slideChange: () => {
              if (!modalSwiper || modalSwiper.destroyed || isUnmounting) {
                console.warn('modalSwiper không tồn tại, đã bị hủy, hoặc component đang unmount');
                return;
              }
              console.log('Modal Swiper chuyển đến slide:', modalSwiper.realIndex);
              currentIndex.value = modalSwiper.realIndex;
            },
          },
        });
        console.log('Instance modalSwiper:', modalSwiper);
      } catch (error) {
        console.error('Lỗi khởi tạo modalSwiper:', error);
      }
    });
  }, 300);

  const initMobileSwiper = () => {
    if (mobileSwiper) {
      mobileSwiper.destroy(true, true);
      mobileSwiper = null;
    }
    if (imageSources.value.length === 0) {
      console.warn('No images available for mobile Swiper');
      return;
    }
    mobileSwiper = new Swiper('.pd-mobile-swiper-core', {
      loop: imageSources.value.length > 1,
      pagination: {
        el: '.pd-mobile-swiper-pagination',
        clickable: true,
      },
      on: {
        init: () => {
          console.log('Mobile Swiper initialized');
          mobileSwiper.update();
        },
        slideChange: () => {
          if (!mobileSwiper || mobileSwiper.destroyed || isUnmounting) {
            console.warn('mobileSwiper không tồn tại, đã bị hủy, hoặc component đang unmount');
            return;
          }
          currentIndex.value = mobileSwiper.realIndex;
        },
      },
    });
  };

  const closeGallery = (e) => {
    if (e.target.id === 'galleryModal' || e.target.classList.contains('pd-modal-close-btn')) {
      isModalOpen.value = false;
    }
  };

  const swiperSlidePrev = debounce(() => mobileSwiper?.slidePrev(), 300);
  const swiperSlideNext = debounce(() => mobileSwiper?.slideNext(), 300);

  onMounted(() => {
    if (!isMobile.value && scrollArea.value) {
      scrollArea.value.addEventListener('scroll', handleScroll);
    }
    scrollToImage(0);
    if (isMobile.value) {
      initMobileSwiper();
    }
    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 768;
    });
  });

  onBeforeUnmount(() => {
    console.log('Dọn dẹp các instance Swiper');
    isUnmounting = true;
    if (scrollArea.value) {
      scrollArea.value.removeEventListener('scroll', handleScroll);
    }
    if (mobileSwiper) {
      try {
        mobileSwiper.destroy(true, true);
        console.log('Đã hủy Mobile Swiper');
      } catch (error) {
        console.error('Lỗi khi hủy mobileSwiper:', error);
      }
      mobileSwiper = null;
    }
    if (modalSwiper) {
      try {
        modalSwiper.destroy(true, true);
        console.log('Đã hủy Modal Swiper');
      } catch (error) {
        console.error('Lỗi khi hủy modalSwiper:', error);
      }
      modalSwiper = null;
    }
  });

  return {
    imageSources,
    currentIndex,
    isModalOpen,
    isMobile,
    scrollArea,
    modalWrapper,
    scrollToImage,
    openCurrentGallery,
    closeGallery,
    swiperSlidePrev,
    swiperSlideNext,
    updateImageSources,
  };
}