(() => {
  const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/WTPHQYP66Z';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.getElementById('header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
  }));

  document.querySelectorAll('[data-pick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const radio = document.querySelector('input[name="service"][value="' + btn.dataset.pick + '"]');
      if (radio) radio.checked = true;
    });
  });

  const form = document.getElementById('leadForm');
  const note = document.getElementById('formNote');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;

    const fd = new FormData(form);
    const payload = {};
    fd.forEach((v, k) => { payload[k] = v; });

    if (payload._gotcha) return;

    if (!payload.name || !payload.contact) {
      note.textContent = 'Заполните имя и Telegram или телефон.';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Отправляем...';
    note.textContent = '';

    try {
      const resp = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      note.textContent = 'Спасибо! Заявка отправлена. Я свяжусь с вами в течение дня.';
      form.reset();
    } catch (err) {
      console.error(err);
      note.textContent = 'Не удалось отправить. Попробуйте ещё раз или напишите в Telegram: @nadeezhda1010';
    } finally {
      btn.disabled = false;
      btn.textContent = orig;
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const targets = document.querySelectorAll(
    '.recog__item, .work__card, .how__step, .fmt, .pkg, .p-step, .faq__item, .form-card, .edu__list li'
  );
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  targets.forEach(el => io.observe(el));
})();
