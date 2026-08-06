/* Aqua Rezerv - лэндинг: навигация, анимации, форма → WhatsApp */
(function () {
  'use strict';

  /* Не восстанавливать скролл при перезагрузке */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('load', function () {
    if (!location.hash) window.scrollTo(0, 0);
  });

  var WA_NUMBER = '77053767812';

  /* ---------- Липкая шапка: тень при скролле ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function setMenu(open) {
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });
  overlay.addEventListener('click', function () { setMenu(false); });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Счётчики ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1600;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      /* easeOutCubic */
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('.counter__num');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = parseInt(el.getAttribute('data-count'), 10).toLocaleString('ru-RU');
    });
  }

  /* ---------- Год в футере ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Форма заявки → WhatsApp ---------- */
  var form = document.getElementById('leadForm');
  if (form) {
    var nameInput = document.getElementById('fName');
    var phoneInput = document.getElementById('fPhone');
    var productSelect = document.getElementById('fProduct');
    var errorEl = document.getElementById('formError');

    /* Мягкая маска телефона: только цифры, +, пробелы, скобки, дефис */
    phoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^\d+\s()-]/g, '');
    });

    [nameInput, phoneInput, productSelect].forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('is-invalid'); });
      el.addEventListener('change', function () { el.classList.remove('is-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = nameInput.value.trim();
      var phone = phoneInput.value.trim();
      var product = productSelect.value;
      var valid = true;

      if (name.length < 2) { nameInput.classList.add('is-invalid'); valid = false; }
      var digits = phone.replace(/\D/g, '');
      if (digits.length < 10) { phoneInput.classList.add('is-invalid'); valid = false; }
      if (!product) { productSelect.classList.add('is-invalid'); valid = false; }

      errorEl.hidden = valid;
      if (!valid) return;

      var message =
        'Здравствуйте! Заявка с сайта Aqua Rezerv.\n' +
        'Имя: ' + name + '\n' +
        'Телефон: ' + phone + '\n' +
        'Что нужно: ' + product;

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- Лайтбокс сертификатов ---------- */
  var certButtons = Array.prototype.slice.call(document.querySelectorAll('.cert'));
  var lightbox = document.getElementById('lightbox');
  if (lightbox && certButtons.length) {
    var lbImg = document.getElementById('lightboxImg');
    var lbClose = document.getElementById('lightboxClose');
    var lbPrev = document.getElementById('lightboxPrev');
    var lbNext = document.getElementById('lightboxNext');

    var certData = certButtons.map(function (btn) {
      var img = btn.querySelector('img');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
    });
    var current = 0;

    function showCert(i) {
      current = (i + certData.length) % certData.length;
      lbImg.setAttribute('src', certData[current].src);
      lbImg.setAttribute('alt', certData[current].alt);
    }
    function openLightbox(i) {
      showCert(i);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    certButtons.forEach(function (btn, i) {
      btn.addEventListener('click', function () { openLightbox(i); });
    });
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { showCert(current - 1); });
    lbNext.addEventListener('click', function () { showCert(current + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showCert(current - 1);
      else if (e.key === 'ArrowRight') showCert(current + 1);
    });
  }
})();
