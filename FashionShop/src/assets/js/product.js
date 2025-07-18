import { Offcanvas } from 'bootstrap';

export function setupFilterSidebar() {
  const toggleBtn = document.getElementById("toggleSidebarBtn");
  const desktopSidebar = document.getElementById("desktopFilterContent");
  const mobileSidebar = document.getElementById("mobileFilterContent");
  const sidebar = document.querySelector(".product-sidebar");
  let lastScrollTop = 0;

  // Đồng bộ nội dung sidebar
  if (desktopSidebar && mobileSidebar) {
    mobileSidebar.innerHTML = desktopSidebar.innerHTML;
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        const offcanvasEl = new Offcanvas(document.getElementById("mobileFilterSidebar"));
        offcanvasEl.show();
      } else if (desktopSidebar) {
        desktopSidebar.classList.toggle("show");

        const contentWrapper = document.querySelector(".product-content-wrapper");
        if (desktopSidebar.classList.contains("show")) {
          contentWrapper?.classList.add("sidebar-pushed");
        } else {
          contentWrapper?.classList.remove("sidebar-pushed");
        }
      }
    });
  }


  // Accordion mở/đóng
  document.querySelectorAll(".product-accordion-item").forEach((item) => {
    const collapse = item.querySelector(".accordion-collapse");
    if (collapse) {
      collapse.addEventListener("show.bs.collapse", () => item.classList.add("open"));
      collapse.addEventListener("hide.bs.collapse", () => item.classList.remove("open"));
    }
  });

  // Định dạng giá
  const priceMin = document.getElementById("priceMin");
  const priceMax = document.getElementById("priceMax");
  const priceFrom = document.getElementById("priceFrom");
  const priceTo = document.getElementById("priceTo");

  const formatMoney = (value) => new Intl.NumberFormat("vi-VN").format(value);

  if (priceMin && priceFrom) {
    priceMin.addEventListener("input", () => {
      priceFrom.value = formatMoney(priceMin.value);
    });
  }

  if (priceMax && priceTo) {
    priceMax.addEventListener("input", () => {
      priceTo.value = formatMoney(priceMax.value);
    });
  }

  // Ẩn sidebar khi scroll xuống
  window.addEventListener("scroll", () => {
    if (!sidebar || window.innerWidth <= 768) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
      sidebar.classList.add("hide-sidebar");
    } else {
      sidebar.classList.remove("hide-sidebar");
    }

    lastScrollTop = Math.max(scrollTop, 0);
  });

  // Tự đồng bộ lại nội dung khi resize từ desktop <-> mobile
  window.addEventListener("resize", () => {
    if (desktopSidebar && mobileSidebar) {
      mobileSidebar.innerHTML = desktopSidebar.innerHTML;
    }
  });
}