/* 
 ================================================================
 * Yoga of Himalayas - Robust JavaScript Application
 * Version: 2.0
 * Features: Advanced interactions, animations, form handling,
 *           navigation management, and performance optimization
 ================================================================
 */

'use strict';

// ==========================================
// GLOBAL CONFIGURATION
// ==========================================
const CONFIG = {
    heroSliderInterval: 5000,
    scrollOffset: 80,
    animationDuration: 600,
    backToTopThreshold: 300,
    headerHideThreshold: 200,
    notificationDuration: 4000,
    counterDuration: 2000
};

// ==========================================
// STATE MANAGEMENT
// ==========================================
const AppState = {
    currentSlide: 0,
    isMenuOpen: false,
    isScrolling: false,
    lastScrollPosition: 0,
    heroAutoplayInterval: null,
    countersAnimated: false
};

// ==========================================
// MAIN INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🧘 Yoga of Himalayas - Website Initialized', 'color: #2D5F4C; font-size: 16px; font-weight: bold;');
    
    // Initialize all modules
    initMobileMenu();
    initHeroSlider();
    initSmoothScroll();
    initBackToTop();
    initHeaderScroll();
    initAnimateOnScroll();
    initContactForm();
    initTestimonialSlider();
    initGalleryLightbox();
    initParallax();
    initDropdownMenus();
    initActiveNavigation();
    initLazyLoading();
    initScrollProgress();
    
    // Log initialization complete
    console.log('%c✅ All modules loaded successfully', 'color: #2D5F4C; font-size: 12px;');
});

// ==========================================
// MOBILE MENU MODULE
// ==========================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navItems = document.querySelectorAll('.nav-item a');
    
    if (!menuToggle || !mainNav) return;
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when clicking nav items
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 968) {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (AppState.isMenuOpen && 
            !e.target.closest('.header-content') && 
            window.innerWidth <= 968) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 968) {
                closeMobileMenu();
            }
        }, 250);
    });
    
    // Functions
    function toggleMobileMenu() {
        if (AppState.isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        mainNav.classList.add('active');
        AppState.isMenuOpen = true;
        animateHamburger(true);
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mainNav.classList.remove('active');
        AppState.isMenuOpen = false;
        animateHamburger(false);
        document.body.style.overflow = '';
    }
    
    function animateHamburger(isOpen) {
        const spans = menuToggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    }
}

// ==========================================
// HERO SLIDER MODULE
// ==========================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dots .dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    const heroSection = document.querySelector('.hero-section');
    
    if (slides.length === 0) return;
    
    // Show specific slide
    function showSlide(index) {
        if (index >= slides.length) {
            AppState.currentSlide = 0;
        } else if (index < 0) {
            AppState.currentSlide = slides.length - 1;
        } else {
            AppState.currentSlide = index;
        }
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[AppState.currentSlide].classList.add('active');
        if (dots[AppState.currentSlide]) {
            dots[AppState.currentSlide].classList.add('active');
        }
    }
    
    function nextSlide() {
        showSlide(AppState.currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(AppState.currentSlide - 1);
    }
    
    function startAutoplay() {
        stopAutoplay();
        AppState.heroAutoplayInterval = setInterval(nextSlide, CONFIG.heroSliderInterval);
    }
    
    function stopAutoplay() {
        if (AppState.heroAutoplayInterval) {
            clearInterval(AppState.heroAutoplayInterval);
            AppState.heroAutoplayInterval = null;
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            startAutoplay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            startAutoplay();
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            startAutoplay();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
        }
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (heroSection) {
        heroSection.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        heroSection.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide();
            startAutoplay();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide();
            startAutoplay();
        }
    }
    
    // Pause on hover (desktop only)
    if (heroSection && window.innerWidth > 768) {
        heroSection.addEventListener('mouseenter', stopAutoplay);
        heroSection.addEventListener('mouseleave', startAutoplay);
    }
    
    // Pause when tab not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });
    
    startAutoplay();
}

// ==========================================
// SMOOTH SCROLL MODULE
// ==========================================
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                scrollToElement(targetElement);
            }
        });
    });
    
    function scrollToElement(element) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 20;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        if (AppState.isMenuOpen) {
            const mainNav = document.querySelector('.main-nav');
            if (mainNav) {
                mainNav.classList.remove('active');
                AppState.isMenuOpen = false;
            }
        }
    }
}

// ==========================================
// BACK TO TOP BUTTON MODULE
// ==========================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.pageYOffset > CONFIG.backToTopThreshold) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);
    }, { passive: true });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// HEADER SCROLL EFFECTS MODULE
// ==========================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    let lastScroll = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
            }
            
            if (window.innerWidth > 968 && currentScroll > CONFIG.headerHideThreshold) {
                if (currentScroll > lastScroll && !AppState.isMenuOpen) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        }, 100);
    }, { passive: true });
}

