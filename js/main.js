/* ================================================================
   MAIN JS — Akhila Reddy Katipelli Portfolio
   ================================================================ */

/* ── Theme: apply saved preference immediately (before paint) ── */
(function () {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  navbar();
  scrollReveal();
  activeNav();
  counters();
  progressBars();
  tiltCards();
});

/* ── Navbar scroll + mobile toggle ── */
function navbar() {
  const nav  = document.getElementById('navbar');
  const ham  = document.getElementById('hamburger');
  const mob  = document.getElementById('mobileNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });

  if (ham && mob) {
    ham.addEventListener('click', () => {
      const open = mob.classList.toggle('open');
      ham.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mob.classList.remove('open');
        ham.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ── Highlight current page link ── */
function activeNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

/* ── Intersection-based reveal ── */
function scrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
        /* animate divider inside revealed block */
        e.target.querySelectorAll('.divider').forEach(d => d.classList.add('animate'));
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
  els.forEach(el => io.observe(el));
}

/* ── Animated numeric counters ── */
function counters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseFloat(el.dataset.count);
      const sfx = el.dataset.suffix || '';
      const pfx = el.dataset.prefix || '';
      const dec = parseInt(el.dataset.decimals || 0);
      const dur = 1400;
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const v = (1 - Math.pow(1 - p, 3)) * end;
        el.textContent = pfx + v.toFixed(dec) + sfx;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ── Progress bar fill on scroll ── */
function progressBars() {
  const bars = document.querySelectorAll('.prog-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = (e.target.dataset.width || 0) + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => io.observe(b));
}

/* ── Subtle 3-D tilt on hover ── */
function tiltCards() {
  document.querySelectorAll('[data-tilt]').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      c.style.transition = 'transform .08s linear';
      c.style.transform  = `perspective(700px) rotateX(${y*-8}deg) rotateY(${x*8}deg) translateZ(6px)`;
    });
    c.addEventListener('mouseleave', () => {
      c.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
      c.style.transform  = '';
    });
  });
}

/* ── Dark / Light theme toggle ── */
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const root = document.documentElement;

  /* Ensure attribute is set from storage (belt-and-suspenders for DOMContentLoaded) */
  if (!root.hasAttribute('data-theme')) {
    root.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
  }

  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

    /* Add transition class, swap theme, remove class after animation */
    document.body.classList.add('theme-switching');
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTimeout(() => document.body.classList.remove('theme-switching'), 320);
  });
}

/* ── Typed-text effect ── */
function typed(elId, strings, speed = 75, pause = 2200) {
  const el = document.getElementById(elId);
  if (!el) return;
  let si = 0, ci = 0, del = false;
  function tick() {
    const s = strings[si];
    el.textContent = del ? s.slice(0, --ci) : s.slice(0, ++ci);
    let d = del ? speed * .55 : speed;
    if (!del && ci === s.length)      { d = pause; del = true; }
    else if (del && ci === 0)         { del = false; si = (si+1) % strings.length; d = 380; }
    setTimeout(tick, d);
  }
  setTimeout(tick, 700);
}
window.typed = typed;
