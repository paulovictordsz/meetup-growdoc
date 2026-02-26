// Carousel functionality
class Carousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.track = this.carousel.querySelector('.carousel-track');
        this.prevButton = this.carousel.querySelector('.prev');
        this.nextButton = this.carousel.querySelector('.next');
        this.dotsContainer = this.carousel.querySelector('.carousel-dots');
        this.cards = this.track.querySelectorAll('.testimonial-card, .result-card');
        this.currentIndex = 0;

        this.init();
    }

    init() {
        this.createDots();
        this.attachEventListeners();
        this.updateCarousel();
        this.autoPlay();
    }

    createDots() {
        this.cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Ir para o slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    }

    attachEventListeners() {
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());

        // Touch events for mobile swipe
        let startX = 0;
        let currentX = 0;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', () => {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });

        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.autoPlay());
    }

    updateCarousel() {
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 32; // 2rem gap
        const scrollPosition = (cardWidth + gap) * this.currentIndex;

        this.track.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    autoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all carousels
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => new Carousel(carousel));

    // Form submission handling - Desabilitado (usando UTM form)
    // const form = document.getElementById('applicationForm');
    // if (form) {
    //     form.addEventListener('submit', handleFormSubmit);
    // }

    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('a[href^="#"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', smoothScroll);
    });

    // Intersection Observer for fade-in animations - DESABILITADO
    // observeElements();

    // Add scroll progress indicator
    addScrollProgress();
});

// Form submission handler - Desabilitado (usando UTM form)
/*
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validate form
    if (!validateForm(data)) {
        return;
    }

    // Show loading state
    const submitButton = e.target.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        console.log('Form data:', data);

        // Show success message
        showMessage('Aplicação enviada com sucesso! Entraremos em contato em breve.', 'success');

        // Reset form
        e.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}
*/

// Form validation - Desabilitado (usando UTM form)
/*
function validateForm(data) {
    if (!data.name || data.name.trim().length < 3) {
        showMessage('Por favor, insira seu nome completo.', 'error');
        return false;
    }

    const phoneRegex = /^\d{10,11}$/;
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        showMessage('Por favor, insira um número de telefone válido.', 'error');
        return false;
    }

    return true;
}
*/

// Show message to user
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#00D9B5' : '#ff4444'};
        color: ${type === 'success' ? '#1a1a1a' : '#ffffff'};
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 4000);
}

// Smooth scroll function with ease-out-cubic (butter smooth)
function smoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition - 20;
            const duration = 800; // 800ms para scroll mais natural
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);

                // Ease-out cubic - considerada a mais natural para scroll
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                window.scrollTo(0, startPosition + (distance * easeProgress));

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        }
    }
}

