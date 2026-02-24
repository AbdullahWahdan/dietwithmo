/* =============================================
   DIET WITH MO — script.js
   Interactivity: Navbar, Scroll Reveal, Mobile Nav,
   Language Toggle
   ============================================= */

'use strict';

// ─── Lock site in dark mode permanently ────────────────────────────────────
const htmlRoot = document.getElementById('htmlRoot');
htmlRoot.setAttribute('data-theme', 'dark');

// ─── Language Toggle ───────────────────────────────────────────────────────
const langToggle = document.getElementById('langToggle');
const flagEn = langToggle ? langToggle.querySelector('.lang-flag--en') : null;
const flagAr = langToggle ? langToggle.querySelector('.lang-flag--ar') : null;

function applyLanguage(lang) {
  const isAr = lang === 'ar';
  htmlRoot.setAttribute('lang', isAr ? 'ar' : 'en');
  htmlRoot.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  localStorage.setItem('dwm-lang', lang);

  // Swap all data-en / data-ar elements
  document.querySelectorAll('[data-en][data-ar]').forEach(el => {
    const text = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (el.children.length === 0) {
      el.textContent = text;
    } else if (el.tagName === 'A' && el.querySelector('svg')) {
      const nodes = [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE);
      if (nodes.length) nodes[nodes.length - 1].textContent = ' ' + text;
    } else {
      el.innerHTML = text;
    }
  });

  // Highlight the active flag
  if (flagEn && flagAr) {
    flagEn.classList.toggle('lang-flag--active', !isAr);
    flagAr.classList.toggle('lang-flag--active', isAr);
  }

  // Update button title
  if (langToggle) langToggle.title = isAr ? 'Switch to English' : 'التبديل إلى العربية';
}

// Restore saved language
const savedLang = localStorage.getItem('dwm-lang') || 'en';
applyLanguage(savedLang);

langToggle && langToggle.addEventListener('click', () => {
  const current = localStorage.getItem('dwm-lang') || 'en';
  applyLanguage(current === 'en' ? 'ar' : 'en');
});

// ─── Navbar scroll effect ───────────────────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ─── Mobile hamburger menu ──────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobileNav() {
  mobileNav.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileNav);
mobileClose.addEventListener('click', closeMobileNav);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

// Close on outside click
mobileNav.addEventListener('click', (e) => {
  if (e.target === mobileNav) closeMobileNav();
});

// ─── Smooth scroll for all anchor links ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

// ─── Scroll Reveal (Intersection Observer) ─────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling cards
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ─── Hero section entrance (always visible, just animate on load) ───────────
window.addEventListener('DOMContentLoaded', () => {
  // Animate hero elements with a stagger
  const heroText = document.querySelector('.hero-text');
  const heroImage = document.querySelector('.hero-image-side');

  if (heroText) {
    heroText.style.opacity = '0';
    heroText.style.transform = 'translateY(30px)';
    heroText.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
    requestAnimationFrame(() => {
      heroText.style.opacity = '1';
      heroText.style.transform = 'translateY(0)';
    });
  }

  if (heroImage) {
    heroImage.style.opacity = '0';
    heroImage.style.transform = 'translateY(30px)';
    heroImage.style.transition = 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s';
    requestAnimationFrame(() => {
      heroImage.style.opacity = '1';
      heroImage.style.transform = 'translateY(0)';
    });
  }
});

// ─── Animated counter for stats ────────────────────────────────────────────
function animateCounter(el, target, suffix, duration = 1600) {
  const rawTarget = parseInt(target);
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * rawTarget);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.hero-stats');
let statsAnimated = false;

if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-number').forEach(el => {
        const text = el.textContent.trim();
        const suffix = text.replace(/[0-9]/g, '');
        const num = parseInt(text.replace(/[^0-9]/g, ''));
        if (!isNaN(num)) animateCounter(el, num, suffix);
      });
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// ─── Active nav link highlight on scroll ───────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const sectionTop = sec.offsetTop - navbar.offsetHeight - 80;
    if (window.scrollY >= sectionTop) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--yellow)'
      : '';
  });
}, { passive: true });

// ─── Success Stories Carousel (3 visible, scroll 1 at a time) ──────────────
(function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');
  const curEl = document.getElementById('carouselCurrent');
  const totEl = document.getElementById('carouselTotal');

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;          // 8
  const VISIBLE = 3;
  const maxStep = total - VISIBLE;        // 5  (positions 0-5)
  let current = 0;
  let autoTimer;

  if (totEl) totEl.textContent = total;

  // Build one dot per navigable position
  for (let i = 0; i <= maxStep; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'View slide ' + (i + 1));
    dot.addEventListener('click', () => { resetAuto(); goTo(i); });
    dotsWrap.appendChild(dot);
  }

  function isRtl() {
    return document.documentElement.getAttribute('dir') === 'rtl';
  }

  function updateUI() {
    // Measure the actual slide width + gap in pixels (works with flex gap)
    const slideW = slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 24;
    // In RTL flex, items flow right→left so we need a positive offset to scroll forward
    const offset = current * (slideW + gap);
    track.style.transform = `translateX(${isRtl() ? offset : -offset}px)`;
    if (curEl) curEl.textContent = current + 1;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function goTo(index) {
    if (index < 0) index = maxStep;
    if (index > maxStep) index = 0;
    current = index;
    updateUI();
  }

  // In RTL the buttons swap sides visually (via CSS), so swap their step direction too
  prevBtn.addEventListener('click', () => { resetAuto(); goTo(isRtl() ? current + 1 : current - 1); });
  nextBtn.addEventListener('click', () => { resetAuto(); goTo(isRtl() ? current - 1 : current + 1); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { resetAuto(); goTo(isRtl() ? current + 1 : current - 1); }
    if (e.key === 'ArrowRight') { resetAuto(); goTo(isRtl() ? current - 1 : current + 1); }
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { resetAuto(); goTo(current + (dx < 0 ? 1 : -1)); }
  });

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4500); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  const outer = document.querySelector('.carousel-outer');
  if (outer) {
    outer.addEventListener('mouseenter', () => clearInterval(autoTimer));
    outer.addEventListener('mouseleave', startAuto);
  }

  updateUI();
  startAuto();
})();

// ─── Hall of Fame Tab Switcher ─────────────────────────────────────────────
(function initHofTabs() {
  const tabBtns = document.querySelectorAll('.hof-tab-btn');
  const panels = document.querySelectorAll('.hof-panel');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      // Update button states
      tabBtns.forEach(b => {
        b.classList.remove('hof-tab-btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('hof-tab-btn--active');
      btn.setAttribute('aria-selected', 'true');

      // Show matching panel, hide others
      panels.forEach(panel => {
        const isTarget = panel.id === 'hof-panel-' + target;
        if (isTarget) {
          panel.removeAttribute('hidden');
          panel.classList.add('hof-panel--active');
          // Re-trigger reveal for newly visible cards
          panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            revealObserver.observe(el);
          });
        } else {
          panel.setAttribute('hidden', '');
          panel.classList.remove('hof-panel--active');
        }
      });
    });
  });
})();


