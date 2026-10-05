(function () {
  'use strict';
  var d = document, root = d.documentElement;

  /* Mobile menu + solid navbar */
  var nav = d.getElementById('nav'), burger = d.getElementById('burger'), menu = d.getElementById('menu');
  function closeMenu() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'فتح القائمة'); }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Reveal on scroll (page is fully visible without JS) */
  var items = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    root.classList.add('js');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });

    /* Hide the sticky mobile CTA while a CTA section is already on screen */
    var sticky = d.getElementById('sticky'), visible = {};
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var any = Object.keys(visible).some(function (k) { return visible[k]; });
      sticky.classList.toggle('hide', any);
    }, { threshold: 0.35 });
    ['join', 'contact', 'home'].forEach(function (id) { var el = d.getElementById(id); if (el) so.observe(el); });
  }

  /* Lightbox */
  var tiles = Array.prototype.slice.call(d.querySelectorAll('.tile'));
  var lb = d.getElementById('lb'), lbImg = d.getElementById('lb-img'), idx = 0, lastFocus = null;
  function show(i) {
    idx = (i + tiles.length) % tiles.length;
    lbImg.src = tiles[idx].getAttribute('data-full');
    lbImg.alt = tiles[idx].getAttribute('data-alt') || '';
  }
  function openLb(i) {
    lastFocus = d.activeElement; show(i); lb.hidden = false; d.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function closeLb() { lb.hidden = true; lbImg.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; d.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  tiles.forEach(function (t, i) { t.addEventListener('click', function () { openLb(i); }); });
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!lb.hidden) closeLb(); else closeMenu(); return; }
    if (lb.hidden) return;
    if (e.key === 'ArrowLeft') show(idx + 1);   /* RTL: left = next */
    if (e.key === 'ArrowRight') show(idx - 1);
  });
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1);
  }, { passive: true });
})();
