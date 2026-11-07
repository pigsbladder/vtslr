/* Shared site behaviour. Each init function does nothing on pages without its markup. */
(function () {
  const EASE = 'cubic-bezier(.2,.7,.2,1)';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;
    const setOpen = open => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  function initEntranceAnimations() {
    if (reducedMotion) return;
    document.querySelectorAll('[data-intro]').forEach((el, i) => {
      el.animate(
        [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }],
        { duration: 1000, delay: 150 + i * 120, easing: EASE, fill: 'backwards' }
      );
    });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '';
      entry.target.animate(
        [{ opacity: 0, transform: 'translateY(32px)' }, { opacity: 1, transform: 'none' }],
        { duration: 900, easing: EASE }
      );
      observer.unobserve(entry.target);
    }), { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.style.opacity = '0';
        observer.observe(el);
      }
    });
  }

  // Home page: the four problems rotate every 7s, pausing on hover or keyboard focus.
  function initProblemRotator() {
    const root = document.querySelector('[data-problems]');
    if (!root) return;
    const DURATION = 7000;
    const tabs = [...root.querySelectorAll('.problem-tab')];
    const panels = [...root.querySelectorAll('.problem-panel')];
    const panelStack = root.querySelector('.problem-card__panels');
    const bar = root.querySelector('.problem-card__bar');
    const numbers = root.querySelectorAll('[data-problem-number]');
    let active = 0, start = performance.now(), paused = false, pausedAt = 0;

    const select = i => {
      active = i;
      start = performance.now();
      tabs.forEach((tab, t) => {
        tab.classList.toggle('is-active', t === i);
        tab.setAttribute('aria-pressed', String(t === i));
      });
      panels.forEach((panel, p) => panel.classList.toggle('is-active', p === i));
      numbers.forEach(n => { n.textContent = '0' + (i + 1); });
      if (!reducedMotion) {
        panelStack.animate(
          [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
          { duration: 550, easing: EASE }
        );
      }
    };
    tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));

    if (reducedMotion) return; // Leave it manual: no auto-advance.

    const pause = () => { if (!paused) { paused = true; pausedAt = performance.now(); } };
    const resume = () => { if (paused) { paused = false; start += performance.now() - pausedAt; } };
    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', resume);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', resume);

    const tick = now => {
      requestAnimationFrame(tick);
      if (paused) return;
      const progress = (now - start) / DURATION;
      if (progress >= 1) { select((active + 1) % tabs.length); return; }
      bar.style.transform = `scaleX(${Math.max(0, progress)})`;
    };
    requestAnimationFrame(tick);
  }

  // Home page: closing section's logo stripes rise in, then drift slowly and shift on scroll.
  function initCtaStripes() {
    const stripes = [...document.querySelectorAll('.cta-stripes__stripe')];
    if (!stripes.length || reducedMotion) return;
    const section = stripes[0].closest('section');
    const PERIOD = [62, 48, 71, 55, 84], PHASE = [0, 1.9, 3.7, 5.1, 2.6], LAYER = [3, 1, 4, 2, 5];

    const riseObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      stripes.forEach((stripe, i) => {
        const bar = stripe.firstElementChild;
        const skew = getComputedStyle(bar).transform;
        bar.animate(
          [{ opacity: 0, transform: `${skew} translateY(45%)` }, { opacity: 1, transform: skew }],
          { duration: 1300, delay: i * 110, easing: EASE, fill: 'backwards' }
        );
      });
      riseObserver.disconnect();
    }), { threshold: 0.2 });
    riseObserver.observe(section);

    const offsetY = stripes.map(() => 0);
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const p = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      stripes.forEach((_, i) => { offsetY[i] = p * (30 + i * 28); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    stripes.forEach((stripe, i) => {
      stripe.style.zIndex = LAYER[i];
      stripe.firstElementChild.style.boxShadow = '-14px 0 36px rgba(0,0,0,0.55)';
    });
    const drift = t => {
      requestAnimationFrame(drift);
      const amplitude = Math.min(220, window.innerWidth * 0.12);
      stripes.forEach((stripe, i) => {
        const x = Math.sin((t / 1000) * (Math.PI * 2 / PERIOD[i]) + PHASE[i]) * amplitude;
        stripe.style.transform = `translate(${x.toFixed(1)}px,${offsetY[i].toFixed(1)}px)`;
      });
    };
    requestAnimationFrame(drift);
  }

  // Contact page (preview only): no backend on GitHub Pages, so the form composes an email instead.
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form));
      const body = [
        `Name: ${d.first} ${d.last}`,
        d.company ? `Company: ${d.company}` : '',
        `Email: ${d.email}`,
        d.phone ? `Phone: ${d.phone}` : '',
        '',
        d.message || ''
      ].filter((line, i) => line || i > 3).join('\n');
      window.location.href = `mailto:info@vtslr.com?subject=${encodeURIComponent('Website inquiry')}&body=${encodeURIComponent(body)}`;
    });
  }

  initMobileNav();
  initContactForm();
  initEntranceAnimations();
  initProblemRotator();
  initCtaStripes();
})();
