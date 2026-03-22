document.addEventListener('DOMContentLoaded', function () {

    /* ===== SEARCH BUTTON RIPPLE EFFECT ===== */
    const searchBtn = document.querySelector('.search-box button');
    if (searchBtn) {
        searchBtn.addEventListener('click', function (e) {
            const input = document.querySelector('.search-box input');
            const query = input ? input.value.trim() : '';

            createRipple(e, searchBtn);

            if (query) {
                showToast('Searching for "' + query + '"...');
            } else {
                input.focus();
                shakeElement(document.querySelector('.search-box'));
            }
        });
    }

    /* ===== RIPPLE EFFECT ===== */
    function createRipple(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.4);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: rippleAnim 0.6s linear;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());
    }

    /* ===== RIPPLE KEYFRAME ===== */
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleAnim {
            to { transform: scale(4); opacity: 0; }
        }
        .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(80px);
            background: #1c1c1c;
            color: #fff;
            padding: 14px 28px;
            border-radius: 50px;
            font-size: 15px;
            font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.25);
            z-index: 9999;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
            opacity: 0;
        }
        .toast.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(style);

    /* ===== TOAST NOTIFICATION ===== */
    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('show'));
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 2800);
    }

    /* ===== SHAKE ANIMATION ===== */
    function shakeElement(el) {
        if (!el) return;
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = 'shake 0.4s ease';
        el.addEventListener('animationend', () => {
            el.style.animation = '';
        }, { once: true });
    }

    /* ===== NAV LINK ACTIVE STATE ===== */
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    /* ===== HEADER SCROLL SHADOW ===== */
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.18)';
            } else {
                header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }
        });
    }

    /* ===== ENTER KEY TRIGGERS SEARCH ===== */
    const searchInput = document.querySelector('.search-box input');
    const form = document.querySelector('.search-box');

    if (form) {
        form.addEventListener('submit', function () {
            const input = form.querySelector('input');
            let value = input.value.trim();

            if (value && !value.includes("zomato")) {
                input.value = value + " near me zomato";
            }
        });
    }
    if (searchInput) {
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                searchBtn && searchBtn.click();
            }
        });

        /* ===== INPUT TYPING ANIMATION ===== */
        const placeholders = [
            'Search for restaurants...',
            'Pizza, Burgers, Biryani...',
            'Find your favourite dish...',
            'Sushi, Chinese, Italian...'
        ];
        let phIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingTimeout;

        function typePlaceholder() {
            const current = placeholders[phIndex];

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            searchInput.placeholder = current.substring(0, charIndex);

            let delay = isDeleting ? 50 : 80;

            if (!isDeleting && charIndex === current.length) {
                delay = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phIndex = (phIndex + 1) % placeholders.length;
                delay = 300;
            }

            typingTimeout = setTimeout(typePlaceholder, delay);
        }

        typingTimeout = setTimeout(typePlaceholder, 1200);

        searchInput.addEventListener('focus', () => clearTimeout(typingTimeout));
        searchInput.addEventListener('blur', () => {
            if (!searchInput.value) {
                charIndex = 0;
                isDeleting = false;
                typingTimeout = setTimeout(typePlaceholder, 600);
            }
        });
    }

    /* ===== LOGO CLICK ===== */
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        logo.style.cursor = 'pointer';
    }

});
