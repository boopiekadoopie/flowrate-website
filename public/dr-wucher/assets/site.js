/* Elite Biodental preview, shared practice-site behaviour. Flowrate, November 2026. */
(() => {
  const BASE = '/dr-wucher';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- booking data, shared with the Book page ---------- */
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const EB = window.EB = {
    types: [
      { id: 'gbt', name: 'Check-up and GBT clean', short: 'Check-up and clean', mins: 45 },
      { id: 'first', name: 'First visit', short: 'First visit', mins: 45 },
      { id: 'amalgam', name: 'Amalgam removal consultation', short: 'Amalgam removal', mins: 30 },
      { id: 'implant', name: 'Implant consultation', short: 'Implants', mins: 30 },
      { id: 'gum', name: 'Gum treatment', short: 'Gum treatment', mins: 60 },
      { id: 'fm', name: 'Functional medicine consultation', short: 'Functional medicine', mins: 60, only: 'mw' },
      { id: 'pain', name: 'Toothache or something broke', short: 'Toothache', mins: 30 }
    ],
    dentists: [
      { id: 'mw', name: 'Dr Martin Wucher', img: BASE + '/assets/img/dr-wucher-face.jpg' },
      { id: 'ra', name: 'Dr Roland Andreae', initials: 'RA' },
      { id: 'any', name: 'No preference' }
    ],
    times: ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30'],
    type(id) { return EB.types.find(t => t.id === id) || EB.types[0]; },
    dentist(id) { return EB.dentists.find(d => d.id === id) || EB.dentists[2]; },
    days(n = 10) {
      const out = []; const d = new Date(); d.setHours(12, 0, 0, 0);
      while (out.length < n) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() === 0 || d.getDay() === 6) continue;
        const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        out.push({ key, dow: DOW[d.getDay()], d: d.getDate() + ' ' + MONTHS[d.getMonth()], label: DOW[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()], date: new Date(d) });
      }
      return out;
    },
    // a steady, believable pattern of taken times per day and dentist (same answer every visit)
    taken(key, who = 'any') {
      let h = 2166136261; for (const c of key + who) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
      return EB.times.filter((t, i) => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100) < (i < 2 ? 55 : 34); });
    },
    firstFree(who = 'any') {
      for (const day of EB.days(10)) { const tk = EB.taken(day.key, who); const t = EB.times.find(x => !tk.includes(x)); if (t) return { day, time: t }; }
    },
    link(o) { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v && p.set(k, v)); return BASE + '/book?' + p.toString(); }
  };

  /* ---------- nav, mobile menu, floating actions ---------- */
  const nav = $('#nav');
  const msheet = $('.msheet'), menuBtn = $('.menu-btn');
  if (msheet && menuBtn) {
    const open = (v) => { msheet.classList.toggle('open', v); menuBtn.setAttribute('aria-expanded', String(v)); document.documentElement.style.overflow = v ? 'hidden' : ''; if (v) setTimeout(() => $('nav a', msheet)?.focus(), 60); };
    menuBtn.addEventListener('click', () => open(true));
    msheet.addEventListener('click', (e) => { if (e.target === msheet || e.target.closest('[data-close]') || e.target.closest('nav a')) open(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && msheet.classList.contains('open')) open(false); });
  }
  const waf = $('#waf'), mbar = $('#mbar'), hero = $('.hero') || $('.hx') || $('.phead');
  const onScroll = () => {
    const y = scrollY; nav && nav.classList.toggle('scrolled', y > 8);
    const past = hero ? y > hero.offsetHeight * 0.6 : y > 300;
    waf && waf.classList.toggle('show', past); mbar && mbar.classList.toggle('show', past);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- arrive on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach(el => io.observe(el));

  /* ---------- hero entrance waits for the welcome card ---------- */
  const start = () => requestAnimationFrame(() => $$('.hero, .hx, .phead, .bhero').forEach(h => h.classList.add('ready')));
  (window.pvReady || Promise.resolve()).then(start);

  /* ---------- next free appointment (hero card) ---------- */
  const nf = $('#next-free');
  if (nf) {
    const f = EB.firstFree('mw');
    if (f) {
      $('#nf-when', nf).textContent = f.day.label + ', ' + f.time;
      $('#nf-go', nf).href = EB.link({ type: 'gbt', who: 'mw', day: f.day.key, time: f.time });
    }
  }

  /* ---------- sticky stack: dim the card underneath ---------- */
  const cards = $$('.card-s');
  if (cards.length > 1) {
    const tick = () => { cards.forEach((c, i) => { const nx = cards[i + 1]; if (!nx) return; const a = c.getBoundingClientRect(), b = nx.getBoundingClientRect(); c.classList.toggle('covered', b.top - a.top < 90 && b.top < innerHeight); }); };
    addEventListener('scroll', tick, { passive: true }); tick();
  }

  /* ---------- material switch: zirconia / titanium ---------- */
  $$('.mat').forEach(m => {
    const spec = $('.spec', m), data = {
      zr: { t: 'Zirconia', s: 'White ceramic. A metal-free option, with good results so far.', e: 'Single tooth to full arch' },
      ti: { t: 'Titanium', s: 'Grey metal. The longest track record of any implant.', e: 'Single tooth to full arch' }
    };
    $$('.seg button', m).forEach(b => b.addEventListener('click', () => {
      const v = b.dataset.m; if (m.dataset.m === v) return;
      $$('.seg button', m).forEach(o => o.setAttribute('aria-pressed', String(o === b)));
      m.dataset.m = v; spec.classList.add('swap');
      setTimeout(() => { $('b', spec).textContent = data[v].t; $('span', spec).textContent = data[v].s; spec.classList.remove('swap'); }, reduce ? 0 : 230);
    }));
  });

  /* ---------- removal checklist ticks itself in ---------- */
  $$('.check').forEach(c => {
    const rows = $$('li', c);
    new IntersectionObserver(([e], o) => { if (!e.isIntersecting) return; o.disconnect(); rows.forEach((r, i) => setTimeout(() => r.classList.add('on'), reduce ? 0 : 350 + i * 140)); }, { threshold: .45 }).observe(c);
  });

  /* ---------- plan in three levels ---------- */
  const plan = $('#plan');
  if (plan) {
    const vEl = $('#visits'), bar = $('#bar'), togs = $$('.tog', plan);
    const total = togs.reduce((s, t) => s + +t.dataset.v, 0);
    const update = () => {
      let v = 0; togs.forEach(t => { const on = t.getAttribute('aria-checked') === 'true'; t.closest('.p-row').classList.toggle('off', !on); if (on) v += +t.dataset.v; });
      vEl.textContent = v; bar.style.width = (v / total * 100) + '%';
    };
    togs.forEach(t => t.addEventListener('click', () => { t.setAttribute('aria-checked', t.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); update(); }));
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { plan.classList.add('in'); setTimeout(update, reduce ? 0 : 500); o.disconnect(); } }, { threshold: .3 }).observe(plan);
  }

  /* ---------- compact booking widget (home) ---------- */
  const w = $('#widget');
  if (w) {
    const st = { type: 'gbt', day: null, time: null };
    const days = EB.days(7); st.day = days[0].key;
    const typesEl = $('#w-types'), daysEl = $('#w-days'), slotsEl = $('#w-slots'), sum = $('#w-sum'), go = $('#w-go');
    typesEl.innerHTML = ['gbt', 'first', 'fm'].map(id => { const t = EB.type(id); return `<button class="chip" type="button" data-v="${id}" aria-pressed="${id === st.type}">${t.short}<small>${t.mins} min</small></button>`; }).join('');
    daysEl.innerHTML = days.map(d => `<button class="chip" type="button" data-v="${d.key}" aria-pressed="${d.key === st.day}">${d.dow}<small>${d.d}</small></button>`).join('');
    const render = () => {
      const tk = EB.taken(st.day); if (!st.time || tk.includes(st.time)) st.time = EB.times.find(x => !tk.includes(x));
      slotsEl.innerHTML = EB.times.map(x => `<button class="slot-btn" type="button" data-v="${x}" ${tk.includes(x) ? `disabled aria-label="${x}, taken"` : ''} aria-pressed="${x === st.time}">${x}</button>`).join('');
      const day = days.find(d => d.key === st.day);
      sum.textContent = `${EB.type(st.type).name}, ${day.label} at ${st.time}`;
      go.href = EB.link({ type: st.type, day: st.day, time: st.time });
    };
    const group = (el, key) => el.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b || b.disabled) return; $$('button', el).forEach(o => o.setAttribute('aria-pressed', String(o === b))); st[key] = b.dataset.v; if (key === 'day') st.time = null; render(); });
    group(typesEl, 'type'); group(daysEl, 'day');
    slotsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b || b.disabled) return; st.time = b.dataset.v; render(); });
    render();
  }

  /* ---------- map loads only when it scrolls near ---------- */
  $$('.map[data-src]').forEach(m => new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    const f = document.createElement('iframe'); f.src = m.dataset.src; f.title = 'Map: Elite Biodental, 36 General Murtala Muhammed Ave, Eros, Windhoek'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    m.prepend(f);
  }, { rootMargin: '300px' }).observe(m));
})();
