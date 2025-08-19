import { Offcanvas, Collapse } from 'bootstrap';

export function setupFilterSidebar() {
  const toggleBtn = document.getElementById("toggleSidebarBtn");
  const desktopSidebar = document.getElementById("desktopFilterContent");
  const mobileSidebar = document.getElementById("mobileFilterContent");
  const sidebar = document.querySelector(".product-sidebar");
  let lastScrollTop = 0;
  let isMobileView = window.innerWidth <= 768;
  let lastIsMobile = window.innerWidth <= 768;

  function handleShow(event) {
    console.log("Show collapse:", event.currentTarget.id, new Date().toISOString());
    console.trace("Show collapse stack trace");
    const item = event.currentTarget.closest(".product-accordion-item");
    if (item) item.classList.add("open");
  }

  function handleHide(event) {
    console.log("Hide collapse triggered for:", event.currentTarget.id, new Date().toISOString());
    console.trace("Hide collapse stack trace");
    const item = event.currentTarget.closest(".product-accordion-item");
    if (item) item.classList.remove("open");
  }

  function initCollapseEvents(container) {
    const collapses = container.querySelectorAll(".accordion-collapse");

    collapses.forEach((collapseEl) => {
      collapseEl.removeEventListener("show.bs.collapse", handleShow);
      collapseEl.removeEventListener("hide.bs.collapse", handleHide);

      collapseEl.addEventListener("show.bs.collapse", handleShow);
      collapseEl.addEventListener("hide.bs.collapse", handleHide);
    });

    const buttons = container.querySelectorAll(".accordion-btn");
    buttons.forEach((btn) => {
      btn.removeEventListener("click", logClick);
      btn.addEventListener("click", logClick);
    });
  }


  function logClick(event) {
    console.log("Accordion button clicked:", event.currentTarget.getAttribute("data-bs-target"), new Date().toISOString());
  }

  function syncSidebarContent() {
    if (desktopSidebar && mobileSidebar) {
      console.log("syncSidebarContent called at:", new Date().toISOString());

      // Dọn collapse đang mở trước khi thay HTML
      mobileSidebar.querySelectorAll(".accordion-collapse.show").forEach((el) => {
        el.classList.remove("show");
      });

      // Thay nội dung từ desktop → mobile
      mobileSidebar.innerHTML = desktopSidebar.innerHTML
        .replace(/priceMinDesktop/g, "priceMinMobile")
        .replace(/priceMaxDesktop/g, "priceMaxMobile")
        .replace(/priceFromDesktop/g, "priceFromMobile")
        .replace(/priceToDesktop/g, "priceToMobile");

      // ✅ Gắn lại thuộc tính cho toggle button
      const toggleButtons = mobileSidebar.querySelectorAll(".accordion-btn");
      toggleButtons.forEach((btn) => {
        const targetId = btn.getAttribute("data-bs-target");
        if (targetId) {
          btn.setAttribute("data-bs-toggle", "collapse");
          const collapseEl = mobileSidebar.querySelector(targetId);
          if (collapseEl) {
            collapseEl.setAttribute("data-bs-parent", "#filterAccordionMobile");
            new Collapse(collapseEl, { toggle: false });
          }
        }
      });

      // Sự kiện show/hide accordion
      initCollapseEvents(mobileSidebar);

      // Gắn lại input price
      initPriceInputEvents();
    }
  }


  function resetAllCollapses(container) {
    container.querySelectorAll(".accordion-collapse.show").forEach((el) => {
      el.classList.remove("show");
    });
  }



  // Khởi tạo ban đầu
  initCollapseEvents(desktopSidebar);
  // Chỉ gọi syncSidebarContent khi cần
  if (window.innerWidth <= 768) {
    syncSidebarContent();
  }
  window.addEventListener('resize', function () {
    const isMobile = window.innerWidth <= 768;
    if (lastIsMobile !== isMobile) {
      location.reload();
    }
  });

  // Toggle sidebar
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const offcanvasEl = document.getElementById("mobileFilterSidebar");
        if (offcanvasEl && typeof Offcanvas !== "undefined") {
          const offcanvas = new Offcanvas(offcanvasEl);
          offcanvas.show();
        }
      } else if (desktopSidebar) {
        desktopSidebar.classList.toggle("show");
        console.log("Desktop sidebar show:", desktopSidebar.classList.contains("show"));
        const contentWrapper = document.querySelector(".product-content-wrapper");
        contentWrapper?.classList.toggle("sidebar-pushed", desktopSidebar.classList.contains("show"));
      }
    });
  }

  

  // Ẩn sidebar khi scroll xuống
  window.addEventListener("scroll", () => {
    if (!sidebar || window.innerWidth <= 768) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    sidebar.classList.toggle("hide-sidebar", scrollTop > lastScrollTop);
    lastScrollTop = Math.max(scrollTop, 0);
  });

  // Chỉ sync lại nội dung khi chuyển mobile ↔ desktop
  window.addEventListener("resize", () => {
    const currentView = window.innerWidth <= 768;
    if (currentView !== isMobileView) {
      isMobileView = currentView;
      console.log("Resize triggered, syncing sidebar content...");

      resetAllCollapses(mobileSidebar);
      resetAllCollapses(desktopSidebar);

      syncSidebarContent();
    }
  });


  // Định dạng tiền
  const formatMoney = (value) => {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? "0" : new Intl.NumberFormat("vi-VN").format(numValue);
  };

  function initPriceInputEvents() {
    const priceMinD = document.getElementById("priceMinDesktop");
    const priceMaxD = document.getElementById("priceMaxDesktop");
    const priceFromD = document.getElementById("priceFromDesktop");
    const priceToD = document.getElementById("priceToDesktop");

    const priceMinM = document.getElementById("priceMinMobile");
    const priceMaxM = document.getElementById("priceMaxMobile");
    const priceFromM = document.getElementById("priceFromMobile");
    const priceToM = document.getElementById("priceToMobile");

    const handlePriceEvents = (minInput, maxInput, fromDisplay, toDisplay) => {
      if (minInput && fromDisplay) {
        minInput.addEventListener("input", () => {
          const minVal = parseFloat(minInput.value);
          const maxVal = parseFloat(maxInput.value);
          if (minVal > maxVal) minInput.value = maxVal;
          fromDisplay.value = formatMoney(minInput.value);
        });
      }

      if (maxInput && toDisplay) {
        maxInput.addEventListener("input", () => {
          const minVal = parseFloat(minInput.value);
          const maxVal = parseFloat(maxInput.value);
          if (maxVal < minVal) maxInput.value = minVal;
          toDisplay.value = formatMoney(maxInput.value);
        });
      }
    };

    handlePriceEvents(priceMinD, priceMaxD, priceFromD, priceToD);
    handlePriceEvents(priceMinM, priceMaxM, priceFromM, priceToM);
  }

  initPriceInputEvents();
}