// Intersection Observer for animations - DESABILITADO
/*
function observeElements() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections
    const elements = document.querySelectorAll('.problem-card, .testimonial-card, .result-card, .comparison-card, .section-title, .subsection-title');
    elements.forEach((el, index) => {
        el.classList.add('scroll-reveal');
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });
}
*/

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #00D9B5, #00B494);
        z-index: 10000;
        transition: width 0.3s ease-out;
        width: 0%;
        box-shadow: 0 0 10px rgba(0, 217, 181, 0.5);
    `;
    document.body.appendChild(progressBar);

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;

        // Add glow effect during scroll
        progressBar.style.boxShadow = '0 0 20px rgba(0, 217, 181, 0.8)';

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            progressBar.style.boxShadow = '0 0 10px rgba(0, 217, 181, 0.5)';
        }, 150);
    }, { passive: true });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Phone number formatting - Desabilitado (usando UTM form)
/*
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            e.target.value = value;
        });
    }
});
*/

// Lazy loading for background images (if needed)
function lazyLoadBackgrounds() {
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');

    const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bg = entry.target.getAttribute('data-bg');
                entry.target.style.backgroundImage = `url('${bg}')`;
                bgObserver.unobserve(entry.target);
            }
        });
    });

    lazyBackgrounds.forEach(bg => bgObserver.observe(bg));
}

// Call lazy load on init if needed
// lazyLoadBackgrounds();

// Performance optimization: Debounce scroll events
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

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const message = document.querySelector('.form-message');
        if (message) {
            message.remove();
        }
    }
});

// Detect if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('scroll-behavior', 'auto');
}

// ============================================
// FORMULÁRIO COM CAPTURA DE UTM + SUPABASE
// ============================================
(function() {
    'use strict';

    // --- Máscara de Telefone ---
    function applyPhoneMask(value) {
        const numbers = value.replace(/\D/g, '');
        if (!numbers) return '';
        if (numbers.length <= 10) {
            return numbers
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .substring(0, 14);
        } else {
            return numbers
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .substring(0, 15);
        }
    }

    function validatePhone(value) {
        const numbers = value.replace(/\D/g, '');
        return numbers.length === 10 || numbers.length === 11;
    }

    // --- Captura e Armazenamento de UTM ---
    function getUTMFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source:   urlParams.get('utm_source')   || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_medium:   urlParams.get('utm_medium')   || '',
            utm_content:  urlParams.get('utm_content')  || '',
            utm_term:     urlParams.get('utm_term')     || '',
            utm_id:       urlParams.get('utm_id')       || '',
            fbclid:       urlParams.get('fbclid')       || '',
            gclid:        urlParams.get('gclid')        || '',
            wbraid:       urlParams.get('wbraid')       || ''
        };
    }

    function saveUTMToStorage(utmParams) {
        try {
            Object.keys(utmParams).forEach(key => {
                if (utmParams[key]) localStorage.setItem('utm_' + key, utmParams[key]);
            });
            localStorage.setItem('utm_timestamp', Date.now());
        } catch (e) {}
    }

    function getUTMFromStorage() {
        return {
            utm_source:   localStorage.getItem('utm_utm_source')   || '',
            utm_campaign: localStorage.getItem('utm_utm_campaign') || '',
            utm_medium:   localStorage.getItem('utm_utm_medium')   || '',
            utm_content:  localStorage.getItem('utm_utm_content')  || '',
            utm_term:     localStorage.getItem('utm_utm_term')     || '',
            utm_id:       localStorage.getItem('utm_utm_id')       || '',
            fbclid:       localStorage.getItem('utm_fbclid')       || '',
            gclid:        localStorage.getItem('utm_gclid')        || '',
            wbraid:       localStorage.getItem('utm_wbraid')       || ''
        };
    }

    function initUTMCapture() {
        const currentUTM = getUTMFromURL();
        const hasUTMInURL = Object.values(currentUTM).some(val => val !== '');
        if (hasUTMInURL) {
            saveUTMToStorage(currentUTM);
            return currentUTM;
        }
        return getUTMFromStorage();
    }

    // --- Validação ---
    function showError(fieldName) {
        const field = document.querySelector(`input[name="${fieldName}"], select[name="${fieldName}"]`);
        const group = field?.closest('.form-group');
        if (group && field) {
            group.classList.add('has-error');
            field.classList.add('error');
        }
    }

    function clearError(fieldName) {
        const field = document.querySelector(`input[name="${fieldName}"], select[name="${fieldName}"]`);
        const group = field?.closest('.form-group');
        if (group && field) {
            group.classList.remove('has-error');
            field.classList.remove('error');
        }
    }

    // --- URLs ---
    var CAPTURE_URL = 'https://lswmkiyqznvuedbuyrkt.supabase.co/functions/v1/capture-lead';
    var WEBHOOK_URL = 'https://webhooks02.manager01.growdoc.com.br/webhook/redirect-global';

    // Params para o Supabase (apenas os campos que a tabela aceita)
    function buildSupabaseParams(formData) {
        var pageURL = window.location.href;
        return new URLSearchParams({
            name:     formData.name,
            email:    formData.email || '',
            phone:    formData.phone,
            page_url: pageURL
        });
    }

    // Params completos para o webhook (todos os campos + UTMs)
    function buildWebhookParams(formData, utmParams) {
        var pageURL = window.location.href;
        return new URLSearchParams({
            name:               formData.name,
            email:              formData.email || '',
            phone:              formData.phone,
            '01':               formData.is_vascular,
            '02':               formData.professional_stage,
            page_url:           pageURL,
            utm_source:         utmParams.utm_source,
            utm_campaign:       utmParams.utm_campaign,
            utm_medium:         utmParams.utm_medium,
            utm_content:        utmParams.utm_content,
            utm_term:           utmParams.utm_term,
            utm_id:             utmParams.utm_id,
            fbclid:             utmParams.fbclid,
            gclid:              utmParams.gclid,
            wbraid:             utmParams.wbraid
        });
    }

    // --- Submissão ---
    function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;

        const nameInput             = form.querySelector('input[name="name"]');
        const phoneInput            = form.querySelector('input[name="phone"]');
        const isVascularInput       = form.querySelector('select[name="is_vascular"]');
        const professionalStageInput = form.querySelector('select[name="professional_stage"]');

        const name             = nameInput.value.trim();
        const phone            = phoneInput.value.trim();
        const isVascular       = isVascularInput.value;
        const professionalStage = professionalStageInput.value;

        clearError('name');
        clearError('phone');
        clearError('is_vascular');
        clearError('professional_stage');

        let hasError = false;

        if (!name) { showError('name'); hasError = true; }
        if (!validatePhone(phone)) { showError('phone'); hasError = true; }
        if (!isVascular) { showError('is_vascular'); hasError = true; }
        if (!professionalStage) { showError('professional_stage'); hasError = true; }

        if (hasError) return;

        const utmParams = initUTMCapture();

        form.querySelector('input[name="utm_source"]').value   = utmParams.utm_source;
        form.querySelector('input[name="utm_campaign"]').value = utmParams.utm_campaign;
        form.querySelector('input[name="utm_medium"]').value   = utmParams.utm_medium;
        form.querySelector('input[name="utm_content"]').value  = utmParams.utm_content;
        form.querySelector('input[name="utm_term"]').value     = utmParams.utm_term;
        form.querySelector('input[name="utm_id"]').value       = utmParams.utm_id;
        form.querySelector('input[name="fbclid"]').value       = utmParams.fbclid;
        form.querySelector('input[name="gclid"]').value        = utmParams.gclid;
        form.querySelector('input[name="wbraid"]').value       = utmParams.wbraid;

        const formData = {
            name:               name,
            email:              '',
            phone:              phone.replace(/\D/g, ''),
            is_vascular:        isVascular,
            professional_stage: professionalStage
        };

        var supabaseParams = buildSupabaseParams(formData);
        var webhookParams  = buildWebhookParams(formData, utmParams);

        // Salva lead em background (sem bloquear o redirect)
        try {
            fetch(CAPTURE_URL + '?' + supabaseParams.toString(), { keepalive: true });
        } catch (e) {}

        var submitBtn  = form.querySelector('.submit-button');
        var loadingMsg = form.querySelector('.form-loading');
        submitBtn.disabled = true;
        loadingMsg.classList.add('active');

        window.location.href = WEBHOOK_URL + '?' + webhookParams.toString();
    }

    // --- Inicialização ---
    function init() {
        const initialUTM = initUTMCapture();
        console.log('🎯 UTM Parameters capturados:', initialUTM);

        const form = document.getElementById('utmCaptureForm');
        if (!form) return;

        form.addEventListener('submit', handleFormSubmit);

        const nameInput = form.querySelector('input[name="name"]');
        if (nameInput) nameInput.addEventListener('input', () => clearError('name'));

        const phoneInput = form.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                clearError('phone');
                this.value = applyPhoneMask(this.value);
            });
        }

        const isVascularInput = form.querySelector('select[name="is_vascular"]');
        if (isVascularInput) isVascularInput.addEventListener('change', () => clearError('is_vascular'));

        const professionalStageInput = form.querySelector('select[name="professional_stage"]');
        if (professionalStageInput) professionalStageInput.addEventListener('change', () => clearError('professional_stage'));

        console.log('✅ Formulário inicializado com sucesso');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
