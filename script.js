/* ==============================================
   VERIDION LIFE SCIENCES
   Premium Refined — Script (Final Polish)
   ============================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        // ===== LOADER =====
        var loader = document.getElementById('loader');
        if (loader) {
            setTimeout(function () {
                loader.classList.add('hidden');
                // Trigger hero animations after loader fades
                setTimeout(function () {
                    document.querySelectorAll('.hero-container .anim').forEach(function (el, i) {
                        setTimeout(function () { el.classList.add('visible'); }, i * 120);
                    });
                }, 200);
            }, 2400);
        }

        // ===== PARTICLES =====
        var canvas = document.getElementById('particle-canvas');
        if (canvas) {
            var ctx = canvas.getContext('2d');
            var particles = [];
            var mouse = { x: null, y: null };
            var animId = null;

            function resizeCanvas() {
                var hero = canvas.parentElement;
                canvas.width = hero.offsetWidth;
                canvas.height = hero.offsetHeight;
            }

            function createParticles() {
                particles = [];
                var count = window.innerWidth < 768 ? 22 : 55;
                for (var i = 0; i < count; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        r: Math.random() * 1.8 + 0.3,
                        vx: (Math.random() - 0.5) * 0.18,
                        vy: (Math.random() - 0.5) * 0.18,
                        opacity: Math.random() * 0.25 + 0.03,
                        pulse: Math.random() * Math.PI * 2,
                        ps: 0.003 + Math.random() * 0.006
                    });
                }
            }

            function drawParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var connectDist = window.innerWidth < 768 ? 90 : 120;

                for (var i = 0; i < particles.length; i++) {
                    var p = particles[i];
                    p.pulse += p.ps;
                    var op = p.opacity + Math.sin(p.pulse) * 0.07;

                    if (mouse.x !== null) {
                        var dx = p.x - mouse.x;
                        var dy = p.y - mouse.y;
                        var dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 150) {
                            var force = (150 - dist) / 150 * 0.3;
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

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(20,184,166,' + Math.max(0, op) + ')';
                    ctx.fill();

                    for (var j = i + 1; j < particles.length; j++) {
                        var p2 = particles[j];
                        var dx2 = p.x - p2.x;
                        var dy2 = p.y - p2.y;
                        var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                        if (dist2 < connectDist) {
                            var lineOp = 0.04 * (1 - dist2 / connectDist);
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = 'rgba(20,184,166,' + lineOp + ')';
                            ctx.lineWidth = 0.6;
                            ctx.stroke();
                        }
                    }
                }
                animId = requestAnimationFrame(drawParticles);
            }

            var heroSection = document.getElementById('hero');
            if (heroSection && 'IntersectionObserver' in window) {
                var heroObs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            if (!animId) drawParticles();
                        } else {
                            if (animId) { cancelAnimationFrame(animId); animId = null; }
                        }
                    });
                }, { threshold: 0.05 });
                heroObs.observe(heroSection);
            }

            canvas.addEventListener('mousemove', function (e) {
                var rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });
            canvas.addEventListener('mouseleave', function () {
                mouse.x = null; mouse.y = null;
            });

            resizeCanvas();
            createParticles();
            drawParticles();

            var resizeTimer;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    resizeCanvas();
                    createParticles();
                }, 300);
            });
        }

        // ===== NAVBAR SCROLL =====
        var navbar = document.getElementById('navbar');
        var navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta-btn)');
        var sections = document.querySelectorAll('section[id]');
        var backTopBtn = document.getElementById('back-to-top');
        var mobileSticky = document.getElementById('mobile-sticky-cta');
        var lastScroll = 0;
        var ticking = false;

        function onScroll() {
            var scrollY = window.scrollY;

            // Navbar background
            if (navbar) {
                navbar.classList.toggle('scrolled', scrollY > 60);
            }

            // Active nav link
            var current = '';
            sections.forEach(function (sec) {
                if (scrollY >= sec.offsetTop - 160) {
                    current = sec.getAttribute('id');
                }
            });
            navLinksAll.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });

            // Back to top
            if (backTopBtn) {
                backTopBtn.classList.toggle('visible', scrollY > 500);
            }

            // Mobile sticky CTA
            if (mobileSticky && window.innerWidth < 769) {
                var hero = document.getElementById('hero');
                if (hero) {
                    mobileSticky.classList.toggle('visible', scrollY > hero.offsetHeight * 0.5);
                }
            }

            lastScroll = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });
        onScroll();

        // ===== SMOOTH SCROLL =====
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    var navH = 72;
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.scrollY - navH,
                        behavior: 'smooth'
                    });
                    // Close mobile nav
                    closeMobileNav();
                }
            });
        });

        // ===== MOBILE NAV =====
        var hamburger = document.getElementById('hamburger');
        var mobileNav = document.getElementById('mobile-nav');

        function closeMobileNav() {
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', function () {
                this.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMobileNav();
        });

        // ===== SCROLL REVEAL =====
        var animElements = document.querySelectorAll('.anim:not(.hero-container .anim)');

        if (animElements.length > 0 && 'IntersectionObserver' in window) {
            var revealObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.06, rootMargin: '0px 0px -50px 0px' });

            animElements.forEach(function (el) {
                revealObs.observe(el);
            });
        } else {
            animElements.forEach(function (el) {
                el.classList.add('visible');
            });
        }

        // Also handle hero elements if no loader
        if (!loader) {
            document.querySelectorAll('.hero-container .anim').forEach(function (el) {
                el.classList.add('visible');
            });
        }

        // ===== COUNTERS =====
        var counters = document.querySelectorAll('.counter');
        var countersAnimated = false;

        function animateCounters() {
            if (countersAnimated) return;
            countersAnimated = true;

            counters.forEach(function (counter) {
                var target = parseInt(counter.getAttribute('data-target'), 10);
                if (isNaN(target)) return;

                var duration = 2200;
                var start = performance.now();

                function update(now) {
                    var elapsed = now - start;
                    var progress = Math.min(elapsed / duration, 1);
                    // Smoother easing
                    var eased = 1 - Math.pow(1 - progress, 4);
                    counter.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target;
                    }
                }
                requestAnimationFrame(update);
            });
        }

        var statsBar = document.querySelector('.stats-bar');
        if (statsBar && 'IntersectionObserver' in window) {
            var counterObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounters();
                        counterObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            counterObs.observe(statsBar);
        }

        // ===== PUBLICATION FILTERS =====
        var filterBtns = document.querySelectorAll('.filter-btn');
        var pubCards = document.querySelectorAll('.pub-card');

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');
                var filter = this.getAttribute('data-filter');

                pubCards.forEach(function (card, index) {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px)';
                        setTimeout(function () {
                            card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 40 + index * 70);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.97)';
                        setTimeout(function () { card.classList.add('hidden'); }, 350);
                    }
                });
            });
        });

        // ===== BACK TO TOP =====
        if (backTopBtn) {
            backTopBtn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // ===== COOKIE BANNER =====
        var cookieBanner = document.getElementById('cookie-banner');
        var cookieAccept = document.getElementById('cookie-accept');

        if (cookieBanner) {
            if (localStorage.getItem('cookiesAccepted') === 'true') {
                cookieBanner.classList.add('hidden');
            } else {
                setTimeout(function () {
                    cookieBanner.classList.remove('hidden');
                }, 3500);
            }
        }
        if (cookieAccept) {
            cookieAccept.addEventListener('click', function () {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieBanner.classList.add('hidden');
            });
        }

        // ===== CONTACT FORM — Google Sheets PRESERVED =====
        var contactForm = document.getElementById('contact-form');
        var notification = document.getElementById('notification');

        function showNotification(msg) {
            if (!notification) return;
            var textEl = document.getElementById('notification-text');
            if (textEl) textEl.textContent = msg;
            notification.classList.add('show');
            setTimeout(function () { notification.classList.remove('show'); }, 4000);
        }

        if (contactForm) {
            var GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyF4Of20yctGHGQDkI56qM4kxhTkEkpqkqsOpT3ragJpksSTcqBOoqYVVGDt3Rlt9jU/exec';

            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                var name = document.getElementById('contact-name');
                var email = document.getElementById('contact-email');
                var subject = document.getElementById('contact-subject');
                var message = document.getElementById('contact-message');

                if (!name || !name.value.trim()) { showNotification('Please enter your name.'); return; }
                if (!email || !email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                    showNotification('Please enter a valid email.'); return;
                }
                if (!message || !message.value.trim()) { showNotification('Please describe your challenges.'); return; }

                var btn = contactForm.querySelector('button[type="submit"]');
                var originalHTML = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    btn.disabled = true;
                    btn.style.opacity = '0.7';
                }

                // Hidden iframe method — PRESERVED EXACTLY
                var iframeName = 'hidden-form-iframe-' + Date.now();
                var iframe = document.createElement('iframe');
                iframe.name = iframeName;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                var hiddenForm = document.createElement('form');
                hiddenForm.method = 'POST';
                hiddenForm.action = GOOGLE_SHEET_URL;
                hiddenForm.target = iframeName;
                hiddenForm.style.display = 'none';

                var fields = {
                    name: name.value.trim(),
                    email: email.value.trim(),
                    subject: subject ? subject.value.trim() : '',
                    message: message.value.trim(),
                    timestamp: new Date().toLocaleString()
                };

                for (var key in fields) {
                    var input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = fields[key];
                    hiddenForm.appendChild(input);
                }

                document.body.appendChild(hiddenForm);
                hiddenForm.submit();

                iframe.addEventListener('load', function () {
                    if (btn) {
                        btn.innerHTML = '<i class="fas fa-check-circle"></i> Sent!';
                        btn.style.opacity = '1';
                    }
                    showNotification('Inquiry sent successfully! Dr. Dhir will respond soon.');
                    setTimeout(function () {
                        if (btn) { btn.innerHTML = originalHTML; btn.disabled = false; }
                        contactForm.reset();
                    }, 2500);
                    setTimeout(function () {
                        document.body.removeChild(iframe);
                        document.body.removeChild(hiddenForm);
                    }, 5000);
                });

                // Fallback timeout
                setTimeout(function () {
                    if (btn && btn.disabled) {
                        btn.innerHTML = '<i class="fas fa-check-circle"></i> Sent!';
                        btn.style.opacity = '1';
                        btn.disabled = false;
                        showNotification('Inquiry sent successfully! Dr. Dhir will respond soon.');
                        contactForm.reset();
                        setTimeout(function () { btn.innerHTML = originalHTML; }, 2000);
                    }
                }, 4000);
            });
        }

        // ===== TYPING EFFECT =====
        var typingElement = document.getElementById('typing-text');
        if (typingElement) {
            var phrases = [
                'GMP Compliance',
                'Data Integrity',
                'Audit Readiness',
                'Quality Systems',
                'Regulatory Strategy',
                'USFDA Compliance',
                'Green Chemistry',
                'CAPA & Risk Management'
            ];
            var phraseIndex = 0;
            var charIndex = 0;
            var isDeleting = false;
            var typeSpeed = 80;

            function typeEffect() {
                var currentPhrase = phrases[phraseIndex];

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
                    typeSpeed = 2800;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typeSpeed = 450;
                }

                setTimeout(typeEffect, typeSpeed);
            }

            setTimeout(typeEffect, 2800);
        }

        // ===== PARALLAX EFFECT ON HERO STATS =====
        var heroStatsBar = document.querySelector('.hero-stats-bar');
        if (heroStatsBar && window.innerWidth > 768) {
            window.addEventListener('scroll', function () {
                var scrollY = window.scrollY;
                if (scrollY < window.innerHeight) {
                    heroStatsBar.style.transform = 'translateY(' + (scrollY * 0.05) + 'px)';
                }
            }, { passive: true });
        }

    }); // End DOMContentLoaded
})(); // End IIFE
