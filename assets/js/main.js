document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Chart.js Initialization
    let engagementChartInstance = null;
    const initialIsLightTheme = localStorage.getItem('theme') === 'light';
    const initialEngagementTickColor = initialIsLightTheme ? '#334155' : '#b8c0d4';
    const initialEngagementGridColor = initialIsLightTheme ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.05)';

    const engagementCtx = document.getElementById('engagementChart');
    if (engagementCtx) {
        engagementChartInstance = new Chart(engagementCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Produce Harvested (lbs)',
                    data: [120, 190, 150, 250, 220, 300, 280],
                    borderColor: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#22C55E',
                    pointBorderColor: '#0b1020',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: initialEngagementGridColor },
                        ticks: { color: initialEngagementTickColor }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: initialEngagementTickColor }
                    }
                }
            }
        });
    }

    const deviceCtx = document.getElementById('deviceChart');
    if (deviceCtx) {
        new Chart(deviceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Starter Box', 'Family Box', 'Premium Box'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#22C55E', '#15803D', '#84CC16'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#b8c0d4',
                            padding: 20,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) themeToggle.querySelector('i').classList.replace('bi-moon-stars', 'bi-sun');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            const icon = themeToggle.querySelector('i');
            if (isLight) {
                icon.classList.replace('bi-moon-stars', 'bi-sun');
            } else {
                icon.classList.replace('bi-sun', 'bi-moon-stars');
            }

            if (engagementChartInstance) {
                const tickColor = isLight ? '#334155' : '#b8c0d4';
                const gridColor = isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.05)';
                engagementChartInstance.options.scales.y.ticks.color = tickColor;
                engagementChartInstance.options.scales.x.ticks.color = tickColor;
                engagementChartInstance.options.scales.y.grid.color = gridColor;
                engagementChartInstance.update();
            }
        });
    }

    // RTL Toggle
    const rtlToggle = document.getElementById('rtl-toggle');
    const savedDir = localStorage.getItem('dir');

    function applyBootstrapRTL(dir) {
        const bootstrapLinks = document.querySelectorAll('link[href*="bootstrap.min.css"], link[href*="bootstrap.rtl.min.css"]');
        bootstrapLinks.forEach(link => {
            if (dir === 'rtl') {
                if (link.href.includes('bootstrap.min.css')) {
                    link.href = link.href.replace('bootstrap.min.css', 'bootstrap.rtl.min.css');
                }
            } else {
                if (link.href.includes('bootstrap.rtl.min.css')) {
                    link.href = link.href.replace('bootstrap.rtl.min.css', 'bootstrap.min.css');
                }
            }
        });
    }

    if (savedDir === 'rtl') {
        document.documentElement.setAttribute('dir', 'rtl');
        applyBootstrapRTL('rtl');
    }

    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            applyBootstrapRTL(newDir);
        });
    }

    // Back to Top
    let backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) {
        backToTopButton = document.createElement('button');
        backToTopButton.type = 'button';
        backToTopButton.id = 'back-to-top';
        backToTopButton.className = 'back-to-top';
        backToTopButton.setAttribute('aria-label', 'Back to top');
        backToTopButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
        document.body.appendChild(backToTopButton);
    }

    const toggleBackToTop = () => {
        if (window.scrollY > 280) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    };

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Password Visibility Toggle
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });

    // Section Switching Logic
    window.showSection = function (sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('d-none');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId + '-section');
        if (targetSection) {
            targetSection.classList.remove('d-none');
        }

        // Update sidebar active state
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        // Handle case where link might not have been clicked directly (if called via code)
        const activeLink = document.querySelector(`.sidebar-link[onclick="showSection('${sectionId}')"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }



        // Close sidebar on mobile after selection
        if (window.innerWidth < 992 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    };

    // Navbar Menu Scroll Lock and Auto-close
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const togglerIcon = navbarToggler ? navbarToggler.querySelector('i') : null;

        navbarCollapse.addEventListener('show.bs.collapse', () => {
            document.body.style.overflow = 'hidden';
            if (togglerIcon) {
                togglerIcon.classList.remove('bi-list');
                togglerIcon.classList.add('bi-x-lg');
            }
        });
        
        navbarCollapse.addEventListener('hidden.bs.collapse', () => {
            document.body.style.overflow = '';
            if (togglerIcon) {
                togglerIcon.classList.remove('bi-x-lg');
                togglerIcon.classList.add('bi-list');
            }
        });

        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    document.body.style.overflow = '';
                    if (typeof bootstrap !== 'undefined') {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1200 && document.body.style.overflow === 'hidden') {
                document.body.style.overflow = '';
                if (typeof bootstrap !== 'undefined') {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse && navbarCollapse.classList.contains('show')) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    }
});

// Helper for scroll reveal
document.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
});
