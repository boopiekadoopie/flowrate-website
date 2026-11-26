/* Elite Biodental home page v4: the pinned "Metal out. Ceramic in." scene, the nav over the hero,
   the treatment picture and the practice parallax. Flowrate, November 2026. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lin = (a, b, v) => clamp((v - a) / (b - a));
  const smooth = (a, b, v) => { const t = lin(a, b, v); return t * t * (3 - 2 * t); };
  const inOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  /* ---------- nav: transparent at the very top of the hero and while the dark scene is pinned ---------- */
  const nav = $('#nav'), hx = $('.hx');
  if (nav && hx) {
    const trk = $('.mo-track');
    const navTick = () => {
      let over = scrollY < 24;   // anything more and the headline would slide under a see-through nav
      if (!over && trk) { const r = trk.getBoundingClientRect(); over = r.top <= 0 && r.bottom >= innerHeight; }
      nav.classList.toggle('over', over);
    };
    addEventListener('scroll', navTick, { passive: true }); addEventListener('resize', navTick); navTick();
  }

  /* ---------- the pinned scene ---------- */
  const mo = $('.mo');
  if (mo) {
    if (reduce) mo.classList.add('static');
    else {
      const track = $('.mo-track', mo), tooth = $('.mo-tooth', mo);
      const A = $('.t-a', mo), C = $('.t-c', mo), inl = $('.inl', mo), sheen = $('.mo-sheen', mo), rail = $('.mo-rail', mo);
      const pieces = $$('.am', mo), steps = $$('.mo-steps li', mo), title = $$('.mo-title span', mo);
      // each amalgam piece leaves on its own path: x, y in thousandths of the tooth width, rotation, start delay
      const PATH = [{ x: -60, y: -205, r: -10, d: 0 }, { x: 6, y: -250, r: 5, d: .17 }, { x: 70, y: -215, r: 11, d: .34 }];
      let last = -1, raf = 0, idx = -1;
      const frame = () => {
        raf = 0;
        const box = track.getBoundingClientRect(), vh = innerHeight;
        const p = clamp(-box.top / (box.height - vh));
        if (Math.abs(p - last) < 0.0004) return; last = p;
        const u = tooth.offsetWidth / 1000;

        // 01 the old filling, a slow push in
        const s1 = smooth(0, .22, p);
        // 02 lift-out: the full "before" frame hands over to the pieces, which leave one by one
        A.style.opacity = String(1 - lin(.235, .275, p));
        const L = lin(.23, .48, p);
        pieces.forEach((el, i) => {
          const q = PATH[i], t = clamp((L - q.d) / .6), e = inOut(t);
          el.style.transform = `translate3d(${(q.x * e * u).toFixed(2)}px,${(q.y * e * u).toFixed(2)}px,0) rotate(${(q.r * e).toFixed(2)}deg)`;
          el.style.opacity = String(1 - smooth(.3, 1, t));
          el.style.filter = t > 0.001 ? `blur(${(5 * e).toFixed(2)}px)` : '';
        });
        // 03 seat: the ceramic inlay comes down and settles with a slight overshoot
        const S = lin(.52, .74, p), se = inOut(lin(0, .86, S)), press = Math.sin(Math.PI * lin(.8, 1, S)) * .022;
        inl.style.transform = `translate3d(0,${(((1 - se) * -260 + press * 260) * u).toFixed(2)}px,0) scale(${(1.06 - .06 * se).toFixed(4)})`;
        inl.style.opacity = String(smooth(0, .28, S) * (1 - lin(.79, .83, p)));
        C.style.opacity = String(lin(.745, .8, p));
        // 04 push in on the finished tooth, one light sweep
        const F = smooth(.78, 1, p);
        tooth.style.transform = `scale(${(1 + .035 * s1 + .13 * F).toFixed(4)})`;
        sheen.style.opacity = String(smooth(.8, .85, p) * (1 - smooth(.94, .99, p)));
        sheen.style.backgroundPosition = `${(130 - 160 * lin(.8, .97, p)).toFixed(1)}% 0`;

        // the copy: one chapter at a time, earlier ones dim, the brass rail fills
        const k = p < .22 ? 0 : p < .5 ? 1 : p < .77 ? 2 : 3;
        if (k !== idx) { idx = k; steps.forEach((li, i) => li.classList.toggle('on', i === k)); title[0].classList.toggle('dim', k >= 2); title[1].classList.toggle('dim', k < 2); }
        rail.style.transform = `scaleY(${p.toFixed(4)})`;
      };
      const ask = () => { if (!raf) raf = requestAnimationFrame(frame); };
      let live = false;
      new IntersectionObserver(([e]) => { live = e.isIntersecting; if (live) ask(); }, { rootMargin: '200px 0px' }).observe(track);
      addEventListener('scroll', () => { if (live) ask(); }, { passive: true });
      addEventListener('resize', () => { last = -1; ask(); });
      frame();
    }
  }

  /* ---------- treatments: the picture follows the row you point at, or the one in the middle ---------- */
  const list = $('.tx-list'), pic = $('.tx-pic');
  if (list && pic) {
    const rows = $$('a', list), imgs = $$('img', pic), cap = $('#tx-cap');
    const show = (a) => {
      rows.forEach(r => r.classList.toggle('on', r === a));
      imgs.forEach(i => i.classList.toggle('on', i.dataset.k === a.dataset.k));
      if (cap) cap.textContent = $('.tt', a).textContent;
    };
    rows.forEach(a => { a.addEventListener('mouseenter', () => show(a)); a.addEventListener('focus', () => show(a)); });
    if (matchMedia('(min-width:1081px)').matches) {
      const mid = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !list.matches(':hover')) show(e.target); }), { rootMargin: '-45% 0px -45% 0px' });
      rows.forEach(a => mid.observe(a));
    }
  }

  /* ---------- small touches: the consult photo settles, the practice photo drifts ---------- */
  const mp = $('.meet-photo');
  if (mp) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { mp.classList.add('in'); o.disconnect(); } }, { threshold: .25 }).observe(mp);
  const place = $('.place'), pimg = place && $('img', place);
  if (place && pimg && !reduce && matchMedia('(min-width:641px)').matches) {
    let on = false, r2 = 0;
    const drift = () => { r2 = 0; const b = place.getBoundingClientRect(), t = clamp((innerHeight - b.top) / (innerHeight + b.height)); pimg.style.transform = `translate3d(0,${((t - .5) * -9).toFixed(2)}%,0)`; };
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) drift(); }).observe(place);
    addEventListener('scroll', () => { if (on && !r2) r2 = requestAnimationFrame(drift); }, { passive: true });
  }
})();
