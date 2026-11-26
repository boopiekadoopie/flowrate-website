/* Puzzle of Health shop (concept): hero entrance, cover mosaics, puzzle-tile knobs, free-guide form,
   Hub billing switch, bag with checkout. Demo only: nothing is sent and no payment is taken.
   Flowrate, November 2026. */
(() => {
  const d = document, html = d.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shot = html.classList.contains('shot');
  const $ = (s, el = d) => el.querySelector(s);
  const $$ = (s, el = d) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => { const v = Math.round(n * 100) / 100; return '$' + (Number.isInteger(v) ? String(v) : v.toFixed(2)); };
  const tick = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  /* 1. cover mosaics: a 4×3 puzzle with one piece missing (the brand's idea, drawn in code) */
  const KNOB = 'M-3 -11 L0 -11 C4 -11 5 -16 8 -17 C15 -20 24 -14 24 0 C24 14 15 20 8 17 C5 16 4 11 0 11 L-3 11 Z';
  const GRID = [
    '#1a4eea', '#80d1e1', '#aee601', '#f3f6fb',
    '#f3f6fb', '#1a4eea', null, '#80d1e1',
    '#aee601', '#f3f6fb', '#80d1e1', '#1a4eea'
  ];
  function mosaic(el) {
    const S = 100, g = 7, cols = 4, rows = 3, bg = '#0e1c40';
    const miss = GRID.indexOf(null);
    let cells = '', knobs = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i === miss) {
        cells += `<rect x="${c * S + g / 2 + 2}" y="${r * S + g / 2 + 2}" width="${S - g - 4}" height="${S - g - 4}" rx="6" fill="none" stroke="#aee601" stroke-width="3" stroke-dasharray="8 8" opacity=".85"/>`;
        continue;
      }
      cells += `<rect x="${c * S + g / 2}" y="${r * S + g / 2}" width="${S - g}" height="${S - g}" rx="5" fill="${GRID[i]}"/>`;
    }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (c < cols - 1) { // edge to the right
        const fromLeft = (r + c) % 2 === 0, src = fromLeft ? i : i + 1;
        const fill = src === miss ? bg : GRID[src];
        knobs += `<path d="${KNOB}" fill="${fill}" transform="translate(${(c + 1) * S} ${r * S + S / 2}) rotate(${fromLeft ? 0 : 180})"/>`;
      }
      if (r < rows - 1) { // edge below
        const down = (r + c) % 2 === 1, src = down ? i : i + cols;
        const fill = src === miss ? bg : GRID[src];
        knobs += `<path d="${KNOB}" fill="${fill}" transform="translate(${c * S + S / 2} ${(r + 1) * S}) rotate(${down ? 90 : 270})"/>`;
      }
    }
    el.innerHTML = `<svg viewBox="0 0 ${cols * S} ${rows * S}" aria-hidden="true" focusable="false">${cells}${knobs}</svg>`;
  }
  $$('[data-mosaic]').forEach(mosaic);

  /* 2. hero: words rise from a mask, the book settles, the kits fan out (after the welcome card closes) */
  const hero = $('.hero');
  const go = () => hero && hero.classList.add('ready');
  if (shot || reduce) go();
  else (window.pvReady || Promise.resolve()).then(() => requestAnimationFrame(() => requestAnimationFrame(go)));

  // the book follows the pointer a few degrees (desktop only, user driven)
  const stage = $('#stage'), book = $('.book');
  if (stage && book && !reduce && matchMedia('(pointer:fine)').matches) {
    let raf = 0;
    const clamp = (v) => Math.max(-0.6, Math.min(0.6, v));
    hero.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = clamp((e.clientX - (r.left + r.width / 2)) / r.width);
      const y = clamp((e.clientY - (r.top + r.height / 2)) / r.height);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { book.style.setProperty('--ry', (17 + x * 14).toFixed(2) + 'deg'); book.style.setProperty('--rx', (3 - y * 8).toFixed(2) + 'deg'); });
    });
    hero.addEventListener('pointerleave', () => { book.style.removeProperty('--ry'); book.style.removeProperty('--rx'); });
  }

  // the stage is drawn at 520x560 and scaled to fit its column
  const comp = $('#comp');
  const fit = () => { if (stage && comp) comp.style.setProperty('--s', Math.min(1.06, stage.clientWidth / 520).toFixed(4)); };
  fit();
  if (stage && 'ResizeObserver' in window) new ResizeObserver(fit).observe(stage); else addEventListener('resize', fit);

  // screenshots: load every image now instead of on scroll
  if (shot) $$('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });

  /* 3. reveal on scroll */
  const rv = $$('.rv');
  if ('IntersectionObserver' in window && !shot && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach((el) => io.observe(el));
  } else rv.forEach((el) => el.classList.add('in'));

  /* 4. header: hairline once scrolled, phone menu */
  const hd = $('#hd');
  const onScroll = () => hd.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const menuBtn = $('#menu-btn'), nav = $('#nav');
  const setMenu = (open) => { nav.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Close the menu' : 'Open the menu'); };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });

  /* 5. the seven-piece band: checkerboard + knobs for the current column count */
  const pieces = $('.pieces');
  let lastCols = 0;
  function knobs() {
    if (!pieces) return;
    const tiles = $$('.pc', pieces);
    const cols = getComputedStyle(pieces).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
    if (cols === lastCols) return; lastCols = cols;
    $$('.kn', pieces).forEach((k) => k.remove());
    const miss = tiles.findIndex((t) => t.classList.contains('pc-miss'));
    tiles.forEach((t, i) => { const r = Math.floor(i / cols), c = i % cols; t.classList.toggle('alt', (r + c) % 2 === 1); });
    const add = (t, dir) => { const k = d.createElement('i'); k.className = 'kn kn-' + dir; k.setAttribute('aria-hidden', 'true'); t.appendChild(k); };
    tiles.forEach((t, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      if (c < cols - 1 && i + 1 < tiles.length) { const fromLeft = r % 2 === 0, src = fromLeft ? i : i + 1; if (src !== miss) add(tiles[src], fromLeft ? 'r' : 'l'); }
      if (i + cols < tiles.length) { const down = (r + c) % 2 === 0, src = down ? i : i + cols; if (src !== miss) add(tiles[src], down ? 'd' : 'u'); }
    });
  }
  knobs();
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(knobs, 120); });

  /* 6. free guide + subscribe (demo) */
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const gForm = $('#g-form');
  if (gForm) gForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#g-email'), err = $('#g-err');
    if (!validEmail(email.value)) { email.setAttribute('aria-invalid', 'true'); err.textContent = 'Please enter your email address, like name@example.com.'; email.focus(); return; }
    email.removeAttribute('aria-invalid'); err.textContent = '';
    const done = $('#g-done'), name = $('#g-name').value.trim();
    $('#g-done-to').textContent = (name ? 'Thanks, ' + name.split(/\s+/)[0] + '. ' : '') + 'The guide is on its way to ' + email.value.trim() + '.';
    gForm.hidden = true; done.hidden = false; done.focus({ preventScroll: true });
  });
  const sForm = $('#sub-form');
  if (sForm) sForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const em = $('#sub-email'), msg = $('#sub-msg');
    if (!validEmail(em.value)) { em.setAttribute('aria-invalid', 'true'); msg.textContent = 'Please enter your email address, like name@example.com.'; em.focus(); return; }
    em.removeAttribute('aria-invalid'); msg.textContent = 'Thank you. On the live site, you are now subscribed. (Demo: nothing was sent.)';
  });

  /* 7. products, bag and checkout */
  const P = {
    hub_m: { name: 'Puzzle of Health Hub', sub: 'Monthly · 30 days free', price: 19, per: 'month', trial: true, thumb: 'hub', lbl: 'Hub' },
    hub_y: { name: 'Puzzle of Health Hub', sub: 'Yearly · 30 days free', price: 199, per: 'year', trial: true, thumb: 'hub', lbl: 'Hub' },
    book: { name: 'The Complete Puzzle of Health', sub: 'Book · downloadable file', price: 29, thumb: 'book', lbl: 'The<br>book' },
    course: { name: 'Puzzle of Healthy Living', sub: 'Course · 46 lessons', price: 197, thumb: 'course', lbl: '46<br>lessons' },
    kit1: { name: 'Kit 01: Sleep Rescue', sub: 'Rescue kit · 22 lessons', price: 9.99, thumb: 'kit', lbl: 'Sleep' },
    kit2: { name: 'Kit 02: Eating Rescue', sub: 'Rescue kit', price: 9.99, thumb: 'kit', lbl: 'Eating' },
    kit3: { name: 'Kit 03: Infections Rescue', sub: 'Rescue kit · 23 lessons', price: 9.99, thumb: 'kit', lbl: 'Infec-<br>tions' },
    kit4: { name: 'Kit 04: The Noodle Face Rescue', sub: 'Rescue kit · 24 lessons', price: 9.99, thumb: 'kit', lbl: 'Noodle<br>face' }
  };
  const KEY = 'poh-bag-v1';
  let bag = (store.get(KEY) || []).filter((x) => x && P[x.id] && x.qty > 0);
  const save = () => store.set(KEY, bag);
  const count = $('#bag-count'), live = $('#bag-live'), items = $('#bag-items'), empty = $('#bag-empty'), foot = $('#bag-ft');
  const total = $('#bag-total'), recur = $('#bag-recur');
  const qtyOf = () => bag.reduce((s, x) => s + x.qty, 0);
  const due = () => bag.reduce((s, x) => s + (P[x.id].trial ? 0 : P[x.id].price * x.qty), 0);
  const hubIn = () => bag.find((x) => P[x.id].trial);

  function render() {
    const n = qtyOf();
    count.textContent = n;
    items.innerHTML = bag.map((x) => {
      const p = P[x.id];
      const main = p.trial
        ? `<small class="trial">Then ${money(p.price)} a ${p.per}</small>`
        : `<div class="qty"><button type="button" data-q="-1" aria-label="One fewer: ${esc(p.name)}">−</button><span aria-label="Quantity">${x.qty}</span><button type="button" data-q="1" aria-label="One more: ${esc(p.name)}"${x.qty >= 9 ? ' disabled' : ''}>+</button></div>`;
      const side = p.trial ? `<b>$0</b><small>today</small>` : `<b>${money(p.price * x.qty)}</b>`;
      return `<li class="bi" data-id="${x.id}"><span class="thumb t-${p.thumb}" aria-hidden="true"><span>${p.lbl}</span></span><div class="bi-main"><b>${esc(p.name)}</b><small>${esc(p.sub)}</small>${main}</div><div class="bi-side">${side}<button type="button" class="rm" data-rm aria-label="Remove ${esc(p.name)}">Remove</button></div></li>`;
    }).join('');
    items.hidden = n === 0; empty.hidden = n > 0; foot.hidden = n === 0;
    total.textContent = money(due());
    const h = hubIn();
    recur.hidden = !h;
    if (h) recur.textContent = `Then ${money(P[h.id].price)} a ${P[h.id].per} for the Hub, after your 30 free days.`;
  }

  function bump() { count.classList.remove('bump'); void count.offsetWidth; count.classList.add('bump'); }
  function add(id) {
    const p = P[id]; if (!p) return;
    if (p.trial) bag = bag.filter((x) => !P[x.id].trial);
    const it = bag.find((x) => x.id === id);
    if (it) { if (!p.trial) it.qty = Math.min(9, it.qty + 1); } else bag.push({ id, qty: 1 });
    save(); render(); bump();
    const n = qtyOf();
    live.textContent = `Added ${p.name} to your bag. ${n} ${n === 1 ? 'item' : 'items'} in your bag.`;
  }
  function morph(b) {
    const t = $('.t', b); if (!t) return;
    if (!b.dataset.orig) b.dataset.orig = t.innerHTML;
    clearTimeout(b._t);
    b.style.minWidth = b.offsetWidth + 'px';
    b.classList.add('added'); t.innerHTML = tick + 'Added';
    b._t = setTimeout(() => { b.classList.remove('added'); t.innerHTML = b.dataset.orig; b.style.minWidth = ''; }, 1200);
  }
  d.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    add(b.dataset.add); morph(b);
  });

  // Hub billing switch
  const PLANS = { m: { id: 'hub_m', price: '$19', per: 'a month', trial: '30 days free, then $19 a month.' }, y: { id: 'hub_y', price: '$199', per: 'a year', trial: '30 days free, then $199 a year.' } };
  const planBtns = $$('.plan [data-plan]'), hubPrice = $('#hub-price'), hubPer = $('#hub-per'), hubTrial = $('#hub-trial'), hubAdd = $('#hub-add');
  function setPlan(k, focus) {
    planBtns.forEach((b) => { const on = b.dataset.plan === k; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    const p = PLANS[k];
    hubPrice.textContent = p.price; hubPer.textContent = p.per; hubTrial.textContent = p.trial; hubAdd.dataset.add = p.id;
    hubPrice.classList.remove('swap'); void hubPrice.offsetWidth; hubPrice.classList.add('swap');
  }
  planBtns.forEach((b) => {
    b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1;
    b.addEventListener('click', () => setPlan(b.dataset.plan));
    b.addEventListener('keydown', (e) => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); setPlan(b.dataset.plan === 'm' ? 'y' : 'm', true); } });
  });

  // bag drawer
  const bagEl = $('#bag'), scrim = $('#scrim'), bagBtn = $('#bag-btn');
  let lastFocus = null, view = 'bag', hideT;
  const LABEL = { bag: 'bag-h', checkout: 'co-h', done: 'done-h' };
  function show(v) {
    view = v;
    $$('.bag-view', bagEl).forEach((x) => { x.hidden = x.dataset.view !== v; });
    bagEl.setAttribute('aria-labelledby', LABEL[v]);
  }
  const focusables = () => $$('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])', $(`.bag-view[data-view="${view}"]`, bagEl)).filter((el) => el.offsetParent !== null);
  function openBag(v = 'bag') {
    clearTimeout(hideT);
    lastFocus = d.activeElement;
    show(v); render();
    bagEl.hidden = false; scrim.hidden = false; html.classList.add('locked');
    requestAnimationFrame(() => requestAnimationFrame(() => { bagEl.classList.add('open'); scrim.classList.add('open'); }));
    bagBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => { const f = focusables(); (f.find((el) => el.matches('.icon-x')) || f[0] || bagEl).focus({ preventScroll: true }); }, 60);
    d.addEventListener('keydown', onKey);
  }
  function closeBag(restore = true) {
    bagEl.classList.remove('open'); scrim.classList.remove('open');
    bagBtn.setAttribute('aria-expanded', 'false'); html.classList.remove('locked');
    d.removeEventListener('keydown', onKey);
    const fin = () => { bagEl.hidden = true; scrim.hidden = true; if (view === 'done') show('bag'); };
    if (reduce || shot) fin(); else hideT = setTimeout(fin, 380);
    if (restore && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeBag(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!bagEl.contains(d.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  bagBtn.addEventListener('click', () => openBag('bag'));
  scrim.addEventListener('click', () => closeBag());
  bagEl.addEventListener('click', (e) => {
    const c = e.target.closest('[data-bag-close]');
    if (c) { closeBag(!c.matches('a')); return; }
    const li = e.target.closest('.bi'); if (!li) return;
    const it = bag.find((x) => x.id === li.dataset.id); if (!it) return;
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) {
      it.qty += +q.dataset.q;
      if (it.qty < 1) bag = bag.filter((x) => x !== it); else it.qty = Math.min(9, it.qty);
      save(); render();
      const again = $(`.bi[data-id="${it.id}"] [data-q="${q.dataset.q}"]`, bagEl);
      (again && !again.disabled ? again : $('.icon-x', bagEl)).focus({ preventScroll: true });
      live.textContent = `${P[it.id].name}: ${bag.includes(it) ? it.qty : 0}.`;
    } else if (rm) {
      const idx = bag.indexOf(it);
      bag = bag.filter((x) => x !== it); save(); render();
      const next = $$('.bi [data-rm]', bagEl)[Math.min(idx, bag.length - 1)];
      (next || $('.icon-x', bagEl) || bagEl).focus({ preventScroll: true });
      live.textContent = `Removed ${P[it.id].name}.`;
    }
  });

  // checkout (demo)
  const coSum = $('#co-sum'), payBtn = $('#pay-btn');
  $('#to-checkout').addEventListener('click', () => {
    if (!qtyOf()) return;
    const h = hubIn();
    coSum.innerHTML = bag.map((x) => `<li><span>${esc(P[x.id].name)}${x.qty > 1 ? ' × ' + x.qty : ''}</span><b>${P[x.id].trial ? '$0 today' : money(P[x.id].price * x.qty)}</b></li>`).join('')
      + `<li class="sum-tot"><span>Due today</span><b>${money(due())}</b></li>`
      + (h ? `<li class="sum-rec"><span>Then ${money(P[h.id].price)} a ${P[h.id].per} for the Hub, after 30 free days</span></li>` : '');
    payBtn.textContent = due() > 0 ? 'Pay ' + money(due()) : 'Start your free 30 days';
    show('checkout');
    setTimeout(() => $('#co-email').focus({ preventScroll: true }), 40);
  });
  $('#co-back').addEventListener('click', () => { show('bag'); setTimeout(() => $('#to-checkout').focus({ preventScroll: true }), 30); });
  $('#co-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const em = $('#co-email'), nm = $('#co-name');
    const okE = validEmail(em.value), okN = nm.value.trim().length > 1;
    em.setAttribute('aria-invalid', String(!okE)); nm.setAttribute('aria-invalid', String(!okN));
    $('#err-email').textContent = okE ? '' : 'Please enter your email address, like name@example.com. Your download link goes there.';
    $('#err-name').textContent = okN ? '' : 'Please enter your name.';
    if (!okE) { em.focus(); return; }
    if (!okN) { nm.focus(); return; }
    const first = nm.value.trim().split(/\s+/)[0];
    $('#done-title').textContent = 'Thank you, ' + first;
    $('#done-to').textContent = 'Demo: no payment was taken, and nothing was sent to ' + em.value.trim() + '.';
    bag = []; save(); render();
    live.textContent = 'Order placed. Your bag is empty.';
    show('done');
    setTimeout(() => $('#done-body').focus({ preventScroll: true }), 40);
  });
  $('#done-back').addEventListener('click', () => closeBag());
  // clear an error as soon as the field is fixed
  [['#co-email', '#err-email', validEmail], ['#co-name', '#err-name', (v) => v.trim().length > 1], ['#g-email', '#g-err', validEmail]].forEach(([f, m, ok]) => {
    const el = $(f), msg = $(m); if (!el || !msg) return;
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true' && ok(el.value)) { el.setAttribute('aria-invalid', 'false'); msg.textContent = ''; } });
  });

  render();
  // for screenshots: ?shot&bag opens the bag on load
  if (shot && /[?&]bag\b/.test(location.search)) openBag('bag');
})();
