// ==================== CONFIGURATION & GLOBALS ====================
const CONFIG = {
    formSubmitDelay: 1500, // имитация задержки отправки формы
    scrollOffset: 80, // отступ для плавной прокрутки (высота хедера)
    mobileBreakpoint: 992, // брейкпоинт для мобильного меню
    enableAnimations: true // включить/отключить анимации
};

// Состояние приложения
const APP_STATE = {
    isMobileMenuOpen: false,
    currentModal: null,
    isFormSubmitting: false,
    lastScrollPosition: 0
};

// ==================== DOM ELEMENTS ====================
const DOM = {
    // Header & Navigation
    header: document.getElementById('header'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    mobileMenu: document.getElementById('mobile-menu'),
    mobileNavOverlay: document.getElementById('mobile-nav-overlay'),
    mobileNavClose: document.getElementById('mobile-nav-close'),
    primaryNav: document.getElementById('primary-nav'),
    headerCta: document.getElementById('header-cta'),

    // Forms
    bookingForm: document.getElementById('booking-form'),
    formSubmitBtn: document.getElementById('form-submit'),

    // Modals
    modals: document.querySelectorAll('.modal'),
    modalTriggers: document.querySelectorAll('[data-modal]'),
    modalCloses: document.querySelectorAll('[data-modal-close]'),

    // Current Year for Footer
    currentYearSpan: document.getElementById('current-year')
};

// ==================== UTILITY FUNCTIONS ====================
const Utils = {
    // Проверка, мобильное ли устройство
    isMobile() {
        return window.innerWidth < CONFIG.mobileBreakpoint;
    },

    // Проверка видимости элемента в viewport
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
            rect.bottom >= 0
        );
    },

    // Дебаунс для производительности
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Форматирование телефона
    formatPhoneNumber(phone) {
        return phone.replace(/\D/g, '')
            .replace(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/, '+$1 ($2) $3-$4-$5');
    },

    // Валидация email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Валидация телефона
    isValidPhone(phone) {
        const phoneRegex = /^\+?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
};

// ==================== MOBILE MENU ====================
const MobileMenu = {
    init() {
        if (!DOM.mobileMenuToggle) return;

        DOM.mobileMenuToggle.addEventListener('click', this.toggle);
        DOM.mobileNavClose.addEventListener('click', this.close);
        DOM.mobileNavOverlay.addEventListener('click', this.close);

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && APP_STATE.isMobileMenuOpen) {
                this.close();
            }
        });

        // Закрытие при клике на ссылку
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (APP_STATE.isMobileMenuOpen) {
                    this.close();
                }
            });
        });
    },

    toggle() {
        if (APP_STATE.isMobileMenuOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        APP_STATE.isMobileMenuOpen = true;
        DOM.mobileMenu.setAttribute('aria-hidden', 'false');
        DOM.mobileNavOverlay.setAttribute('aria-hidden', 'false');
        DOM.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        this.animateOpen();
    },

    close() {
        APP_STATE.isMobileMenuOpen = false;
        DOM.mobileMenu.setAttribute('aria-hidden', 'true');
        DOM.mobileNavOverlay.setAttribute('aria-hidden', 'true');
        DOM.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        this.animateClose();
    },

    animateOpen() {
        if (CONFIG.enableAnimations) {
            DOM.mobileMenu.style.transform = 'translateX(0)';
        }
    },

    animateClose() {
        if (CONFIG.enableAnimations) {
            DOM.mobileMenu.style.transform = 'translateX(100%)';
        }
    }
};

// ==================== HEADER SCROLL EFFECTS ====================
const HeaderEffects = {
    init() {
        if (!DOM.header) return;

        window.addEventListener('scroll', Utils.debounce(() => {
            this.handleScroll();
        }, 10));

        // Инициализация
        this.handleScroll();
    },

    handleScroll() {
        const currentScroll = window.pageYOffset;
        const headerHeight = DOM.header.offsetHeight;

        // Эффект скрытия/показа хедера
        if (currentScroll > headerHeight) {
            if (currentScroll > APP_STATE.lastScrollPosition && currentScroll > 200) {
                DOM.header.style.transform = 'translateY(-100%)';
            } else {
                DOM.header.style.transform = 'translateY(0)';
            }
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
            DOM.header.style.transform = 'translateY(0)';
        }

        APP_STATE.lastScrollPosition = currentScroll;

        // Подсветка активного пункта меню
        this.highlightActiveNavItem();
    },

    highlightActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + CONFIG.scrollOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.setActiveNavItem(sectionId);
            }
        });
    },

    setActiveNavItem(sectionId) {
        // Десктопное меню
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Мобильное меню
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
};

