/* ============================================
   DR. NANDAN KUMAR DHIR — ULTRA PREMIUM PORTFOLIO
   v4.0 — Creative Dynamic JavaScript
   ============================================ */

(function () {
    'use strict';

    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function throttle(fn, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    document.addEventListener('DOMContentLoaded', function () {

        // =============================================
        // 0. LOADER
        // =============================================
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(function () {
                loader.classList.add('hidden');
                document.body.classList.add('loaded');
            }, 2500);
        }

        // =============================================
        // 1. PARTICLE CANVAS — Multi-color Aurora
        // =============================================
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let mouse = { x: null, y: null };
            let animFrameId = null;

            // Color palette for particles
            const particleColors = [
                'rgba(14, 165, 233,',   // Blue
                'rgba(20, 184, 166,',   // Teal
                'rgba(139, 92, 246,',   // Purple
                'rgba(245, 158, 11,',   // Gold
                'rgba(255, 255, 255,',  // White
            ];

            function resizeCanvas() {
                const hero = canvas.parentElement;
                canvas.width = hero.offsetWidth;
                canvas.height = hero.offsetHeight;
            }

            function createParticles() {
                particles = [];
                const isMobile = window.innerWidth < 768;
                const count = isMobile ? 22 : 55;

                for (let i = 0; i < count; i++) {
                    const colorIndex = Math.random() < 0.4 ? 0 : Math.random() < 0.6 ? 1 : Math.random() < 0.8 ? 4 : Math.random() < 0.9 ? 2 : 3;
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 2.5 + 0.3,
                        vx: (Math.random() - 0.5) * 0.28,
                        vy: (Math.random() - 0.5) * 0.28,
                        opacity: Math.random() * 0.35 + 0.08,
                        color: particleColors[colorIndex],
                        pulse: Math.random() * Math.PI * 2,
                        pulseSpeed: 0.006 + Math.random() * 0.012
                    });
                }
            }

            function drawParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const connectionDist = window.innerWidth < 768 ? 90 : 115;

                particles.forEach(function (p, i) {
                    p.pulse += p.pulseSpeed;
                    const dynamicOpacity = p.opacity + Math.sin(p.pulse) * 0.1;

                    // Mouse push
                    if (mouse.x && mouse.y) {
                        const dx = p.x - mouse.x;
                        const dy = p.y - mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            const force = (120 - dist) / 120 * 0.3;
                            p.x += (dx / dist) * force;
                            p.y += (dy / dist) * force;
                        }
                    }

                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < -10) p.x = canvas.width + 10;
                    if (p.x > canvas.width + 10) p.x = -10;
                    if (p.y < -10) p.y = canvas.height + 10;
                    if (p.y > canvas.height + 10) p.y = -10;

                    // Draw
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.color + Math.max(0, dynamicOpacity) + ')';
                    ctx.fill();

                    // Glow
                    if (p.radius > 1.3) {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
                        ctx.fillStyle = p.color + (dynamicOpacity * 0.05) + ')';
                        ctx.fill();
                    }

                    // Connections with gradient
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx2 = p.x - p2.x;
                        const dy2 = p.y - p2.y;
                        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                        if (dist2 < connectionDist) {
                            const lineOpacity = 0.04 * (1 - dist2 / connectionDist);
                            const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
                            gradient.addColorStop(0, p.color + lineOpacity + ')');
                            gradient.addColorStop(1, p2.color + lineOpacity + ')');
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = gradient;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                });

                animFrameId = requestAnimationFrame(drawParticles);
            }

            // Pause when hero not visible
            const heroSection = document.getElementById('hero');
            if (heroSection && 'IntersectionObserver' in window) {
                const heroObs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            if (!animFrameId) drawParticles();
                        } else {
                            if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
                        }
                    });
                }, { threshold: 0.05 });
                heroObs.observe(heroSection);
            }

            canvas.addEventListener('mousemove', function (e) {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });
            canvas.addEventListener('mouseleave', function () { mouse.x = null; mouse.y = null; });

            resizeCanvas();
            createParticles();
            drawParticles();
            window.addEventListener('resize', debounce(function () { resizeCanvas(); createParticles(); }, 300));
        }

        // =============================================
        // 2. SCROLL PROGRESS
        // =============================================
        const scrollProgress = document.getElementById('scroll-progress');
        function updateScrollProgress() {
            if (!scrollProgress) return;
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        }

        // =============================================
        // 3. NAVBAR + ACTIVE LINK
        // =============================================
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        function handleScroll() {
            const scrollY = window.scrollY;
            if (navbar) navbar.classList.toggle('scrolled', scrollY > 60);

            let current = '';
            sections.forEach(function (section) {
                if (scrollY >= section.offsetTop - 140) current = section.getAttribute('id');
            });
            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) link.classList.add('active');
            });

            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) backToTop.classList.toggle('visible', scrollY > 500);
            updateScrollProgress();
        }

        window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
        handleScroll();

        // =============================================
        // 4. SMOOTH SCROLLING
        // =============================================
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 76;
                    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: 'smooth' });

                    const mobileNav = document.querySelector('.mobile-nav');
                    const mobileToggle = document.querySelector('.mobile-toggle');
                    if (mobileNav && mobileNav.classList.contains('active')) {
                        mobileNav.classList.remove('active');
                        if (mobileToggle) mobileToggle.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            });
        });

        // =============================================
        // 5. MOBILE NAV
        // =============================================
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileNav = document.querySelector('.mobile-nav');

        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener('click', function () {
                this.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            });
            mobileNav.addEventListener('click', function (e) {
                if (e.target === mobileNav) {
                    mobileToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                    mobileToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // =============================================
        // 6. SCROLL ANIMATIONS
        // =============================================
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
            animatedElements.forEach(function (el) { observer.observe(el); });
        } else {
            animatedElements.forEach(function (el) { el.classList.add('animated'); });
        }

        // =============================================
        // 7. COUNTERS
        // =============================================
        const counters = document.querySelectorAll('.counter');
        let countersAnimated = false;

        function animateCounters() {
            if (countersAnimated) return;
            counters.forEach(function (counter) {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                if (isNaN(target)) return;
                const duration = 2200;
                const start = performance.now();
                function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    counter.textContent = Math.floor(easeOutQuart(progress) * target);
                    if (progress < 1) requestAnimationFrame(update);
                    else counter.textContent = target;
                }
                requestAnimationFrame(update);
            });
            countersAnimated = true;
        }

        const counterGrid = document.querySelector('.counter-grid');
        if (counterGrid && 'IntersectionObserver' in window) {
            const cObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) { animateCounters(); cObs.unobserve(entry.target); }
                });
            }, { threshold: 0.25 });
            cObs.observe(counterGrid);
        }

        // =============================================
        // 8. PUBLICATION FILTERS
        // =============================================
        const filterBtns = document.querySelectorAll('.filter-btn');
        const publicationCards = document.querySelectorAll('.publication-card');

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');

                publicationCards.forEach(function (card, index) {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px) scale(0.97)';
                        setTimeout(function () {
                            card.style.transition = 'opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1), transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        }, 40 + index * 70);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(function () { card.classList.add('hidden'); }, 300);
                    }
                });
            });
        });

        // =============================================
        // 9. BACK TO TOP
        // =============================================
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // =============================================
        // 10. COOKIE BANNER
        // =============================================
        const cookieBanner = document.getElementById('cookie-banner');
        const cookieAccept = document.getElementById('cookie-accept');
        if (cookieBanner) {
            if (localStorage.getItem('cookiesAccepted') === 'true') {
                cookieBanner.classList.add('hidden');
            } else {
                setTimeout(function () { cookieBanner.classList.remove('hidden'); }, 3500);
            }
        }
        if (cookieAccept) {
            cookieAccept.addEventListener('click', function () {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieBanner.classList.add('hidden');
            });
        }

        // =============================================
        // 11. CONTACT FORM
        // =============================================
        const contactForm = document.getElementById('contact-form');
        const notification = document.getElementById('notification');

        function showNotification(msg) {
            if (!notification) return;
            const textEl = document.getElementById('notification-text');
            if (textEl) textEl.textContent = msg;
            notification.classList.add('show');
            setTimeout(function () { notification.classList.remove('show'); }, 4000);
        }

        if (contactForm) {
            // ——— Google Sheets Web App URL ———
            // Replace this with your deployed Google Apps Script URL
            const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyF4Of20yctGHGQDkI56qM4kxhTkEkpqkqsOpT3ragJpksSTcqBOoqYVVGDt3Rlt9jU/exec';

            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const name = document.getElementById('contact-name');
                const email = document.getElementById('contact-email');
                const subject = document.getElementById('contact-subject');
                const message = document.getElementById('contact-message');

                if (!name || !name.value.trim()) { showNotification('Please enter your name.'); return; }
                if (!email || !email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showNotification('Please enter a valid email.'); return; }
                if (!message || !message.value.trim()) { showNotification('Please enter your message.'); return; }

                const btn = contactForm.querySelector('button[type="submit"]');
                const original = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    btn.disabled = true;
                    btn.style.opacity = '0.7';
                }

                // Build form data
                const formData = new FormData();
                formData.append('name', name.value.trim());
                formData.append('email', email.value.trim());
                formData.append('subject', subject ? subject.value.trim() : '');
                formData.append('message', message.value.trim());
                formData.append('timestamp', new Date().toLocaleString());

                fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    body: formData
                })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (btn) {
                        btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                        btn.style.opacity = '1';
                    }
                    showNotification('Message sent successfully! Dr. Dhir will get back to you soon.');
                    setTimeout(function () {
                        if (btn) { btn.innerHTML = original; btn.disabled = false; }
                        contactForm.reset();
                    }, 2500);
                })
                .catch(function (err) {
                    console.error('Form error:', err);
                    if (btn) {
                        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
                        btn.style.opacity = '1';
                    }
                    showNotification('Something went wrong. Please try again or contact via email.');
                    setTimeout(function () {
                        if (btn) { btn.innerHTML = original; btn.disabled = false; }
                    }, 2500);
                });
            });
        }

        // =============================================
        // 12. NEWSLETTER
        // =============================================
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const input = this.querySelector('input[type="email"]');
                if (!input || !input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                    showNotification('Please enter a valid email address.');
                    return;
                }
                showNotification('Successfully subscribed! Thank you.');
                input.value = '';
            });
        }

        // =============================================
        // 13. TYPING EFFECT
        // =============================================
        const typingElement = document.getElementById('typing-text');
        if (typingElement) {
            const phrases = [
                'GMP Compliance',
                'Data Integrity',
                'Regulatory Excellence',
                'Quality Leadership',
                'Green Analytical Chemistry',
                'USFDA Audit Readiness',
                'QMS Implementation'
            ];
            let phraseIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 80;

            function typeEffect() {
                const currentPhrase = phrases[phraseIndex];
                if (isDeleting) {
                    typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                    charIndex--;
                    typeSpeed = 28;
                } else {
                    typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                    charIndex++;
                    typeSpeed = 68;
                }
                if (!isDeleting && charIndex === currentPhrase.length) {
                    typeSpeed = 2500;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typeSpeed = 500;
                }
                setTimeout(typeEffect, typeSpeed);
            }
            setTimeout(typeEffect, 2800);
        }

        // =============================================
        // 14. MOUSE FOLLOWER
        // =============================================
        const follower = document.getElementById('mouse-follower');
        if (follower && window.innerWidth >= 1024) {
            let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

            document.addEventListener('mousemove', function (e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            function animateFollower() {
                followerX += (mouseX - followerX) * 0.1;
                followerY += (mouseY - followerY) * 0.1;
                follower.style.left = followerX + 'px';
                follower.style.top = followerY + 'px';
                requestAnimationFrame(animateFollower);
            }
            animateFollower();

            const interactives = document.querySelectorAll('a, button, .expertise-card, .publication-card, .blog-card, .achievement-card, .contact-card, .approval-card, .edu-card, .pillar-card, .training-tag');
            interactives.forEach(function (el) {
                el.addEventListener('mouseenter', function () {
                    follower.style.width = '45px';
                    follower.style.height = '45px';
                    follower.style.borderColor = 'rgba(14, 165, 233, 0.4)';
                    follower.style.borderWidth = '1px';
                });
                el.addEventListener('mouseleave', function () {
                    follower.style.width = '20px';
                    follower.style.height = '20px';
                    follower.style.borderColor = 'rgba(14, 165, 233, 0.3)';
                    follower.style.borderWidth = '1.5px';
                });
            });
        }

        // =============================================
        // 15. CARD TILT — Premium 3D Effect
        // =============================================
        if (window.innerWidth >= 1024) {
            const tiltCards = document.querySelectorAll('[data-tilt]');
            tiltCards.forEach(function (card) {
                card.addEventListener('mousemove', function (e) {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / centerY * -3.5;
                    const rotateY = (x - centerX) / centerX * 3.5;
                    card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px) scale(1.01)';
                });
                card.addEventListener('mouseleave', function () {
                    card.style.transform = '';
                    card.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
                    setTimeout(() => card.style.transition = '', 500);
                });
            });
        }

        // =============================================
        // 16. PARALLAX
        // =============================================
        const heroDecos = document.querySelectorAll('.hero-deco');
        if (heroDecos.length > 0 && window.innerWidth >= 768) {
            window.addEventListener('scroll', throttle(function () {
                const scrollY = window.scrollY;
                if (scrollY > window.innerHeight) return;
                heroDecos.forEach(function (deco, i) {
                    deco.style.transform = 'translateY(' + (scrollY * (0.1 + i * 0.04)) + 'px)';
                });
            }, 16), { passive: true });
        }

        // =============================================
        // 17. MAGNETIC BUTTONS
        // =============================================
        if (window.innerWidth >= 1024) {
            const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
            magneticBtns.forEach(function (btn) {
                btn.addEventListener('mousemove', function (e) {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15 - 3) + 'px) scale(1.03)';
                });
                btn.addEventListener('mouseleave', function () {
                    btn.style.transform = '';
                    btn.style.transition = 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)';
                    setTimeout(() => btn.style.transition = '', 400);
                });
            });
        }

        // =============================================
        // 18. COUNTER BG ANIMATION
        // =============================================
        if (counterGrid) {
            const cObs2 = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.backgroundSize = '200% 200%';
                        entry.target.style.animation = 'gradientShift 5s ease infinite';
                    }
                });
            }, { threshold: 0.25 });
            cObs2.observe(counterGrid);
        }

        // =============================================
        // 19. KEYBOARD A11Y
        // =============================================
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
        });
        document.addEventListener('mousedown', function () {
            document.body.classList.remove('keyboard-nav');
        });

        // =============================================
        // 20. WAVE DIVIDER PARALLAX
        // =============================================
        const waveDividers = document.querySelectorAll('.wave-divider');
        if (waveDividers.length > 0 && window.innerWidth >= 768) {
            window.addEventListener('scroll', throttle(function () {
                waveDividers.forEach(function (wave) {
                    const rect = wave.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const offset = (rect.top / window.innerHeight) * 10;
                        wave.querySelector('svg').style.transform = 'translateY(' + offset + 'px)';
                    }
                });
            }, 32), { passive: true });
        }

    }); // End DOMContentLoaded
})(); // End IIFE
