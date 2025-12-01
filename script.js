// ==================== Mobile Menu ====================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.nav-mobile');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const submenuToggles = document.querySelectorAll('.submenu-toggle');

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
mobileMenuClose.addEventListener('click', toggleMobileMenu);
mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

// Mobile submenu toggles
submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = toggle.nextElementSibling;
        const isActive = submenu.classList.contains('active');
        
        // Close all other submenus
        document.querySelectorAll('.mobile-menu-body .submenu').forEach(sub => {
            sub.classList.remove('active');
        });
        document.querySelectorAll('.submenu-toggle').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current submenu
        if (!isActive) {
            submenu.classList.add('active');
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
        }
    });
});

// ==================== Header Scroll Effect ====================
const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// ==================== Hero Slider ====================
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevArrow = document.querySelector('.arrow.prev');
const nextArrow = document.querySelector('.arrow.next');
let currentSlide = 0;

// Auto-generated slides for demo
const slideData = [
    {
        title: 'Природная красота вашего стиля',
        description: 'Мы создаём естественные образы, подчёркивая вашу уникальность',
        image: 'images/salon_stydio1.jpg'
    },
    {
        title: 'Профессиональные стилисты',
        description: 'Опытные мастера, которые понимают ваши желания',
        image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920'
    },
    {
        title: 'Качественные материалы',
        description: 'Работаем только с проверенными средствами',
        image: 'https://images.unsplash.com/photo-1554119921-6c2c948fd9b0?w=1920'
    }
];

function updateSlide(slideIndex) {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === slideIndex);
    });
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
    currentSlide = slideIndex;
}

function nextSlide() {
    const newSlide = (currentSlide + 1) % slideData.length;
    updateSlide(newSlide);
}

function prevSlide() {
    const newSlide = (currentSlide - 1 + slideData.length) % slideData.length;
    updateSlide(newSlide);
}

// Auto-play slider
let sliderInterval = setInterval(nextSlide, 5000);

// Pause on hover
const heroSlider = document.querySelector('.hero-slider');
heroSlider.addEventListener('mouseenter', () => clearInterval(sliderInterval));
heroSlider.addEventListener('mouseleave', () => {
    sliderInterval = setInterval(nextSlide, 5000);
});

// Arrow controls
prevArrow.addEventListener('click', () => {
    clearInterval(sliderInterval);
    prevSlide();
});

nextArrow.addEventListener('click', () => {
    clearInterval(sliderInterval);
    nextSlide();
});

// Dot controls
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(sliderInterval);
        updateSlide(index);
    });
});

// ==================== Modal System ====================
const modals = document.querySelectorAll('.modal');
const modalTriggers = document.querySelectorAll('[data-modal]');
const modalCloses = document.querySelectorAll('[data-modal-close]');

function openModal(modalId) {
    const modal = document.getElementById(`${modalId}-modal`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.getAttribute('data-modal');
        openModal(modalId);
    });
});

modalCloses.forEach(close => {
    close.addEventListener('click', () => {
        const modal = close.closest('.modal');
        closeModal(modal);
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeModal(modal);
        }
    });
});

// Escape key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.classList.contains('active')) {
                closeModal(modal);
            }
        });
    }
});

// ==================== Booking Form ====================
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form validation
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!name || !phone) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^\+?\d{10,15}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        // Simulate form submission
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 15 минут.');
            bookingForm.reset();
            closeModal(document.getElementById('booking-modal'));
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const targetPosition = target.offsetTop - headerOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
});

// ==================== Lazy Loading Images ====================
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ==================== Touch Swipe for Mobile Menu ====================
let touchStartX = 0;
let touchEndX = 0;

mobileMenu.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

mobileMenu.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - close menu
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

// ==================== Active Menu Item on Scroll ====================
const sections = document.querySelectorAll('section[id]');
const menuLinks = document.querySelectorAll('.menu-item > a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== Keyboard Navigation ====================
document.addEventListener('keydown', (e) => {
    // Skip to content
    if (e.key === 'Tab' && !e.shiftKey) {
        if (document.activeElement === mobileMenuToggle) {
            e.preventDefault();
            mobileMenu.querySelector('.menu-link').focus();
        }
    }
});

// ==================== Performance Optimization ====================
// Preload critical images
const preloadImages = [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920'
];

preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedScroll = debounce(() => {
    // Scroll-based animations here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Naturel Studio website loaded successfully');
    
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Initialize animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});