// ==================== FORM HANDLING ====================
const FormHandler = {
    init() {
        if (!DOM.bookingForm) return;

        DOM.bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });

        // Валидация в реальном времени
        this.initRealTimeValidation();
    },

    initRealTimeValidation() {
        const nameInput = document.getElementById('client-name');
        const phoneInput = document.getElementById('client-phone');

        if (nameInput) {
            nameInput.addEventListener('blur', () => this.validateNameField(nameInput));
        }

        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneInput(e));
            phoneInput.addEventListener('blur', () => this.validatePhoneField(phoneInput));
        }
    },

    validateNameField(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById('name-error');

        if (!value) {
            this.showError(input, errorElement, 'Пожалуйста, введите ваше имя');
            return false;
        }

        if (value.length < 2) {
            this.showError(input, errorElement, 'Имя должно содержать минимум 2 буквы');
            return false;
        }

        this.clearError(input, errorElement);
        return true;
    },

    validatePhoneField(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById('phone-error');

        if (!value) {
            this.showError(input, errorElement, 'Пожалуйста, введите номер телефона');
            return false;
        }

        if (!Utils.isValidPhone(value)) {
            this.showError(input, errorElement, 'Введите корректный номер телефона');
            return false;
        }

        this.clearError(input, errorElement);
        return true;
    },

    formatPhoneInput(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.startsWith('8')) {
            value = '7' + value.slice(1);
        }

        if (value.length > 0) {
            if (!value.startsWith('+')) {
                value = '+' + value;
            }

            if (value.length > 1) {
                value = value.slice(0, 2) + ' ' + value.slice(2);
            }
            if (value.length > 6) {
                value = value.slice(0, 6) + ' ' + value.slice(6);
            }
            if (value.length > 10) {
                value = value.slice(0, 10) + ' ' + value.slice(10);
            }
            if (value.length > 13) {
                value = value.slice(0, 13) + ' ' + value.slice(13);
            }
            if (value.length > 16) {
                value = value.slice(0, 16);
            }
        }

        e.target.value = value;
    },

    showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    },

    clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    },

    async handleSubmit(e) {
        if (APP_STATE.isFormSubmitting) return;

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Валидация
        const isNameValid = this.validateNameField(document.getElementById('client-name'));
        const isPhoneValid = this.validatePhoneField(document.getElementById('client-phone'));

        if (!isNameValid || !isPhoneValid) {
            this.shakeForm();
            return;
        }

        // Начало отправки
        APP_STATE.isFormSubmitting = true;
        this.setFormSubmitting(true);

        try {
            // Имитация отправки на сервер
            await this.mockSubmit(data);

            // Успешная отправка
            this.showSuccessMessage(form);
            form.reset();

        } catch (error) {
            // Ошибка отправки
            this.showErrorMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз или позвоните нам.');
            console.error('Form submission error:', error);

        } finally {
            // Завершение отправки
            APP_STATE.isFormSubmitting = false;
            this.setFormSubmitting(false);
        }
    },

    setFormSubmitting(isSubmitting) {
        if (DOM.formSubmitBtn) {
            DOM.formSubmitBtn.disabled = isSubmitting;
            DOM.formSubmitBtn.classList.toggle('loading', isSubmitting);
        }
    },

    mockSubmit(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Случайная "ошибка" для демонстрации (1 из 10 случаев)
                if (Math.random() < 0.1) {
                    reject(new Error('Network error'));
                } else {
                    // В реальном приложении здесь был бы fetch/axios запрос
                    console.log('Form data submitted:', data);
                    resolve({ success: true, message: 'Form submitted successfully' });
                }
            }, CONFIG.formSubmitDelay);
        });
    },

    showSuccessMessage(form) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'form-notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <div>
                    <h4>Спасибо за заявку!</h4>
                    <p>Мы свяжемся с вами в течение часа для подтверждения записи.</p>
                </div>
            </div>
        `;

        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #7BC67B;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Добавляем CSS анимации
        this.addNotificationAnimations();
    },

    showErrorMessage(message) {
        // Аналогично showSuccessMessage, но с другим стилем
        console.error('Form error:', message);
        alert(message); // Временное решение
    },

    addNotificationAnimations() {
        if (!document.getElementById('notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    },

    shakeForm() {
        if (DOM.bookingForm && CONFIG.enableAnimations) {
            DOM.bookingForm.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                DOM.bookingForm.style.animation = '';
            }, 500);
        }
    }
};

// ==================== MODAL SYSTEM ====================
const ModalSystem = {
    init() {
        if (DOM.modalTriggers.length === 0) return;

        // Открытие модальных окон
        DOM.modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });

        // Закрытие модальных окон
        DOM.modalCloses.forEach(close => {
            close.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = close.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Закрытие по клику на бэкдроп
        DOM.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    this.closeModal(modal);
                }
            });
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && APP_STATE.currentModal) {
                this.closeCurrentModal();
            }
        });
    },

    openModal(modalId) {
        const modal = document.getElementById(`${modalId}-modal`);
        if (!modal) return;

        // Закрываем предыдущее модальное окно
        if (APP_STATE.currentModal) {
            this.closeCurrentModal();
        }

        // Открываем новое
        APP_STATE.currentModal = modal;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Фокус на первом интерактивном элементе
        setTimeout(() => {
            const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
        }, 100);
    },

    closeModal(modal) {
        if (!modal) return;

        modal.setAttribute('aria-hidden', 'true');
        APP_STATE.currentModal = null;
        document.body.style.overflow = '';

        // Возвращаем фокус на элемент, который открыл модальное окно
        const previousActiveElement = document.activeElement;
        if (previousActiveElement && previousActiveElement.hasAttribute('data-modal')) {
            setTimeout(() => previousActiveElement.focus(), 100);
        }
    },

    closeCurrentModal() {
        if (APP_STATE.currentModal) {
            this.closeModal(APP_STATE.currentModal);
        }
    }
};

// ==================== SMOOTH SCROLL ====================
const SmoothScroll = {
    init() {
        // Обработка всех якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Пропускаем пустые ссылки и якоря для модальных окон
                if (href === '#' || anchor.hasAttribute('data-modal')) {
                    return;
                }

                e.preventDefault();
                this.scrollToElement(href);
            });
        });

        // Обработка специальных кнопок
        document.querySelectorAll('[data-scroll-to]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('data-scroll-to');
                this.scrollToElement(`#${targetId}`);
            });
        });
    },

    scrollToElement(selector) {
        const targetElement = document.querySelector(selector);
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - CONFIG.scrollOffset;
        const duration = 800;
        let startTime = null;

        // Анимация скролла
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // Easing function (easeInOutCubic)
            const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            const scrollPosition = startPosition + distance * easeInOutCubic(progress);

            window.scrollTo(0, scrollPosition);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }
};

