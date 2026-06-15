'use strict';

// ─── MOBILE MENU ───
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ─── HEADER SCROLL SHADOW ───
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
  } else {
    header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
  }
}, { passive: true });

// ─── SCROLL FADE-IN ANIMATIONS ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.service-card, .why-card, .review-card, .proof-item'
).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

// ─── CONTACT FORM ───
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate submission (replace with real endpoint)
  setTimeout(() => {
    form.reset();
    btn.textContent = 'Send My Request';
    btn.disabled = false;
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1000);
}

// ─── SMOOTH ANCHOR SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
