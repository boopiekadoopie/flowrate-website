/* Safland proposal: motion and interactions. Flowrate, 27 Nov 2026.
   Motion rules and beat sheets: ../MOTION.md. html.anim = animate; without it (QA ?shot, reduced motion, no JS)
   everything is shown in its finished state and nothing loops. */
(() => {
  const html = document.documentElement;
  const anim = html.classList.contains('anim');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, anim ? ms : 0));
  const fmt = (n) => 'N$' + Math.round(n).toLocaleString('en-ZA').replace(/[\s, ]/g, ' ');
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const linkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>';
  const tickSvg = '<svg class="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  /* roll: numbers count to their new value */
  function roll(el, to, dur = 450) {
    const from = +(el.dataset.v || to); el.dataset.v = to;
    if (!anim || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = fmt(from + (to - from) * easeOut(k)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  /* blur crossfade for a label */
  function swap(el, text) {
    if (!anim) { el.textContent = text; return; }
    el.classList.add('sw');
    setTimeout(() => { el.textContent = text; el.classList.remove('sw'); }, 170);
  }
  /* roll a line of text: old slides up and out, new slides in from below */
  function rollText(el, text) {
    if (!anim) { el.textContent = text; return; }
    const out = el.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }], { duration: 200, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
    out.onfinish = () => { el.textContent = text; out.cancel(); el.animate([{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' }); };
  }
  const inView = (el, k = 0) => { const r = el.getBoundingClientRect(); return r.bottom > innerHeight * k && r.top < innerHeight * (1 - k); };

  /* ---------- reveals: rise, mask-up, wipe, settle ---------- */
  const reveal = $$('.rv,.st,.mh,.wp,.tl');
  if (!anim || !('IntersectionObserver' in window)) reveal.forEach((el) => el.classList.add('in'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    reveal.forEach((el) => { if (!el.closest('.hero')) io.observe(el); });
    requestAnimationFrame(() => requestAnimationFrame(() => $$('.hero h1,.hero .rv,.hero .wp,.hero .st').forEach((el) => el.classList.add('in'))));
  }
  if (!anim) $('.hero h1').classList.add('in');

  /* ---------- hero: the link is sent, opened and answered (loops while visible) ---------- */
  (() => {
    const chat = $('.chat'), ping = $('.ping');
    if (!chat) return;
    const comp = $('.ch-in', chat), body = $('.ch-body', chat);
    const out = $('.bub.out', chat), reply = $('.bub.in', chat), sub = $('.ping .roll');
    const URL = 'safland.com/lease/grove/desert-bloom';
    if (!anim) { sub.textContent = '3 minutes on unit 14'; return; }
    let gen = 0, running = false, first = true;
    const reset = () => {
      body.classList.remove('fade'); comp.textContent = '';
      out.classList.remove('show', 'unfurl', 'txt'); reply.classList.remove('show', 'typing');
      ping.classList.remove('show'); sub.textContent = 'Just now';
    };
    async function loop(g) {
      if (first) { first = false; await wait(1200); }
      while (running && g === gen) {
        reset(); await wait(350); if (g !== gen) return;
        for (let i = 1; i <= URL.length; i++) { comp.textContent = URL.slice(0, i); await wait(24); if (g !== gen) return; }
        await wait(320); comp.textContent = ''; out.classList.add('show');
        await wait(330); out.classList.add('unfurl');
        await wait(600); out.classList.add('txt');
        await wait(800); if (g !== gen) return; ping.classList.add('show');
        for (const m of ['1 minute on unit 14', '2 minutes on unit 14', '3 minutes on unit 14']) { await wait(800); if (g !== gen) return; rollText(sub, m); }
        await wait(600); if (g !== gen) return; reply.classList.add('typing');
        await wait(1300); if (g !== gen) return; reply.classList.remove('typing'); reply.classList.add('show');
        await wait(4200); if (g !== gen) return;
        body.classList.add('fade'); ping.classList.remove('show');
        await wait(650);
      }
    }
    const start = () => { if (running || document.hidden) return; running = true; loop(++gen); };
    const stop = () => { running = false; gen++; };
    new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0.25 }).observe(chat);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : inView(chat) && start()));
  })();

  /* ---------- website mock: "Lease a space" opens what's free right now ---------- */
  (() => {
    const ws = $('.ws'); if (!ws) return;
    const cta = $('.ws-cta', ws), drop = $('#drop'), cur = $('.cursor', ws), row = $('.drop a.row', ws);
    const open = (v) => { drop.classList.toggle('open', v); cta.setAttribute('aria-expanded', String(v)); };
    cta.addEventListener('click', (e) => { e.stopPropagation(); open(!drop.classList.contains('open')); });
    $('.ws-hero .see', ws).addEventListener('click', (e) => { e.stopPropagation(); open(true); });
    document.addEventListener('click', (e) => { if (!drop.contains(e.target)) open(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
    if (!anim) { ws.classList.add('chips-in'); open(true); row.classList.add('hl'); return; }
    new IntersectionObserver(async (es, o) => {
      if (!es[0].isIntersecting) return; o.disconnect();
      ws.classList.add('chips-in'); await wait(700);
      const box = ws.getBoundingClientRect();
      const at = (el) => { const b = el.getBoundingClientRect(); return [b.left - box.left + b.width * 0.5, b.top - box.top + b.height * 0.55]; };
      const [x0, y0] = [box.width * 0.42, box.height * 0.8], [x1, y1] = at(cta);
      cur.style.transform = `translate(${x0}px,${y0}px)`; cur.classList.add('on');
      await cur.animate([{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${x1}px,${y1}px)` }], { duration: 900, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }).finished;
      cta.classList.add('press'); await wait(110); cta.classList.remove('press'); open(true);
      await wait(420);
      const [x2, y2] = at(row);
      await cur.animate([{ transform: `translate(${x1}px,${y1}px)` }, { transform: `translate(${x2}px,${y2}px)` }], { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }).finished;
      row.classList.add('hl'); await wait(1300); cur.classList.remove('on');
      setTimeout(() => row.classList.remove('hl'), 2500);
    }, { threshold: 0.45 }).observe(ws);
  })();

  /* ---------- the leasing link: builder, site plan, buttons, booking sheet ---------- */
  (() => {
    const site = $('#site'); if (!site) return;
    const UNITS = {
      '03': { m: 118, w: 'Centre of the walkway, wide shopfront', r: 'From March 2027' },
      '04': { m: 92, w: 'Opposite the main entrance', r: 'Ready now' },
      '10': { m: 109, w: 'Left of the main entrance', r: 'Ready now' },
      '11': { m: 64, w: 'Right of the main entrance', r: 'Ready now' },
      '14': { m: 86, w: 'Corner unit next to the anchor store', r: 'Ready now' },
    };
    const scr = $('#scr'), ll = $('#ll'), unitBox = $('#unit'), unitIn = $('#unit-in');
    const interest = $('#interest'), viewing = $('#viewing'), sheet = $('#sheet'), dim = $('#dim'), req = $('#req');
    const units = $$('.u', site), free = $$('.u.free', site), chips = $$('.chip');
    let link = { name: 'Desert Bloom Florist', unit: '14' };
    let draft = { ...link };
    let phoneUnit = '14', slot = null, typing = false;
    units.forEach((g, i) => g.style.setProperty('--i', i));

    /* draw: the plan draws itself, the tenant's unit is already orange, then the other free units light up */
    const lightUp = async () => {
      site.classList.add('in');
      if (!anim) { free.forEach((g) => g.classList.add('lit')); return; }
      await wait(1250);
      for (const g of free) { if (!g.classList.contains('sel')) { g.classList.add('lit'); await wait(110); } }
      free.forEach((g) => g.classList.add('lit'));
      halo($('.u.sel', site));
    };
    if (!anim) lightUp();
    else new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); lightUp(); } }, { threshold: 0.3 }).observe(site);

    function halo(g) { if (!g || !anim) return; g.classList.remove('halo-on'); void g.getBoundingClientRect(); g.classList.add('halo-on'); }

    /* grow: the unit card keeps its place; its content crossfades and its height follows */
    function fillCard(u) {
      const d = UNITS[u];
      $('#u-t').textContent = `Unit ${u} · ${d.m} m²`;
      $('#u-d').textContent = `${d.w} · ${d.r}`;
      $('#u-tag').hidden = u !== link.unit;
    }
    function setPhoneUnit(u, quiet) {
      if (!UNITS[u]) return;
      const changed = u !== phoneUnit; phoneUnit = u;
      free.forEach((g) => { const on = g.dataset.u === u; g.classList.toggle('sel', on); g.setAttribute('aria-pressed', String(on)); });
      if (changed || quiet) { halo($(`.u[data-u="${u}"]`, site)); }
      // reset the tenant's buttons for the new unit
      interest.classList.remove('sent'); interest.innerHTML = `<span id="i-l">I'm interested in unit ${u}</span>`;
      viewing.classList.remove('done'); viewing.innerHTML = '<span id="v-l">Book a viewing</span>';
      if (!anim) { fillCard(u); return; }
      const h0 = unitBox.offsetHeight;
      unitIn.classList.add('sw');
      setTimeout(() => {
        fillCard(u);
        const h1 = unitIn.offsetHeight;
        unitBox.style.height = h0 + 'px'; void unitBox.offsetHeight; unitBox.style.height = h1 + 'px';
        unitIn.classList.remove('sw');
        setTimeout(() => { unitBox.style.height = ''; }, 320);
      }, 160);
    }
    const pick = (g) => { if (g && g.classList.contains('free')) setPhoneUnit(g.dataset.u); };
    site.addEventListener('click', (e) => pick(e.target.closest('.u')));
    site.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e.target.closest('.u')); } });

    /* the tenant's buttons: one tap answers, with one halo in the button's own shape */
    interest.addEventListener('click', () => {
      if (interest.classList.contains('sent')) return;
      interest.classList.add('sent');
      interest.innerHTML = tickSvg + '<span>Sent to Safland leasing</span>';
    });
    const openSheet = () => {
      $('#sh-t').textContent = `Book a viewing of unit ${phoneUnit}`;
      sheet.classList.remove('done'); slot = null;
      $$('.slot', sheet).forEach((s) => s.setAttribute('aria-checked', 'false'));
      req.disabled = true; req.textContent = 'Pick a time';
      sheet.inert = false; scr.classList.add('sheet-open');
      setTimeout(() => $('.slot', sheet).focus({ preventScroll: true }), 60);
    };
    const closeSheet = () => { scr.classList.remove('sheet-open'); sheet.inert = true; viewing.focus({ preventScroll: true }); };
    viewing.addEventListener('click', () => { if (!viewing.classList.contains('done')) openSheet(); });
    dim.addEventListener('click', closeSheet);
    sheet.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
    $$('.slot', sheet).forEach((s) => s.addEventListener('click', () => {
      $$('.slot', sheet).forEach((x) => x.setAttribute('aria-checked', String(x === s)));
      slot = s.textContent; req.disabled = false; req.textContent = `Request ${slot}`;
    }));
    req.addEventListener('click', async () => {
      if (!slot) return;
      $('#ok-t').textContent = `Viewing requested: ${slot}`;
      sheet.classList.add('done');
      await wait(2100);
      closeSheet();
      viewing.classList.add('done');
      viewing.innerHTML = tickSvg + `<span>Viewing requested: ${slot}</span>`;
    });

    /* builder: name + unit -> a personal link */
    const nameIn = $('#tenant'), outBox = $('#b-out'), slugEl = $('#b-slug'), note = $('#b-note'), make = $('#make');
    const slug = (s) => (s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 34).replace(/-+$/, '')) || 'your-tenant';
    const dirty = () => draft.name.trim() !== link.name || draft.unit !== link.unit;
    function refresh() {
      const d = dirty();
      outBox.classList.toggle('dirty', d);
      if (!typing) slugEl.textContent = slug(draft.name);
      note.textContent = d ? 'Press “Create their link” to update it.' : 'Ready to send by WhatsApp or email.';
    }
    nameIn.addEventListener('input', () => { draft.name = nameIn.value; refresh(); });
    nameIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); make.click(); } });
    chips.forEach((c) => c.addEventListener('click', () => {
      chips.forEach((x) => x.setAttribute('aria-checked', String(x === c)));
      draft.unit = c.dataset.u; refresh();
    }));

    /* fly: the new link travels on an arc into the phone, then the phone reloads */
    function fly(from, to, label) {
      const t = document.createElement('div');
      t.className = 'token'; t.innerHTML = linkIcon + '<span></span>'; t.lastChild.textContent = label;
      document.body.appendChild(t);
      const w = t.offsetWidth, h = t.offsetHeight;
      const p0 = [from.left + from.width / 2 - w / 2, from.top + from.height / 2 - h / 2];
      const p2 = [to.left + to.width / 2 - w / 2, to.top + 34];
      const p1 = [(p0[0] + p2[0]) / 2, Math.min(p0[1], p2[1]) - 90];
      const frames = [];
      for (let i = 0; i <= 14; i++) {
        const k = i / 14, a = (1 - k) * (1 - k), b = 2 * (1 - k) * k, c = k * k;
        frames.push({ transform: `translate(${a * p0[0] + b * p1[0] + c * p2[0]}px,${a * p0[1] + b * p1[1] + c * p2[1]}px) scale(${1 + 0.06 * Math.sin(Math.PI * k) - 0.45 * k * k})`, opacity: k < 0.82 ? 1 : (1 - k) / 0.18 });
      }
      return t.animate(frames, { duration: 760, easing: 'cubic-bezier(.65,0,.35,1)' }).finished.then(() => t.remove());
    }
    function loadPhone() {
      const bar = $('#ll-bar');
      ll.scrollTo({ top: 0, behavior: anim ? 'smooth' : 'auto' });
      if (anim) {
        bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run');
        ll.classList.remove('reload'); void ll.offsetWidth; ll.classList.add('reload');
        setTimeout(() => ll.classList.remove('reload'), 600);
      }
      swap($('#ll-name'), link.name);
      setPhoneUnit(link.unit, true);
    }
    make.addEventListener('click', async () => {
      if (make.disabled) return;
      link = { name: draft.name.trim() || 'your tenant', unit: draft.unit };
      draft.name = draft.name.trim();
      make.disabled = true; typing = true;
      outBox.classList.remove('dirty');
      const s = slug(link.name);
      slugEl.textContent = '';
      const caret = document.createElement('i'); caret.className = 'caret'; slugEl.after(caret);
      for (let i = 1; i <= s.length; i++) { slugEl.textContent = s.slice(0, i); await wait(22); }
      await wait(250); caret.remove(); typing = false;
      note.textContent = 'Done. The phone shows what they’ll open.';
      const phone = $('#link .phone');
      if (anim) {
        const b = make.getBoundingClientRect(), r = phone.getBoundingClientRect();
        const bothVisible = b.top >= 0 && b.bottom <= innerHeight && r.top < innerHeight - 160 && r.bottom > 160;
        if (bothVisible) await fly(b, r, 'safland.com/lease/grove/' + s);
        else { phone.scrollIntoView({ behavior: 'smooth', block: 'center' }); await wait(700); }
      }
      loadPhone();
      make.disabled = false;
    });
  })();

  /* ---------- price builder: pick the developments, the total rolls ---------- */
  (() => {
    const dvs = $$('.dv'); if (!dvs.length) return;
    const tot = $('#tot'), set = $('.stack .s-set'), web = $('.stack .s-web'), xs = $$('.stack .s-x');
    const lgSet = $('#lg-set span'), lgX = $('#lg-x'), first = () => dvs.find((d) => d.getAttribute('aria-pressed') === 'true');
    const W = 92500, pct = (v) => (v / W * 100).toFixed(2) + '%';
    function draw() {
      const on = dvs.filter((d) => d.getAttribute('aria-pressed') === 'true');
      const n = on.length;
      roll(tot, 45000 + (n ? 25000 + (n - 1) * 2500 : 0));
      web.style.width = pct(45000);
      set.style.width = n ? pct(25000) : '0%'; set.classList.toggle('on', n > 0);
      xs.forEach((x, i) => { const v = i < n - 1; x.style.width = v ? pct(2500) : '0%'; x.classList.toggle('on', v); });
      lgSet.textContent = n ? `Leasing links, with ${first().textContent.trim()}: ${fmt(25000)}` : 'No leasing links yet';
      lgX.hidden = n < 2;
      if (n >= 2) lgX.lastChild.textContent = `${n - 1} more development${n > 2 ? 's' : ''}: ${fmt((n - 1) * 2500)}`;
    }
    dvs.forEach((d) => d.addEventListener('click', () => { d.setAttribute('aria-pressed', String(d.getAttribute('aria-pressed') !== 'true')); draw(); }));
    $('#all').addEventListener('click', () => { dvs.forEach((d) => d.setAttribute('aria-pressed', 'true')); draw(); });
    $('#none').addEventListener('click', () => { dvs.forEach((d) => d.setAttribute('aria-pressed', 'false')); draw(); });
    draw();
  })();

  /* ---------- section dock: the indicator stretches as it travels ---------- */
  (() => {
    const dock = $('.dock'); if (!dock || html.classList.contains('shot-mode')) return;
    const links = $$('a', dock), ind = $('.dock-ind', dock), secs = links.map((a) => $(a.getAttribute('href')));
    const hero = $('.hero'), last = $('.sec.last');
    let cur = -1;
    function place(i, instant) {
      const d = dock.getBoundingClientRect(), b = links[i].getBoundingClientRect();
      if (instant || cur < 0 || !anim) ind.style.transition = 'none';
      else { const right = i > cur; ind.style.transition = `left ${right ? 0.38 : 0.22}s cubic-bezier(.22,1,.36,1), right ${right ? 0.22 : 0.38}s cubic-bezier(.22,1,.36,1)`; }
      ind.style.left = (b.left - d.left) + 'px'; ind.style.right = (d.right - b.right) + 'px';
      links.forEach((a, k) => a.classList.toggle('cur', k === i)); cur = i;
    }
    let ticking = false;
    function update() {
      ticking = false;
      if (getComputedStyle(dock).display === 'none') return;
      const y = innerHeight * 0.42; let i = -1;
      secs.forEach((s, k) => { if (s.getBoundingClientRect().top < y) i = k; });
      const show = hero.getBoundingClientRect().bottom < innerHeight * 0.45 && last.getBoundingClientRect().top > innerHeight * 0.7 && i >= 0;
      const was = dock.classList.contains('on');
      dock.classList.toggle('on', show);
      if (i >= 0 && i !== cur) place(i, !was);
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', () => { cur = -1; update(); });
    update();
  })();
})();
