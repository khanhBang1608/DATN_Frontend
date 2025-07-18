import { Offcanvas, Collapse } from 'bootstrap';

export function setupFilterSidebar() {
  const toggleBtn = document.getElementById("toggleSidebarBtn");
  const desktopSidebar = document.getElementById("desktopFilterContent");
  const mobileSidebar = document.getElementById("mobileFilterContent");
  const sidebar = document.querySelector(".product-sidebar");
  let lastScrollTop = 0;

  // ✅ Chỉ đồng bộ một lần + re-init sự kiện và Bootstrap Collapse
  if (desktopSidebar && mobileSidebar) {
    mobileSidebar.innerHTML = desktopSidebar.innerHTML;

    // Re-init collapse elements trong mobile
    document.querySelectorAll('#mobileFilterContent .accordion-collapse').forEach((collapseEl) => {
      // Kiểm tra trước khi khởi tạo Collapse
      if (typeof Collapse !== "undefined") {
        document.querySelectorAll('#mobileFilterContent .accordion-collapse').forEach((collapseEl) => {
          new Collapse(collapseEl, { toggle: false });
        });
      }

    });

    // Gắn lại class "open" khi show/hide
    document.querySelectorAll("#mobileFilterContent .product-accordion-item").forEach((item) => {
      const collapse = item.querySelector(".accordion-collapse");
      if (collapse) {
        collapse.addEventListener("show.bs.collapse", () => item.classList.add("open"));
        collapse.addEventListener("hide.bs.collapse", () => item.classList.remove("open"));
      }
    });
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
