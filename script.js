/* ============================================
   DR. NANDAN KUMAR DHIR — Premium Portfolio
   v3.0 — Enhanced Dynamic JavaScript
   ============================================ */

(function () {
    'use strict';

    // =============================================
    // Utility: Debounce
    // =============================================
    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // =============================================
    // Utility: Throttle (for scroll handlers)
    // =============================================
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

    // =============================================
    // DOM Ready
    // =============================================
    document.addEventListener('DOMContentLoaded', function () {

        // =============================================
        // 0. LOADING SCREEN
        // =============================================
        const loader = document.getElementById('loader');
        if (loader) {
            // Slightly longer for premium feel
            setTimeout(function () {
                loader.classList.add('hidden');
                document.body.classList.add('loaded');
            }, 2400);
        }

        // =============================================
        // 1. PARTICLE CANVAS (Optimized)
        // =============================================
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let mouse = { x: null, y: null };
            let animFrameId = null;

            function resizeCanvas() {
                const hero = canvas.parentElement;
                canvas.width = hero.offsetWidth;
                canvas.height = hero.offsetHeight;
            }

            function createParticles() {
                particles = [];
                const isMobile = window.innerWidth < 768;
                const count = isMobile ? 20 : 50;

                for (let i = 0; i < count; i++) {
                    const isTeal = Math.random() > 0.4;
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 2.2 + 0.4,
                        vx: (Math.random() - 0.5) * 0.3,
                        vy: (Math.random() - 0.5) * 0.3,
                        opacity: Math.random() * 0.35 + 0.08,
                        color: isTeal ? 'rgba(13, 148, 136,' : 'rgba(255, 255, 255,',
                        pulse: Math.random() * Math.PI * 2,
                        pulseSpeed: 0.008 + Math.random() * 0.015
                    });
                }
            }

            function drawParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const connectionDist = window.innerWidth < 768 ? 100 : 120;

                particles.forEach(function (p, i) {
                    p.pulse += p.pulseSpeed;
                    const dynamicOpacity = p.opacity + Math.sin(p.pulse) * 0.08;

                    // Mouse interaction
                    if (mouse.x && mouse.y) {
                        const dx = p.x - mouse.x;
                        const dy = p.y - mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 110) {
                            const force = (110 - dist) / 110 * 0.25;
                            p.x += (dx / dist) * force;
                            p.y += (dy / dist) * force;
                        }
                    }

                    p.x += p.vx;
                    p.y += p.vy;

                    // Wrap
                    if (p.x < -10) p.x = canvas.width + 10;
                    if (p.x > canvas.width + 10) p.x = -10;
                    if (p.y < -10) p.y = canvas.height + 10;
                    if (p.y > canvas.height + 10) p.y = -10;

                    // Draw particle
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.color + Math.max(0, dynamicOpacity) + ')';
                    ctx.fill();

                    // Glow for larger particles
                    if (p.radius > 1.4) {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
                        ctx.fillStyle = p.color + (dynamicOpacity * 0.06) + ')';
                        ctx.fill();
                    }

                    // Connections
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx2 = p.x - p2.x;
                        const dy2 = p.y - p2.y;
                        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                        if (dist2 < connectionDist) {
                            const lineOpacity = 0.05 * (1 - dist2 / connectionDist);
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = 'rgba(13, 148, 136,' + lineOpacity + ')';
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                });

                animFrameId = requestAnimationFrame(drawParticles);
            }

            // Pause animation when hero not visible
            const heroSection = document.getElementById('hero');
            if (heroSection && 'IntersectionObserver' in window) {
                const heroObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            if (!animFrameId) drawParticles();
                        } else {
                            if (animFrameId) {
                                cancelAnimationFrame(animFrameId);
                                animFrameId = null;
                            }
                        }
                    });
                }, { threshold: 0.05 });
                heroObserver.observe(heroSection);
            }

            canvas.addEventListener('mousemove', function (e) {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });
            canvas.addEventListener('mouseleave', function () {
                mouse.x = null;
                mouse.y = null;
            });

            resizeCanvas();
            createParticles();
            drawParticles();

            window.addEventListener('resize', debounce(function () {
                resizeCanvas();
                createParticles();
            }, 300));
        }

        // =============================================
        // 2. SCROLL PROGRESS BAR
        // =============================================
        const scrollProgress = document.getElementById('scroll-progress');
        function updateScrollProgress() {
            if (!scrollProgress) return;
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }

        // =============================================
        // 3. STICKY NAVBAR + ACTIVE LINK
        // =============================================
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        function handleScroll() {
            const scrollY = window.scrollY;

            // Navbar background
            if (navbar) {
                navbar.classList.toggle('scrolled', scrollY > 60);
            }

            // Active nav link
            let current = '';
            sections.forEach(function (section) {
                const sectionTop = section.offsetTop - 140;
                if (scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });

            // Back to top
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) {
                backToTop.classList.toggle('visible', scrollY > 500);
            }

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
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                    // Close mobile nav
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
        // 5. MOBILE NAVIGATION
        // =============================================
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileNav = document.querySelector('.mobile-nav');

        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener('click', function () {
                this.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            });

            // Close on overlay click
            mobileNav.addEventListener('click', function (e) {
                if (e.target === mobileNav) {
                    mobileToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Close on Escape
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                    mobileToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // =============================================
        // 6. SCROLL-TRIGGERED ANIMATIONS
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
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            });

            animatedElements.forEach(function (el) { observer.observe(el); });
        } else {
            animatedElements.forEach(function (el) { el.classList.add('animated'); });
        }

        // =============================================
        // 7. ANIMATED COUNTERS
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

                function easeOutQuart(t) {
                    return 1 - Math.pow(1 - t, 4);
                }

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    counter.textContent = Math.floor(easeOutQuart(progress) * target);
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target;
                    }
                }
                requestAnimationFrame(update);
            });
            countersAnimated = true;
        }

        const counterGrid = document.querySelector('.counter-grid');
        if (counterGrid && 'IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounters();
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });
            counterObserver.observe(counterGrid);
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
                        card.style.transform = 'translateY(12px)';
                        setTimeout(function () {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 40 + index * 60);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(8px)';
                        setTimeout(function () {
                            card.classList.add('hidden');
                        }, 250);
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
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const name = document.getElementById('contact-name');
                const email = document.getElementById('contact-email');
                const message = document.getElementById('contact-message');

                if (!name || !name.value.trim()) { showNotification('Please enter your name.'); return; }
                if (!email || !email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showNotification('Please enter a valid email.'); return; }
                if (!message || !message.value.trim()) { showNotification('Please enter your message.'); return; }

                const btn = contactForm.querySelector('button[type="submit"]');
                if (btn) {
                    const original = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    btn.disabled = true;
                    btn.style.opacity = '0.7';
                    setTimeout(function () {
                        btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                        btn.style.opacity = '1';
                        showNotification('Message sent successfully! Dr. Dhir will get back to you soon.');
                        setTimeout(function () {
                            btn.innerHTML = original;
                            btn.disabled = false;
                            contactForm.reset();
                        }, 2500);
                    }, 1500);
                }
            });
        }

        // =============================================
        // 12. NEWSLETTER FORM
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
                    typeSpeed = 30;
                } else {
                    typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                    charIndex++;
                    typeSpeed = 70;
                }

                if (!isDeleting && charIndex === currentPhrase.length) {
                    typeSpeed = 2400;
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
        // 14. MOUSE FOLLOWER (Desktop Only)
        // =============================================
        const follower = document.getElementById('mouse-follower');
        if (follower && window.innerWidth >= 1024) {
            let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

            document.addEventListener('mousemove', function (e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            function animateFollower() {
                followerX += (mouseX - followerX) * 0.12;
                followerY += (mouseY - followerY) * 0.12;
                follower.style.left = followerX + 'px';
                follower.style.top = followerY + 'px';
                requestAnimationFrame(animateFollower);
            }
            animateFollower();

            const interactives = document.querySelectorAll('a, button, .expertise-card, .publication-card, .blog-card, .achievement-card, .contact-card, .approval-card, .edu-card');
            interactives.forEach(function (el) {
                el.addEventListener('mouseenter', function () {
                    follower.style.width = '40px';
                    follower.style.height = '40px';
                    follower.style.borderColor = 'rgba(13, 148, 136, 0.5)';
                    follower.style.borderWidth = '1px';
                });
                el.addEventListener('mouseleave', function () {
                    follower.style.width = '20px';
                    follower.style.height = '20px';
                    follower.style.borderColor = 'rgba(13, 148, 136, 0.35)';
                    follower.style.borderWidth = '1.5px';
                });
            });
        }

        // =============================================
        // 15. CARD TILT EFFECT (Desktop Only)
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
                    const rotateX = (y - centerY) / centerY * -3;
                    const rotateY = (x - centerX) / centerX * 3;
                    card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
                });
                card.addEventListener('mouseleave', function () {
                    card.style.transform = '';
                    card.style.transition = 'transform 0.4s ease';
                    setTimeout(() => card.style.transition = '', 400);
                });
            });
        }

        // =============================================
        // 16. PARALLAX ON DECORATIVE ELEMENTS
        // =============================================
        const heroDecos = document.querySelectorAll('.hero-deco');
        if (heroDecos.length > 0 && window.innerWidth >= 768) {
            window.addEventListener('scroll', throttle(function () {
                const scrollY = window.scrollY;
                if (scrollY > window.innerHeight) return; // Skip when hero out of view
                heroDecos.forEach(function (deco, i) {
                    const speed = 0.12 + (i * 0.04);
                    deco.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
                });
            }, 16), { passive: true });
        }

        // =============================================
        // 17. COUNTER GRADIENT ANIMATION
        // =============================================
        if (counterGrid) {
            const counterObserver2 = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.backgroundSize = '200% 200%';
                        entry.target.style.animation = 'gradientShift 5s ease infinite';
                    }
                });
            }, { threshold: 0.25 });
            counterObserver2.observe(counterGrid);
        }

        // =============================================
        // 18. FOCUS MANAGEMENT FOR ACCESSIBILITY
        // =============================================
        // Add focus-visible outlines for keyboard users
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        document.addEventListener('mousedown', function () {
            document.body.classList.remove('keyboard-nav');
        });

    }); // End DOMContentLoaded
})(); // End IIFE
