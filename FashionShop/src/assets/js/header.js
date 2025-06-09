export default function initHeader() {
    const sidebar = document.getElementById('mobileSidebar');
    if (!sidebar) return;

    sidebar.addEventListener('shown.bs.offcanvas', () => {
        const items = sidebar.querySelectorAll('.nav-item');
        items.forEach((item, index) => {
            item.classList.remove('custom-slide-up');
            void item.offsetWidth;
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('custom-slide-up');
        });
    });

    sidebar.addEventListener('hidden.bs.offcanvas', () => {
        const items = sidebar.querySelectorAll('.nav-item');
        items.forEach(item => item.classList.remove('custom-slide-up'));
    });

    document.querySelectorAll('.custom-submenu-toggle').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const parentLi = btn.parentElement;
            const submenu = parentLi.querySelector('.custom-submenu');

            if (submenu) {
                submenu.classList.add('custom-show');
                const submenuItems = submenu.querySelectorAll('li');
                submenuItems.forEach((item, index) => {
                    item.classList.remove('custom-slide-up');
                    void item.offsetWidth;
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.classList.add('custom-slide-up');
                });

                document.querySelectorAll('.custom-main-menu > .nav-item').forEach(li => {
                    if (li !== parentLi) {
                        li.style.display = 'none';
                    } else {
                        const toggleLink = li.querySelector('.custom-submenu-toggle');
                        if (toggleLink) toggleLink.style.display = 'none';
                    }
                });

                const bottom = document.querySelector('.custom-bottom-section');
                if (bottom) bottom.style.display = 'none';
            }
        });
    });

    document.querySelectorAll('.custom-back-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const submenu = btn.closest('.custom-submenu');
            if (submenu) {
                submenu.classList.remove('custom-show');
                submenu.querySelectorAll('li').forEach(item => item.classList.remove('custom-slide-up'));

                document.querySelectorAll('.custom-main-menu > .nav-item').forEach(li => {
                    li.style.display = 'block';
                    const toggleLink = li.querySelector('.custom-submenu-toggle');
                    if (toggleLink) toggleLink.style.display = 'block';
                });

                const bottom = document.querySelector('.custom-bottom-section');
                if (bottom) bottom.style.display = 'block';
            }
        });
    });
}
