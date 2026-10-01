(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) {
    document.documentElement.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);

  var mm = gsap.matchMedia();

  /* ==========================================================
     Movimento permitido
     ========================================================== */
  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* ---------- Hero: entrada ---------- */
    var isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

    tl.from('.header', { yPercent: -100, duration: 0.7 }, 0)
      .fromTo('.hero__panel',
        { clipPath: 'inset(5% 3% 5% 3% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.2, ease: 'expo.out', clearProps: 'clipPath' }, 0)
      .fromTo('.hero__tags li', { y: 14 }, { opacity: 1, y: 0, stagger: 0.08 }, 0.3)
      .fromTo('.hero__photo--left',
        isDesktop ? { x: -90 } : { y: 40, scale: 0.96 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.3, ease: 'expo.out' }, 0.45)
      .fromTo('.hero__photo--right',
        { x: 90 },
        { opacity: 1, x: 0, duration: 1.3, ease: 'expo.out' }, 0.55)
      .fromTo('.hero__subtitle', { y: 18 }, { opacity: 1, y: 0 }, 0.85)
      .fromTo('.hero__ctas .btn', { y: 18, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, stagger: 0.1, ease: 'back.out(1.7)' }, 1)
      .fromTo('.hero__support', { y: 10 }, { opacity: 1, y: 0 }, 1.15)
      .fromTo('.benefits__item', { y: 24 }, { opacity: 1, y: 0, stagger: 0.08 }, 1.15);

    SplitText.create('.hero__title', {
      type: 'lines, words',
      mask: 'lines',
      autoSplit: true,
      onSplit: function (self) {
        gsap.set('.hero__title', { visibility: 'visible' });
        return gsap.from(self.words, {
          yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.045, delay: 0.4
        });
      }
    });

    /* Parallax leve nas fotos do hero (desktop) */
    if (isDesktop) gsap.utils.toArray('.hero__photo img').forEach(function (img, i) {
      gsap.fromTo(img, { yPercent: -4, scale: 1.12 }, {
        yPercent: i ? 8 : 5, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });

    /* ---------- Títulos das seções: palavras sobem ---------- */
    gsap.utils.toArray('.section-title').forEach(function (title) {
      SplitText.create(title, {
        type: 'lines, words',
        mask: 'lines',
        autoSplit: true,
        onSplit: function (self) {
          gsap.set(title, { visibility: 'visible' });
          return gsap.from(self.words, {
            yPercent: 110, duration: 0.9, ease: 'power4.out', stagger: 0.035,
            scrollTrigger: { trigger: title, start: 'top 88%', once: true }
          });
        }
      });
    });

    /* ---------- Blocos e cards entrando em grupo ---------- */
    ScrollTrigger.batch('.reveal', {
      start: 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(batch, { y: 48 }, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: 'auto'
        });
      }
    });

    /* Itens internos com stagger */
    var staggerIn = function (selector, trigger, vars) {
      if (!document.querySelector(selector)) return;
      gsap.from(selector, Object.assign({
        autoAlpha: 0, y: 16, duration: 0.6, ease: 'power2.out', stagger: 0.07,
        scrollTrigger: { trigger: trigger, start: 'top 85%', once: true }
      }, vars || {}));
    };
    staggerIn('.checklist li', '.checklist');
    staggerIn('.cities li', '.cities', { scale: 0.8, y: 10, ease: 'back.out(2)' });
    staggerIn('.hours__list li', '.hours');
    staggerIn('.faq__item', '.faq__list');
    gsap.utils.toArray('.segment').forEach(function (seg) {
      gsap.from(seg.querySelectorAll('.segment__list li'), {
        autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: seg, start: 'top 75%', once: true }
      });
    });

    /* Estrelas das avaliações acendendo */
    gsap.utils.toArray('.review').forEach(function (review) {
      gsap.from(review.querySelectorAll('.stars .icon'), {
        scale: 0, rotate: -90, duration: 0.5, stagger: 0.07, ease: 'back.out(2.5)',
        scrollTrigger: { trigger: review, start: 'top 85%', once: true }
      });
    });

    /* ---------- Imagens: revelação + parallax ---------- */
    gsap.utils.toArray('.steps__media, .cta__media, .segment__media').forEach(function (box) {
      gsap.fromTo(box,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath',
          scrollTrigger: { trigger: box, start: 'top 85%', once: true }
        });
    });

    gsap.utils.toArray('.about__shape img, .steps__media img, .cta__media img, .segment__media img, .service-card__media img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6, scale: 1.14 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* ---------- Como funciona: linha de progresso ---------- */
    gsap.to('.steps__progress span', {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.steps__wrap', start: 'top 70%', end: 'bottom 65%', scrub: 0.6 }
    });
    gsap.utils.toArray('.step').forEach(function (step) {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 68%',
        onEnter: function () { step.classList.add('is-active'); },
        onLeaveBack: function () { step.classList.remove('is-active'); }
      });
    });

    /* ---------- Floco girando no card de destaque ---------- */
    gsap.to('.service-card__snow', { rotate: 360, duration: 18, ease: 'none', repeat: -1 });

    /* ---------- Faixa: velocidade reage ao scroll ---------- */
    var track = document.querySelector('.marquee__track');
    if (track) {
      track.style.animation = 'none';
      var loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
      var speed = gsap.quickTo(loop, 'timeScale', { duration: 0.6, ease: 'power2.out' });
      ScrollTrigger.create({
        onUpdate: function (self) {
          var v = gsap.utils.clamp(-6, 6, self.getVelocity() / 250);
          speed(self.direction * Math.max(1, Math.abs(v)));
        }
      });
      track.parentElement.addEventListener('mouseenter', function () { speed(0.15); });
      track.parentElement.addEventListener('mouseleave', function () { speed(1); });
    }

    /* ---------- Header some ao descer e volta ao subir ---------- */
    var header = document.querySelector('.header');
    ScrollTrigger.create({
      start: 'top -200',
      onUpdate: function (self) {
        if (document.body.classList.contains('is-menu-open')) return;
        header.classList.toggle('is-hidden', self.direction === 1);
      },
      onLeaveBack: function () { header.classList.remove('is-hidden'); }
    });

    return function () {
      document.querySelector('.header').classList.remove('is-hidden');
    };
  });

  /* ==========================================================
     Micro-interação: inclinação dos cards (só mouse)
     ========================================================== */
  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', function () {
    var cards = gsap.utils.toArray('.service-card, .segment, .review');
    var handlers = [];

    cards.forEach(function (card) {
      var rx = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });
      var ry = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });
      gsap.set(card, { transformPerspective: 900 });

      var move = function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 6);
        rx(-py * 6);
      };
      var leave = function () { rx(0); ry(0); };

      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      handlers.push([card, move, leave]);
    });

    return function () {
      handlers.forEach(function (h) {
        h[0].removeEventListener('mousemove', h[1]);
        h[0].removeEventListener('mouseleave', h[2]);
      });
    };
  });

  /* Recalcula posições quando imagens e fontes terminam de carregar */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
