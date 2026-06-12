document.addEventListener('DOMContentLoaded', () => {
    // ========================================================================
    // STICKY HEADER
    // ========================================================================
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ========================================================================
    // MOBILE NAVIGATION
    // ========================================================================
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });

    // ========================================================================
    // HERO SLIDER CAROUSEL
    // ========================================================================
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000;

    // Create Dots dynamically
    slides.forEach((slide, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(idx);
            resetInterval();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function updateDots() {
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        updateDots();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    function startInterval() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    if (slides.length > 0) {
        startInterval();
    }

    // ========================================================================
    // BRANDS & PLATFORMS TAB SYSTEM
    // ========================================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Find matching content and show it
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ========================================================================
    // STATS COUNT-UP ANIMATION
    // ========================================================================
    const statsSection = document.querySelector('.stats');
    const countElements = document.querySelectorAll('.stat-number[data-target]');
    let hasCounted = false;

    function startCounter() {
        countElements.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.innerText.replace(/[0-9.]/g, ''); // Extract +, B, K, etc.
            const isFloat = counter.getAttribute('data-target').includes('.');
            let count = 0;
            const duration = 2000; // 2 seconds duration
            const increment = target / (duration / 16); // 60 FPS approx.

            const updateCount = () => {
                count += increment;
                if (count < target) {
                    if (isFloat) {
                        counter.innerText = count.toFixed(1) + suffix;
                    } else {
                        counter.innerText = Math.floor(count) + suffix;
                    }
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = (isFloat ? target.toFixed(1) : target) + suffix;
                }
            };
            
            updateCount();
        });
    }

    // Intersection Observer to trigger counter when stats section is visible
    if (statsSection && countElements.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.3 // Trigger when 30% of the section is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    startCounter();
                    hasCounted = true;
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    }

    // ========================================================================
    // SEARCH OVERLAY MODAL
    // ========================================================================
    const searchBtn = document.querySelector('.btn-search');
    const searchModal = document.querySelector('.search-modal');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-box input');

    if (searchBtn && searchModal && searchClose) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.classList.add('active');
            setTimeout(() => searchInput.focus(), 300);
        });

        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                searchModal.classList.remove('active');
            }
        });
    }

    // ========================================================================
    // DYNAMIC NEWS/PRESS HORIZONTAL CAROUSEL DRAG/SWIPE OR TRACK CONTROL
    // ========================================================================
    const track = document.querySelector('.news-track');
    const cards = document.querySelectorAll('.news-card');
    
    if (track && cards.length > 0) {
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; // Scroll multiplier
            track.scrollLeft = scrollLeft - walk;
        });
    }
});
