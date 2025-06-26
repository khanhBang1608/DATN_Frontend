import { ref, onMounted, onBeforeUnmount } from 'vue';

export const categories = [
  { title: "Giày & Dép", image: "src/assets/img/slideshow_1.png", alt: "Giày cao gót" },
  { title: "Quần & Áo", image: "src/assets/img/slideshow_1.png", alt: "Quần áo thời trang" },
  { title: "Áo", image: "src/assets/img/slideshow_1.png", alt: "Áo mới" },
  { title: "Balo", image: "src/assets/img/slideshow_1.png", alt: "Balo đẹp" },
  { title: "Túi Ví", image: "src/assets/img/slideshow_1.png", alt: "Túi và ví" },
  { title: "Phụ Kiện", image: "src/assets/img/slideshow_1.png", alt: "Phụ kiện thời trang" },
];

export function useScrollCategory(scrollContent) {
  let originalContent = '';
  let offset = 0;
  let scrollWidth = 0;
  let animationId = null;

  const isMobile = () => window.innerWidth <= 768;

  function initContent() {
    if (!scrollContent.value) return;

    scrollContent.value.innerHTML = originalContent;

    if (!isMobile()) {
      scrollContent.value.innerHTML += originalContent;
      scrollWidth = scrollContent.value.scrollWidth / 2;
      startScroll();
    } else {
      scrollContent.value.style.transform = 'none';
    }
  }

  function startScroll() {
    if (isMobile()) return;

    const scroll = () => {
      offset += 1;
      if (offset >= scrollWidth) offset = 0;
      scrollContent.value.style.transform = `translateX(-${offset}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
  }

  function pauseScroll() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function resumeScroll() {
    if (!animationId && !isMobile()) {
      startScroll();
    }
  }

  onMounted(() => {
    originalContent = scrollContent.value.innerHTML;
    initContent();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationId);
      animationId = null;
      initContent();
    });
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
  });

  return {
    pauseScroll,
    resumeScroll
  };
}

