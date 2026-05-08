/* ============================================================
   HIREFLOW VA — main.js
   Shared across all pages
   ============================================================ */

(function () {
  'use strict';

  /* ── Mobile nav toggle ─────────────────────────────────────── */
  function initMobileNav() {
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('.nav__mobile-link, .btn').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ── Active nav link ───────────────────────────────────────── */
  function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .nav__mobile-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      const isHome = (path === '' || path === 'index.html') && (linkFile === 'index.html' || linkFile === '');
      const isMatch = linkFile === path;
      if (isHome || isMatch) link.classList.add('active');
    });
  }

  /* ── Smooth scroll for anchor links ───────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ── FAQ accordion ─────────────────────────────────────────── */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const btn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
        btn.setAttribute('aria-expanded', isOpen);
      });
    });
  }

  /* ── Scroll-reveal (Intersection Observer) ─────────────────── */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ── Sticky nav shadow on scroll ───────────────────────────── */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const update = () => {
      nav.style.boxShadow = window.scrollY > 8 ? '0 2px 20px rgba(0,0,0,0.12)' : '';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Contact form handling ──────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('bookForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      // Simulate async submission
      setTimeout(() => {
        const wrap = form.closest('.book-form-wrap');
        wrap.innerHTML = `
          <div class="form-success">
            <div class="form-success__icon">✓</div>
            <h3>You're booked in!</h3>
            <p>Thanks for reaching out. Our team will confirm your call within one business day and send you a calendar invite.</p>
            <a href="index.html" class="btn btn-primary">Back to Home</a>
          </div>`;
      }, 1200);
    });
  }

  /* ── Counter animation ──────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();

        const tick = (now) => {
          const elapsed = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - elapsed, 3);
          const current = target * eased;
          el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
          if (elapsed < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => observer.observe(el));
  }

  /* ── Init all ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    setActiveNavLink();
    initSmoothScroll();
    initFAQ();
    initScrollReveal();
    initNavScroll();
    initContactForm();
    initCounters();
  });
})();
