/* ============================================
   Landing Page — JavaScript Mínimo
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     Abrir chat do Tawk.to
     ------------------------------------------ */
  window.openChat = function () {
    if (typeof Tawk_API !== 'undefined' && Tawk_API.maximize) {
      Tawk_API.maximize();
    } else {
      // Fallback: caso Tawk.to não esteja carregado ainda
      console.log('[Chat] Tawk.to não carregado. Configure o widget.');
    }
  };

  /* ------------------------------------------
     Header scroll — adiciona sombra
     ------------------------------------------ */
  var header = document.getElementById('header');
  var lastScrollY = 0;

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------
     Smooth scroll para links de âncora
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ------------------------------------------
     Fade-in on scroll (Intersection Observer)
     ------------------------------------------ */
  if ('IntersectionObserver' in window) {
    var fadeElements = document.querySelectorAll('.fade-in');
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback para navegadores antigos: mostra tudo
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ------------------------------------------
     Número animado (counter)
     ------------------------------------------ */
  function animateCounter(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('pt-BR');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    }

    requestAnimationFrame(step);
  }

  // Observar elementos com data-counter
  if ('IntersectionObserver' in window) {
    var counters = document.querySelectorAll('[data-counter]');
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = parseInt(entry.target.getAttribute('data-counter'), 10);
          var duration = parseInt(entry.target.getAttribute('data-duration') || '1500', 10);
          animateCounter(entry.target, target, duration);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

})();
