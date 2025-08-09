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

    const updateImageSources = () => {
        if (product.value?.variants?.length) {
            const uniqueImages = new Set(
                product.value.variants
                    .filter((v) => v.imageName && v.imageName.trim() !== '')
                    .map((v) => `http://localhost:8080/images/${v.imageName}`)
            );
            imageSources.value = [...uniqueImages];
        } else {
            imageSources.value = ['/default.jpg'];
        }
    };

    watch(product, updateImageSources, { immediate: true });

    const initMobileSwiper = () => {
        if (mobileSwiper) {
            mobileSwiper.destroy(true, true);
            mobileSwiper = null;
        }
        if (imageSources.value.length === 0) {
            console.warn('Không có hình ảnh để khởi tạo Swiper trên mobile');
            return;
        }
        const swiperContainer = document.querySelector('.pd-mobile-swiper-core');
        const swiperWrapper = document.querySelector('.pd-mobile-swiper-core .swiper-wrapper');
        const scrollButtons = document.querySelectorAll('.pd-scroll-btn');
        if (!swiperContainer || !swiperWrapper || swiperWrapper.children.length === 0 || scrollButtons.length === 0) {
            console.warn('Không thể khởi tạo Swiper do thiếu phần tử DOM hoặc nút điều hướng');
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
                    console.log('Khởi tạo Mobile Swiper thành công');
                    if (mobileSwiper) {
                        mobileSwiper.update();
                    }
                },
                slideChange: () => {
                    if (!mobileSwiper || mobileSwiper.destroyed || isUnmounting) {
                        console.warn('mobileSwiper không tồn tại hoặc component đang unmount');
                        return;
                    }
                    currentIndex.value = mobileSwiper.realIndex;
                },
            },
        });
    };

    watch([isMobile, imageSources], () => {
        if (isMobile.value) {
            nextTick(() => {
                setTimeout(initMobileSwiper, 100);
            });
        }
    });

    const scrollToImage = (index) => {
        if (!scrollArea.value) {
            console.warn('scrollArea không tồn tại');
            return;
        }
        const target = document.getElementById('img' + index);
        if (!target) {
            console.warn(`Không tìm thấy phần tử img${index}`);
            return;
        }
        const offsetTop = target.offsetTop;
        scrollArea.value.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
        });
        currentIndex.value = index;
        isManualScroll.value = true;
        setTimeout(() => (isManualScroll.value = false), 500);
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
                modalSwiper.destroy(true, true);
                modalSwiper = null;
            }
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
                        if (modalSwiper) {
                            modalSwiper.update();
                        }
                    },
                    slideChange: () => {
                        if (!modalSwiper || modalSwiper.destroyed || isUnmounting) {
                            console.warn('modalSwiper không tồn tại hoặc component đang unmount');
                            return;
                        }
                        currentIndex.value = modalSwiper.realIndex;
                    },
                },
            });
        });
    }, 300);

    const closeGallery = (e) => {
        if (e.target.id === 'galleryModal' || e.target.classList.contains('pd-modal-close-btn')) {
            isModalOpen.value = false;
        }
    };

    const swiperSlidePrev = debounce(() => {
        if (mobileSwiper && !mobileSwiper.destroyed) {
            mobileSwiper.slidePrev();
        } else {
            console.warn('mobileSwiper không tồn tại hoặc đã bị hủy');
        }
    }, 300);

    const swiperSlideNext = debounce(() => {
        if (mobileSwiper && !mobileSwiper.destroyed) {
            mobileSwiper.slideNext();
        } else {
            console.warn('mobileSwiper không tồn tại hoặc đã bị hủy');
        }
    }, 300);

    onMounted(() => {
        nextTick(() => {
            console.log('isMobile ban đầu:', isMobile.value);
            if (!isMobile.value && scrollArea.value) {
                scrollArea.value.addEventListener('scroll', handleScroll);
                scrollToImage(0);
            }
            if (isMobile.value) {
                setTimeout(initMobileSwiper, 100);
            }
        });
        window.addEventListener('resize', debounce(() => {
            isMobile.value = window.innerWidth <= 768;
            console.log('isMobile sau khi resize:', isMobile.value);
        }, 200));
    });

    onBeforeUnmount(() => {
        isUnmounting = true;
        if (scrollArea.value) {
            scrollArea.value.removeEventListener('scroll', handleScroll);
        }
        if (mobileSwiper) {
            try {
                mobileSwiper.destroy(true, true);
            } catch (error) {
                console.error('Lỗi khi hủy mobileSwiper:', error);
            }
            mobileSwiper = null;
        }
        if (modalSwiper) {
            try {
                modalSwiper.destroy(true, true);
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