// ==================== ANIMATIONS ON SCROLL ====================
const ScrollAnimations = {
    init() {
        if (!CONFIG.enableAnimations) return;

        // Наблюдатель для элементов
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Наблюдаем за всеми анимируемыми элементами
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // Добавляем начальные стили
        this.addInitialStyles();
    },

    addInitialStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-on-scroll.animated {
                opacity: 1;
                transform: translateY(0);
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    },

    animateElement(element) {
        element.classList.add('animated');

        // Добавляем задержку для дочерних элементов
        const children = element.querySelectorAll('.animate-delay');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    }
};

// ==================== SOCIAL MEDIA HANDLING ====================
const SocialMedia = {
    init() {
        // Открытие ссылок в новом окне
        document.querySelectorAll('.social-link').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });

        // Аналитика кликов (заглушка для реальной аналитики)
        this.trackSocialClicks();
    },

    trackSocialClicks() {
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', () => {
                const platform = link.classList.contains('telegram') ? 'telegram' : 
                               link.classList.contains('instagram') ? 'instagram' : 'other';
                
                // Здесь можно отправлять данные в аналитику
                console.log(`Social link clicked: ${platform}`);
                
                // Пример отправки в Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'social_click', {
                        'event_category': 'Social',
                        'event_label': platform,
                        'transport_type': 'beacon'
                    });
                }
            });
        });
    }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Mistral Studio website initialized');

    // Удаляем no-js класс
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

    // Инициализируем все модули
    MobileMenu.init();
    HeaderEffects.init();
    FormHandler.init();
    ModalSystem.init();
    SmoothScroll.init();
    ScrollAnimations.init();
    SocialMedia.init();

    // Устанавливаем текущий год в футере
    if (DOM.currentYearSpan) {
        DOM.currentYearSpan.textContent = new Date().getFullYear();
    }

    // Предзагрузка изображений
    this.preloadImages();

    // Инициализация служебных функций
    this.initUtilities();
});

// ==================== IMAGE PRELOADING ====================
function preloadImages() {
    const images = [
        'https://i.pinimg.com/736x/0f/65/e6/0f65e6d9a9b0a5acbcbd9f6584529700.jpg',
        'https://i.pinimg.com/736x/a2/2a/ab/a22aab15e7b7f7f80833a6b2e44da33a.jpg',
        'https://i.pinimg.com/736x/1a/7f/23/1a7f239a992ee45f0f8cce33bc55edc9.jpg'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ==================== UTILITY INITIALIZATION ====================
function initUtilities() {
    // Ленивая загрузка изображений
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Обработка ошибок загрузки изображений
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.alt = 'Изображение не загружено';
            this.style.border = '1px dashed #ccc';
            console.warn('Failed to load image:', this.src);
        });
    });
}

// ==================== SERVICE WORKER (PWA) ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ==================== PERFORMANCE MONITORING ====================
if ('PerformanceObserver' in window) {
    try {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('Performance entry:', entry);
            }
        });

        perfObserver.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
    } catch (e) {
        console.log('Performance monitoring not supported:', e);
    }
            }
