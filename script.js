/* =============================================
   DIET WITH MO — script.js
   Interactivity: Navbar, Scroll Reveal, Mobile Nav
   ============================================= */

'use strict';

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
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');
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
        const num    = parseInt(text.replace(/[^0-9]/g, ''));
        if (!isNaN(num)) animateCounter(el, num, suffix);
      });
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// ─── Active nav link highlight on scroll ───────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

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
