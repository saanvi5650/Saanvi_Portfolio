'use strict';

/* ════════════════════════════════════════════
   EDIT THESE BEFORE DEPLOYING
   ════════════════════════════════════════════ */
const CONFIG = {
  email: 'hello@example.com',                 // used by the postcard form + email button
  linkedin: 'https://www.linkedin.com/',      // paste your full profile URL
  github: 'https://github.com/',              // paste your full profile URL
  resume: '',                                 // e.g. 'assets/Saanvi_Singh_Resume.pdf' — leave '' to hide resume buttons
  timezone: 'Asia/Kolkata',                   // shown in the little "local time" chip
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine   = matchMedia('(pointer:fine)').matches;
const rand   = (a, b) => a + Math.random() * (b - a);

/* ── config → links ─────────────────────────── */
$$('[data-link]').forEach(a => {
  const k = a.dataset.link;
  if (k === 'email') a.href = 'mailto:' + CONFIG.email;
  else if (CONFIG[k]) a.href = CONFIG[k];
});
$$('[data-resume]').forEach(a => {
  if (CONFIG.resume) { a.href = CONFIG.resume; a.hidden = false; }
});

/* ── toast ──────────────────────────────────── */
const toastEl = $('.toast');
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

/* ── mobile nav ─────────────────────────────── */
const menuBtn = $('.menu-btn');
const nav = $('.nav');
function closeNav() { nav.classList.remove('open'); menuBtn?.setAttribute('aria-expanded', 'false'); }
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
$$('a', nav).forEach(a => a.addEventListener('click', closeNav));

/* ── hero intro: split the name into letters ── */
const h1 = $('#hero-title');
if (h1) {
  const text = h1.textContent.trim();
  h1.setAttribute('aria-label', text);
  h1.textContent = '';
  let i = 0;
  text.split(' ').forEach((w, wi, arr) => {
    const word = document.createElement('span');
    word.className = 'word';
    word.setAttribute('aria-hidden', 'true');
    [...w].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      s.style.setProperty('--i', i++);
      s.style.setProperty('--r', rand(-9, 9).toFixed(1) + 'deg');
      word.appendChild(s);
    });
    h1.appendChild(word);
    if (wi < arr.length - 1) h1.appendChild(document.createTextNode(' '));
  });
}
let started = false;
function startIntro() {
  if (started) return;
  started = true;
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
    setTimeout(() => h1?.classList.add('settled'), 2400);
  });
}
(document.fonts?.ready || Promise.resolve()).then(startIntro);
setTimeout(startIntro, 1200);

/* ── greeting by visitor's local time ───────── */
(function greet() {
  const el = $('#hello');
  if (!el) return;
  const h = new Date().getHours();
  const g = h >= 5 && h < 12 ? 'good morning' : h < 17 && h >= 12 ? 'good afternoon' : h >= 17 && h < 22 ? 'good evening' : '';
  el.textContent = (g ? g + ' ♡ ' : '') + 'welcome to';
})();

/* ── typewriter roles ───────────────────────── */
(function typewriter() {
  const el = $('#typed');
  if (!el || reduce) return;
  const roles = [
    'computer science student',
    'builder of useful things',
    'community organiser',
    'foody',
    'occasional stage speaker',
    'product-curious engineer',
  ];
  let r = 0, c = 0, deleting = false;
  function step() {
    const word = roles[r];
    c += deleting ? -1 : 1;
    el.textContent = word.slice(0, c);
    let delay = deleting ? 32 : 72;
    if (!deleting && c === word.length) { deleting = true; delay = 1700; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 380; }
    setTimeout(step, delay);
  }
  setTimeout(step, 2600);   // start after the intro finishes
})();

/* ── local time chip ────────────────────────── */
(function clock() {
  const el = $('#clock');
  if (!el) return;
  let fmt;
  try { fmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: CONFIG.timezone }); }
  catch { return; }
  const tick = () => { el.textContent = fmt.format(new Date()).toLowerCase(); };
  tick();
  setInterval(tick, 20000);
})();

