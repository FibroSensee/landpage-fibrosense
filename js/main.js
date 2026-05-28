/**
 * FibroSense - JavaScript Principal
 * Funcionalidades: Menu mobile, scroll suave, animações e acessibilidade
 */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const header = document.getElementById('header');

    // Focus Trap para menu mobile (acessibilidade)
    function trapFocus(element) {
        const focusable = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        element.addEventListener('keydown', function handleTab(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        }, { once: true });
    }

    // Toggle do menu mobile
    menuToggle?.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        
        // Ativar focus trap quando menu abrir
        if (!isExpanded && navLinks.classList.contains('active')) {
            trapFocus(navLinks);
            const firstLink = navLinks.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    });

    // Fechar menu ao clicar em um link (mobile)
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 480) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 480 && 
            navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Header com sombra ao rolar
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Scroll suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });

    // Intersection Observer para animações de entrada (com fallback)
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.card, .step-card, .feature-content, .feature-image').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
});

// === COOKIE BANNER ===
function acceptCookies() {
    // Salva preferência no localStorage
    localStorage.setItem('fibrosense_cookies_accepted', 'true');
    
    // Adiciona classe de animação de saída
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.add('hide');
        
        // Remove do DOM após animação
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    }
}

// Mostra o banner se o usuário não aceitou ainda
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const accepted = localStorage.getItem('fibrosense_cookies_accepted');
    
    // Verifica se o banner existe e se não foi aceito
    if (banner && !accepted) {
        // Pequeno delay para melhor UX
        setTimeout(() => {
            banner.hidden = false;
            banner.style.display = 'flex';
        }, 500);
    } else if (banner) {
        // Já aceitou - esconde completamente
        banner.style.display = 'none';
    }
});