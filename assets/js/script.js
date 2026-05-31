/**
 * ACADEMIC PERSONAL WEBSITE INTERFACE ENGINE
 * (Vanilla JS Engine providing interaction routing)
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeControl();
    initMobileMenus();
    initScrollIndicators();
    initPublicationsSearchAndFilter();
    initIntersectionObservers();
    setAutoCopyrightYear();
});

/**
 * 1. Dark Mode State Machine and LocalStorage Caching
 */
function initThemeControl() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    const cachedTheme = localStorage.getItem('academic-theme') || 'light';
    document.documentElement.setAttribute('data-theme', cachedTheme);
    updateThemeIcon(cachedTheme);

    toggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('academic-theme', targetTheme);
        updateThemeIcon(targetTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (!icon) return;
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

/**
 * 2. Responsive Layout Interactions (Hamburger & Sidebar Toggles)
 */
function initMobileMenus() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            if (sidebar) sidebar.classList.remove('active'); // Close opposing
        });
    }

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            if (navMenu) navMenu.classList.remove('active'); // Close opposing
        });
    }

    // Dynamic global dismissal click guard
    document.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (sidebar) sidebar.classList.remove('active');
    });
}

/**
 * 3. Telemetry Tracking (Scroll Progress Metric & Back-To-Top Trigger)
 */
function initScrollIndicators() {
    const progressIndicator = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (totalHeight > 0) {
            const progressRatio = (window.scrollY / totalHeight) * 100;
            if (progressIndicator) progressIndicator.style.width = `${progressRatio}%`;
        }

        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/**
 * 4. Publication Matrix Parsing engine (Real-time Filtering and Substring Matching)
 */
function initPublicationsSearchAndFilter() {
    const searchBar = document.getElementById('pub-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationCards = document.querySelectorAll('.pub-card');

    if (!publicationCards.length) return; // Silent skip if page missing component array

    let activeFilter = 'all';
    let searchQuery = '';

    function executeEvaluationPipeline() {
        publicationCards.forEach(card => {
            const matchesCategory = (activeFilter === 'all') || (card.getAttribute('data-category') === activeFilter);
            
            const textHaystack = card.textContent.toLowerCase();
            const matchesSearch = textHaystack.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            executeEvaluationPipeline();
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            executeEvaluationPipeline();
        });
    });
}

/**
 * 5. Layout Presentation Animation Pipeline (Intersection Observer API)
 */
function initIntersectionObservers() {
    const observingElements = document.querySelectorAll('.fade-in');
    if (!observingElements.length) return;

    const observationConfig = {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    };

    const activationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Standard optimization bypass
            }
        });
    }, observationConfig);

    observingElements.forEach(el => activationObserver.observe(el));
}

/**
 * 6. Automated Administrative Copyright Resolution
 */
function setAutoCopyrightYear() {
    const runtimeSpan = document.getElementById('year');
    if (runtimeSpan) {
        runtimeSpan.textContent = new Date().getFullYear().toString();
    }
}