/* ── scroll: progress bar, timeline thread, scroll-spy ── */
const bar = $('.progress i');
const tl = $('.timeline');
const tlCards = $$('.timeline-card');
let ticking = false;
function onScroll() {
  ticking = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  if (tl) {
    const r = tl.getBoundingClientRect();
    const mark = innerHeight * 0.6;
    tl.style.setProperty('--progress', Math.min(1, Math.max(0, (mark - r.top) / r.height)).toFixed(3));
    tlCards.forEach(c => {
      const d = $('.dot', c).getBoundingClientRect();
      c.classList.toggle('reached', d.top < mark);
    });
  }
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

const navLinks = $$('a', nav);
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* ── reveal on scroll (with light staggering) ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.12 });
const groups = new Map();
$$('.reveal').forEach(el => {
  const p = el.parentElement;
  const n = groups.get(p) || 0;
  groups.set(p, n + 1);
  el.style.setProperty('--rd', Math.min(n, 4) * 90 + 'ms');
  revealObs.observe(el);
});

/* ── receipt counters ───────────────────────── */
(function counters() {
  const receipt = $('#receipt');
  if (!receipt) return;
  const nums = $$('[data-count]', receipt);
  const run = () => nums.forEach(el => {
    const target = +el.dataset.count;
    if (reduce) { el.textContent = target; return; }
    const t0 = performance.now(), dur = 1300;
    (function frame(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  });
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.6 });
  io.observe(receipt);
})();

/* ── cursor glow, sparkle trail, confetti ───── */
const glow = $('.cursor-glow');
addEventListener('pointermove', e => {
  if (!glow) return;
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

const glyphs = ['✦', '♡', '✧', '·'];
const tints = ['#bba0d7', '#e2a6c3', '#9f7eb0'];
function spawn(x, y, burst, i = 0, n = 1) {
  const s = document.createElement('span');
  s.className = 'spark' + (burst ? ' burst' : '');
  s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
  s.style.left = x + 'px';
  s.style.top = y + 'px';
  s.style.color = tints[Math.floor(Math.random() * tints.length)];
  s.style.setProperty('--s', rand(burst ? 14 : 9, burst ? 26 : 17).toFixed(0) + 'px');
  if (burst) {
    const a = (i / n) * Math.PI * 2 + rand(-.2, .2), d = rand(50, 130);
    s.style.setProperty('--bx', Math.cos(a) * d + 'px');
    s.style.setProperty('--by', Math.sin(a) * d + 'px');
  } else {
    s.style.setProperty('--dx', rand(-16, 16).toFixed(0) + 'px');
  }
  document.body.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
}
function burst(x, y, n = 18) { if (!reduce) for (let i = 0; i < n; i++) spawn(x, y, true, i, n); }

if (fine && !reduce) {
  let last = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const now = performance.now();
    if (now - last < 80) return;
    last = now;
    spawn(e.clientX, e.clientY, false);
  });
}
$('#confetti-note')?.addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 22);
});

/* ── hero parallax ──────────────────────────── */
const collage = $('#collage');
if (collage && fine && !reduce) {
  collage.addEventListener('pointermove', e => {
    const r = collage.getBoundingClientRect();
    collage.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
    collage.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
  });
  collage.addEventListener('pointerleave', () => {
    collage.style.setProperty('--mx', 0);
    collage.style.setProperty('--my', 0);
  });
}