// ==========================================
// ANIMATE ON SCROLL MODULE
// ==========================================
function initAnimateOnScroll() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const animateElements = document.querySelectorAll(
            '.course-card, .feature-card, .testimonial-card, ' +
            '.news-card, .gallery-item, .quick-link-card, ' +
            '.stat-item, .contact-info-item'
        );
        
        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity ${CONFIG.animationDuration}ms ease, transform ${CONFIG.animationDuration}ms ease`;
            observer.observe(element);
        });
        
        initStatsCounter();
    }
}

// ==========================================
// STATS COUNTER MODULE
// ==========================================
function initStatsCounter() {
    const statsSection = document.querySelector('.about-stats');
    
    if (!statsSection || AppState.countersAnimated) return;
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !AppState.countersAnimated) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const targetNumber = parseInt(text.replace(/\D/g, ''));
                    const hasPlus = text.includes('+');
                    
                    animateCounter(stat, targetNumber, hasPlus);
                });
                
                AppState.countersAnimated = true;
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

function animateCounter(element, target, hasPlus = true) {
    const duration = CONFIG.counterDuration;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = t => t * (2 - t);
    
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(target * progress);
        
        element.textContent = currentCount + (hasPlus ? '+' : '');
        
        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = target + (hasPlus ? '+' : '');
        }
    }, frameDuration);
}

// ==========================================
// CONTACT FORM MODULE
// ==========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        submitForm(data);
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        clearFieldError(field);
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        else if (field.name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.cssText = 'color: #E67E22; font-size: 0.85rem; margin-top: 0.25rem; display: block;';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function submitForm(data) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        setTimeout(() => {
            console.log('Form Data:', data);
            
            showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            
            form.reset();
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }, 1500);
    }
}

// ==========================================
// NOTIFICATION SYSTEM MODULE
// ==========================================
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#2D5F4C',
        error: '#E67E22',
        info: '#5DADE2',
        warning: '#F39C12'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        font-weight: 500;
        font-size: 0.95rem;
        line-height: 1.5;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 400);
    }, CONFIG.notificationDuration);
    
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 400);
    });
}

if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(500px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(500px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// TESTIMONIAL SLIDER MODULE
// ==========================================
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (testimonialCards.length <= 3) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }
    
    let currentIndex = 0;
    const slidesToShow = window.innerWidth > 968 ? 3 : window.innerWidth > 640 ? 2 : 1;
    
    function updateSlider() {
        testimonialCards.forEach((card, index) => {
            if (index >= currentIndex && index < currentIndex + slidesToShow) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < testimonialCards.length - slidesToShow) {
                currentIndex++;
                updateSlider();
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }
    
    updateSlider();
}

// ==========================================
// GALLERY LIGHTBOX MODULE
// ==========================================
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h3')?.textContent || 'Gallery Image';
            
            openLightbox(img.src, title);
        });
    });
}

function openLightbox(imageSrc, title) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = title;
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    `;
    
    const titleElement = document.createElement('div');
    titleElement.textContent = title;
    titleElement.style.cssText = `
        color: white;
        text-align: center;
        margin-top: 1.5rem;
        font-size: 1.5rem;
        font-family: 'Playfair Display', serif;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 2rem;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        closeBtn.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(1)';
    });
    
    content.appendChild(img);
    content.appendChild(titleElement);
    lightbox.appendChild(content);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    document.body.style.overflow = 'hidden';
    
    function closeLightbox() {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// ==========================================
// PARALLAX EFFECT MODULE
// ==========================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-image');
    
    if (parallaxElements.length === 0 || window.innerWidth < 768) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                parallaxElements.forEach(element => {
                    const speed = 0.5;
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ==========================================
// DROPDOWN MENU MODULE
// ==========================================
function initDropdownMenus() {
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(item => {
        const dropdownMenu = item.querySelector('.dropdown-menu');
        
        if (!dropdownMenu) return;
        
        if (window.innerWidth > 968) {
            // Desktop hover
            item.addEventListener('mouseenter', function() {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.transform = 'translateY(0)';
            });
            
            item.addEventListener('mouseleave', function() {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.transform = 'translateY(-10px)';
            });
        }
        else {
            // Mobile click
            const mainLink = item.querySelector('a');
            
            // Clone the link to remove existing event listeners
            const newMainLink = mainLink.cloneNode(true);
            mainLink.parentNode.replaceChild(newMainLink, mainLink);
            
            newMainLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close all other dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherMenu = otherItem.querySelector('.dropdown-menu');
                        if (otherMenu) {
                            otherMenu.classList.remove('active');
                        }
                    }
                });
                
                // Toggle this dropdown
                item.classList.toggle('active');
                dropdownMenu.classList.toggle('active');
            });
        }
    });
    
    // Re-init on window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reset all dropdowns on resize
            dropdownItems.forEach(item => {
                item.classList.remove('active');
                const menu = item.querySelector('.dropdown-menu');
                if (menu) {
                    menu.classList.remove('active');
                    if (window.innerWidth > 968) {
                        menu.style.opacity = '';
                        menu.style.visibility = '';
                        menu.style.transform = '';
                    }
                }
            });
        }, 250);
    });
}

// ==========================================
// ACTIVE NAVIGATION MODULE
// ==========================================
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-item a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                const parent = link.closest('.nav-item');
                if (parent) {
                    parent.classList.remove('active');
                    
                    if (link.getAttribute('href') === '#' + current) {
                        parent.classList.add('active');
                    }
                }
            });
        }, 100);
    }, { passive: true });
}

// ==========================================
// LAZY LOADING MODULE
// ==========================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ==========================================
// SCROLL PROGRESS INDICATOR MODULE
// ==========================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #E67E22, #D4A574);
        z-index: 10001;
        width: 0%;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }, 10);
    }, { passive: true });
}

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('%cPage Load Time: ' + pageLoadTime + 'ms', 'color: #2D5F4C; font-weight: bold;');
        }, 0);
    });
}

// ==========================================
// ERROR HANDLING
// ==========================================
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
});

// ==========================================
// CONSOLE SIGNATURE
// ==========================================
console.log('%c🧘‍♀️ Yoga of Himalayas 🧘‍♂️', 'color: #2D5F4C; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
console.log('%cWebsite crafted with ❤️ and mindfulness', 'color: #D4A574; font-size: 14px; font-style: italic;');
console.log('%cNamaste 🙏', 'color: #E67E22; font-size: 16px; font-weight: bold;');