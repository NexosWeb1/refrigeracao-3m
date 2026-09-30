(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5531990612268';
  var OPEN_HOUR = 7;
  var CLOSE_HOUR = 20;


  /* Links de WhatsApp com mensagem pré-preenchida por contexto */
  document.querySelectorAll('.js-wa').forEach(function (link) {
    var msg = link.getAttribute('data-msg') || 'Olá! Gostaria de solicitar um orçamento.';
    link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
  });

  /* Eventos de conversão (Google Ads / GTM via dataLayer) */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var type = el.getAttribute('data-track');
    window.dataLayer.push({
      event: type === 'whatsapp' ? 'clique_whatsapp' : 'clique_telefone',
      link_text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80)
    });
  });

  /* Logo volta ao topo sem deixar #topo na URL */
  document.querySelectorAll('a[href="#topo"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', location.pathname + location.search);
    });
  });

  /* Menu mobile */
  var body = document.body;
  var toggle = document.querySelector('.menu-toggle');
  var setMenu = function (open) {
    body.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!body.classList.contains('is-menu-open'));
    });
    document.querySelectorAll('.mobile-menu a, .menu-backdrop').forEach(function (el) {
      el.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('is-menu-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* Carrosséis: indicadores e setas (serviços e avaliações) */
  document.querySelectorAll('[data-dots-for]').forEach(function (dots) {
    var sel = dots.getAttribute('data-dots-for');
    var track = document.querySelector(sel);
    if (!track) return;
    var prev = document.querySelector('[data-carousel-prev="' + sel + '"]');
    var next = document.querySelector('[data-carousel-next="' + sel + '"]');

    /* distância entre um card e o próximo */
    var step = function () {
      var s = track.children;
      return s.length > 1 ? s[1].offsetLeft - s[0].offsetLeft : track.clientWidth;
    };
    var pages = function () {
      return Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / step()) + 1);
    };
    var current = function () {
      return Math.round(track.scrollLeft / step());
    };
    var goTo = function (i) {
      track.scrollTo({ left: i * step(), behavior: 'smooth' });
    };

    var build = function () {
      dots.innerHTML = '';
      for (var i = 0; i < pages(); i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.tabIndex = -1;
        dot.addEventListener('click', goTo.bind(null, i));
        dots.appendChild(dot);
      }
      update();
    };
    var update = function () {
      var idx = current();
      var total = pages();
      Array.prototype.forEach.call(dots.children, function (d, i) {
        d.classList.toggle('is-active', i === idx);
      });
      if (prev) prev.disabled = idx <= 0;
      if (next) next.disabled = idx >= total - 1;
    };

    if (prev) prev.addEventListener('click', function () { goTo(current() - 1); });
    if (next) next.addEventListener('click', function () { goTo(current() + 1); });
    track.addEventListener('scroll', update, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    });
    build();
  });

  /* Header com borda após rolar */
  var header = document.querySelector('.header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Status de atendimento (horário de Brasília) */
  var status = document.querySelector('[data-status]');
  if (status) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hour12: false
      }).formatToParts(new Date());
      var weekday = parts.find(function (p) { return p.type === 'weekday'; }).value;
      var hour = parseInt(parts.find(function (p) { return p.type === 'hour'; }).value, 10) % 24;
      var open = weekday !== 'Sun' && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
      status.textContent = open ? 'Atendendo agora' : 'Fechado agora · seg a sáb, 07h às 20h';
      status.classList.add(open ? 'is-open' : 'is-closed');
    } catch (err) { /* mantém o texto padrão */ }
  }

  /* Ano no rodapé */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