/* ── draggable scrapbook pieces ─────────────── */
let zTop = 20;
function baseRot(el) { return parseFloat(getComputedStyle(el).getPropertyValue('--rot')) || 0; }
function makeDraggable(el) {
  let sx, sy, ox, oy, lastX, active = false, base = 0;
  el.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    active = true;
    sx = e.clientX; sy = e.clientY; lastX = sx;
    ox = parseFloat(el.style.getPropertyValue('--tx')) || 0;
    oy = parseFloat(el.style.getPropertyValue('--ty')) || 0;
    base = baseRot(el);
    el.classList.add('dragging');
    el.style.zIndex = ++zTop;
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  el.addEventListener('pointermove', e => {
    if (!active) return;
    el.style.setProperty('--tx', (ox + e.clientX - sx) + 'px');
    el.style.setProperty('--ty', (oy + e.clientY - sy) + 'px');
    const swing = Math.max(-9, Math.min(9, (e.clientX - lastX) * 0.6));
    el.style.setProperty('--rot', (base + swing).toFixed(2) + 'deg');
    lastX = e.clientX;
  });
  const end = () => {
    if (!active) return;
    active = false;
    el.classList.remove('dragging');
    el.style.setProperty('--rot', base + 'deg');
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  // touch devices can't drag (it would fight scrolling) — tap to wiggle instead
  el.addEventListener('click', () => {
    if (fine) return;
    el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle');
    setTimeout(() => el.classList.remove('wiggle'), 650);
  });
}
$$('.drag').forEach(makeDraggable);

const shuffleBtn = $('#shuffle');
let shuffled = false;
shuffleBtn?.addEventListener('click', () => {
  shuffled = !shuffled;
  $$('.wall-photo').forEach(p => {
    if (shuffled) {
      p.style.setProperty('--tx', rand(-38, 38).toFixed(0) + 'px');
      p.style.setProperty('--ty', rand(-26, 26).toFixed(0) + 'px');
      p.style.setProperty('--rot', rand(-7, 7).toFixed(1) + 'deg');
      p.style.zIndex = ++zTop;
    } else {
      ['--tx', '--ty', '--rot'].forEach(v => p.style.removeProperty(v));
      p.style.zIndex = '';
    }
  });
  shuffleBtn.textContent = shuffled ? 'tidy up ✦' : 'shuffle the pile ↻';
});

/* ── toolkit tabs ───────────────────────────── */
(function skills() {
  const tabs = $$('.skill-tab');
  const stickers = $$('.sticker');
  if (!tabs.length) return;
  function show(cat, animate = true) {
    tabs.forEach(t => {
      const on = t.dataset.tab === cat;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    let i = 0;
    stickers.forEach(s => {
      const match = cat === 'all' || s.dataset.cat.split(' ').includes(cat);
      s.hidden = !match;
      s.classList.remove('pop');
      if (match && animate && !reduce) {
        s.style.setProperty('--i', i++);
        void s.offsetWidth;
        s.classList.add('pop');
      }
    });
  }
  tabs.forEach((t, idx) => {
    t.addEventListener('click', () => show(t.dataset.tab));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(idx + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus(); show(next.dataset.tab);
    });
  });
})();

/* ── project cards: tilt + glare ────────────── */
if (fine && !reduce) {
  $$('.project-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((.5 - y) * 7).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
}

/* ── project modal ──────────────────────────── */
/* Fill in `github` / `live` for any project you've pushed or deployed —
   leave '' to hide that button. Same data drives the small links on
   each card and the ones inside the scrapbook note. */
const projectData = {
  library: {
    kicker: 'full stack · analytics',
    title: 'Library Management + Analytics',
    copy: 'A project I like because it stopped being “just CRUD” once I started thinking about the workflow around it.',
    bullets: ['Issue / return / extension flows', 'JWT authentication and scheduled notifications', 'Usage analytics and department-level patterns', 'Recommendation ideas based on tags and co-occurrence'],
    github: '', live: '',
  },
  sheshield: {
    kicker: 'safety · backend',
    title: 'SheShield',
    copy: 'Built around a simple question: what should happen after someone presses an SOS button?',
    bullets: ['Real-time GPS tracking', 'Priority-based escalation', 'Risk-zone visualisation', 'Offline SMS fallback for connectivity gaps'],
    github: '', live: '',
  },
  signbridge: {
    kicker: 'computer vision · ML',
    title: 'SignBridge',
    copy: 'A semester project that turned into a lesson in how much work sits between “the model works” and “the experience works.”',
    bullets: ['Custom gesture data collection', 'TensorFlow-based classifier', 'FastAPI backend + browser frontend', 'Real-time text output and interface iteration'],
    github: '', live: '',
  },
  health: {
    kicker: 'ML · healthcare',
    title: 'Wearable Health Monitoring',
    copy: 'A small real-time ML system for sensor streams, anomaly detection and alerts.',
    bullets: ['Sub-second data pipeline', 'Anomaly detection on wearable-style signals', 'API-driven alerting', 'Focus on practical monitoring rather than only model accuracy'],
    github: '', live: '',
  },
};

/* small GitHub / live-demo links under each card (hidden if both are blank) */
$$('.card-links').forEach(el => {
  const d = projectData[el.dataset.links];
  if (!d) return;
  const bits = [];
  if (d.github) bits.push(`<a href="${d.github}" target="_blank" rel="noreferrer">code ↗</a>`);
  if (d.live) bits.push(`<a href="${d.live}" target="_blank" rel="noreferrer">live ↗</a>`);
  el.innerHTML = bits.join('');
  el.hidden = !bits.length;
});
const order = Object.keys(projectData);
const modal = $('#project-modal');
const paper = $('.modal-paper', modal);
let current = null, lastFocus = null;

function render(key, swap) {
  const d = projectData[key];
  current = key;
  $('#modal-kicker').textContent = d.kicker;
  $('#modal-title').textContent = d.title;
  $('#modal-copy').textContent = d.copy;
  const ul = document.createElement('ul');
  d.bullets.forEach(b => { const li = document.createElement('li'); li.textContent = b; ul.appendChild(li); });
  $('#modal-bullets').replaceChildren(ul);
  const links = $('#modal-links');
  const bits = [];
  if (d.github) bits.push(`<a href="${d.github}" target="_blank" rel="noreferrer">view code ↗</a>`);
  if (d.live) bits.push(`<a href="${d.live}" target="_blank" rel="noreferrer">live demo ↗</a>`);
  links.innerHTML = bits.join('');
  links.hidden = !bits.length;
  if (swap && !reduce) { paper.classList.remove('swap'); void paper.offsetWidth; paper.classList.add('swap'); }
}
function openModal(key, trigger) {
  lastFocus = trigger || document.activeElement;
  render(key, false);
  paper.classList.remove('swap');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('.modal-close', modal).focus();
}
function closeModal() {
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocus?.focus?.();
}
$$('[data-modal]').forEach(btn => btn.addEventListener('click', () => {
  if (projectData[btn.dataset.modal]) openModal(btn.dataset.modal, btn);
}));
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
$$('[data-nav]', modal).forEach(b => b.addEventListener('click', () => {
  const i = (order.indexOf(current) + +b.dataset.nav + order.length) % order.length;
  render(order[i], true);
}));
addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeNav(); }
  if (!modal.classList.contains('open')) return;
  if (e.key === 'ArrowRight') $('[data-nav="1"]', modal).click();
  if (e.key === 'ArrowLeft') $('[data-nav="-1"]', modal).click();
  if (e.key === 'Tab') {                       // keep focus inside the note
    const f = $$('button', modal);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ── beyond-work flip cards (tap on touch) ──── */
if (matchMedia('(hover:none)').matches) {
  $$('.flip').forEach(b => b.addEventListener('click', () => b.classList.toggle('flipped')));
}

/* ── postcard form → opens the visitor's email app ── */
const form = $('#postcard');
const err = $('#pc-error');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const fMsg = $('#pc-msg'), fName = $('#pc-name'), fEmail = $('#pc-email');
  const msg = fMsg.value.trim();
  const name = fName.value.trim();
  const from = fEmail.value.trim();
  err.textContent = '';
  if (!msg) { err.textContent = 'Write a short message first so there’s something to send.'; fMsg.focus(); return; }
  if (!name) { err.textContent = 'Add your name so I know who to reply to.'; fName.focus(); return; }
  if (from && !fEmail.checkValidity()) { err.textContent = 'That email address doesn’t look right — check it, or leave it blank.'; fEmail.focus(); return; }

  const subject = `Hello from your portfolio — ${name}`;
  const body = `${msg}\n\n— ${name}${from ? ' (' + from + ')' : ''}`;
  const href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const r = form.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 16);
  form.classList.add('sending');
  setTimeout(() => {
    location.href = href;
    toast('Your email app should be open — press send there to deliver the postcard ✦');
    form.reset();
    setTimeout(() => form.classList.remove('sending'), 600);
  }, reduce ? 0 : 750);
});

$('#copy-email')?.addEventListener('click', async e => {
  try {
    await navigator.clipboard.writeText(CONFIG.email);
    toast('Email copied ♡');
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 10);
  } catch {
    toast('Couldn’t copy automatically — my email is ' + CONFIG.email);
  }
});

/* ── small delights ─────────────────────────── */
const baseTitle = document.title;
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? 'come back soon ♡ — Saanvi' : baseTitle;
});
const yr = $('#year');
if (yr) yr.textContent = '· ' + new Date().getFullYear();
