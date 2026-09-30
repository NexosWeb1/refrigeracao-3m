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

  /* Header com borda após rolar */
  var header = document.querySelector('.header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Revelação suave das seções */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

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
