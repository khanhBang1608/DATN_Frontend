import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

export function useProductDetail() {
  const imageSources = [
    'https://images2.thanhnien.vn/528068263637045248/2025/7/12/48427799012203294996640565770072566130465660n-17523009301901089058451.jpg',
    'https://images2.thanhnien.vn/528068263637045248/2025/7/12/48427799012203294996640565770072566130465660n-17523009301901089058451.jpg',
    'https://images2.thanhnien.vn/528068263637045248/2025/7/12/48427799012203294996640565770072566130465660n-17523009301901089058451.jpg',
    'https://images2.thanhnien.vn/528068263637045248/2025/7/12/48427799012203294996640565770072566130465660n-17523009301901089058451.jpg'
  ];

  const currentIndex = ref(0);
  const isManualScroll = ref(false);
  const scrollArea = ref(null);
  const isModalOpen = ref(false);
  const isMobile = ref(window.innerWidth <= 768);
  const modalWrapper = ref(null);

  let mobileSwiper = null;
  let modalSwiper = null;

  const scrollToImage = (index) => {
    const target = document.getElementById('img' + index);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

 const openCurrentGallery = () => {
  console.log('Mở gallery, isModalOpen:', isModalOpen.value);
  isModalOpen.value = true;

  nextTick(() => {
    const modal = document.getElementById('galleryModal');
    const swiperContainer = document.querySelector('.pd-modal-swiper');
    console.log('Phần tử modal:', modal);
    console.log('Container Swiper:', swiperContainer);
    console.log('imageSources:', imageSources);

    if (!modal) {
      console.error('Không tìm thấy phần tử modal');
      return;
    }
    if (!swiperContainer) {
      console.error('Không tìm thấy container Swiper');
      return;
    }
    if (!imageSources.length) {
      console.error('imageSources rỗng hoặc không hợp lệ');
      return;
    }

    modal.style.display = 'flex';

    if (modalSwiper) {
      try {
        modalSwiper.destroy(true, true);
        console.log('modalSwiper trước đó đã bị hủy');
      } catch (error) {
        console.error('Lỗi khi hủy modalSwiper:', error);
      }
      modalSwiper = null;
    }

    try {
      modalSwiper = new Swiper('.pd-modal-swiper', {
        initialSlide: currentIndex.value,
        loop: imageSources.length > 1,
        slidesPerView: 1,
        slidesPerGroup: 1,
        navigation: {
          nextEl: '.pd-modal-swiper-next',
          prevEl: '.pd-modal-swiper-prev',
        },
        pagination: {
          el: '.pd-modal-swiper-pagination',
          clickable: true,
        },
        on: {
          init: () => {
            console.log('Modal Swiper khởi tạo thành công');
            console.log('Số lượng slides:', modalSwiper?.slides?.length);
          },
          slideChange: () => {
            if (modalSwiper) {
              console.log('Modal Swiper thay đổi slide đến:', modalSwiper.realIndex);
              currentIndex.value = modalSwiper.realIndex;
            } else {
              console.error('modalSwiper không tồn tại trong slideChange');
            }
          },
        },
      });
    } catch (error) {
      console.error('Lỗi khi khởi tạo modalSwiper:', error);
    }
  });
};

const initMobileSwiper = () => {
  if (mobileSwiper) {
    mobileSwiper.destroy(true, true);
    mobileSwiper = null;
  }
  mobileSwiper = new Swiper('.pd-mobile-swiper-core', {
    loop: imageSources.length > 1,
    pagination: {
      el: '.pd-mobile-swiper-pagination',
      clickable: true,
    },
    on: {
      init: () => console.log('Mobile Swiper đã khởi tạo'),
      slideChange: () => {
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

  const swiperSlidePrev = () => mobileSwiper?.slidePrev();
  const swiperSlideNext = () => mobileSwiper?.slideNext();

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
  if (scrollArea.value) {
    scrollArea.value.removeEventListener('scroll', handleScroll);
  }
  if (mobileSwiper) {
    mobileSwiper.destroy(true, true);
    mobileSwiper = null;
  }
  if (modalSwiper) {
    modalSwiper.destroy(true, true);
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
    swiperSlideNext
  };
}
