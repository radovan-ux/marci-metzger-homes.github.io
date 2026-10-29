(function () {
  'use strict';

  /* ------------------------------------------------------------
     Set a form-service URL (Formspree, Netlify Forms proxy, etc.)
     to deliver contact messages. While empty, the form validates
     and confirms on screen but does not send anything.
     ------------------------------------------------------------ */
  var CONTACT_ENDPOINT = '';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: solid after scrolling ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- Listing search ---------- */
  var searchForm = document.getElementById('search-form');
  var searchNote = document.getElementById('search-note');
  var minInput = document.getElementById('min-price');
  var maxInput = document.getElementById('max-price');

  function setNote(el, html, isError) {
    el.innerHTML = html;
    el.classList.toggle('is-error', !!isError);
  }

  function checkPriceRange() {
    var min = parseFloat(minInput.value);
    var max = parseFloat(maxInput.value);
    if (!isNaN(min) && !isNaN(max) && min > max) {
      maxInput.setCustomValidity('Max price must be higher than min price.');
    } else {
      maxInput.setCustomValidity('');
    }
  }
  minInput.addEventListener('input', checkPriceRange);
  maxInput.addEventListener('input', checkPriceRange);

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    checkPriceRange();
    if (!searchForm.checkValidity()) {
      searchForm.reportValidity();
      setNote(searchNote, 'Check the price range and try again.', true);
      return;
    }
    // No listing API is connected, so say so plainly and point to the live listings page.
    setNote(
      searchNote,
      'Demo search: this page is not connected to live listings. <a href="https://marcimetzger.com/listings" target="_blank" rel="noopener">Browse current listings on marcimetzger.com</a>.',
      false
    );
  });

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById('contact-form');
  var contactNote = document.getElementById('contact-note');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      setNote(contactNote, 'Enter a valid email address so Marci can reply.', true);
      return;
    }

    var name = contactForm.elements.name.value.trim();
    var greeting = name ? 'Thanks, ' + name.replace(/</g, '&lt;') + '.' : 'Thanks.';

    if (!CONTACT_ENDPOINT) {
      setNote(contactNote, greeting + ' This demo form is not connected to email yet, so nothing was sent. Please call (206) 919-6886.', false);
      contactForm.reset();
      return;
    }

    setNote(contactNote, 'Sending…', false);
    fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm)
    }).then(function (res) {
      if (!res.ok) throw new Error('Request failed');
      setNote(contactNote, greeting + ' Your message was sent. Marci will reply to your email.', false);
      contactForm.reset();
    }).catch(function () {
      setNote(contactNote, 'The message did not send. Call (206) 919-6886 or try again.', true);
    });
  });

  /* ---------- Office hours: open / closed in Pahrump time ---------- */
  var statusEl = document.getElementById('hours-status');
  var statusText = document.getElementById('hours-text');

  function updateHours() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles', hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date());
      var h = Number(parts.find(function (p) { return p.type === 'hour'; }).value) % 24;
      var m = Number(parts.find(function (p) { return p.type === 'minute'; }).value);
      var t = h + m / 60;
      var open = t >= 8 && t < 19;
      statusEl.classList.toggle('is-open', open);
      statusText.textContent = open ? 'Open now, until 7:00 pm' : 'Closed now, opens 8:00 am';
    } catch (err) {
      statusText.textContent = 'Open daily';
    }
  }
  updateHours();
  setInterval(updateHours, 60000);

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
