/* Preview chrome for the Dr Wucher demo (both sites). Loaded right after <div class="pv-bar" data-site="…">
   so the bar paints with the page. Flowrate, November 2026. */
(() => {
  const BASE = '/dr-wucher';
  const ANDREW = { email: 'andrew@flowrate.agency', wa: '27824104936', phone: '+27 82 410 4936' };
  const bar = document.querySelector('.pv-bar');
  const site = bar ? bar.dataset.site : 'practice';
  const q = new URLSearchParams(location.search);
  const shot = q.has('shot');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  let resolveReady; window.pvReady = new Promise(r => (resolveReady = r));

  if (bar) {
    bar.innerHTML = `<div class="pv-in">
      <span class="pv-note"><i class="pv-dot" aria-hidden="true"></i><span><b>Preview for Dr Wucher</b><span class="pv-long"> · made by Flowrate · not the live website</span></span></span>
      <nav class="pv-switch" aria-label="Switch between the preview pages">
        <a href="${BASE}"${site === 'practice' ? ' aria-current="page"' : ''}>Practice<span class="pv-long">&nbsp;site</span></a>
        <a href="${BASE}/puzzle-of-health"${site === 'poh' ? ' aria-current="page"' : ''}>Puzzle<span class="pv-mid">&nbsp;of Health</span><span class="pv-long">&nbsp;shop</span></a>
        <a href="${BASE}/plan"${site === 'plan' ? ' aria-current="page"' : ''}><span class="pv-mid">Our&nbsp;plan</span><span class="pv-short">Plan</span></a>
      </nav>
      <button class="pv-about" type="button" data-pv-open="about">About<span class="pv-mid">&nbsp;this preview</span></button>
    </div>`;
  }

  const waAndrew = 'https://wa.me/' + ANDREW.wa + '?text=' + encodeURIComponent("Hi Andrew, I've had a look at the Elite Biodental preview.");
  const mailAndrew = 'mailto:' + ANDREW.email + '?subject=' + encodeURIComponent('Elite Biodental preview');
  const sign = `<div class="pv-sign"><img src="${BASE}/assets/img/andrew.jpg" alt="" width="40" height="40"><span><b>Andrew Murray</b>, Flowrate<br>${ANDREW.email} · ${ANDREW.phone}</span></div>`;
  const x = '<button class="pv-x" type="button" aria-label="Close" data-pv-close><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#151515" stroke-width="1.6" stroke-linecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg></button>';

  function build() {
    const about = document.createElement('dialog');
    about.className = 'pv-dlg'; about.id = 'pv-about'; about.setAttribute('aria-labelledby', 'pv-about-h');
    about.innerHTML = `${x}<div class="pv-body">
      <h2 id="pv-about-h">About this preview</h2>
      <p>A working first look, made for Dr Martin Wucher by Andrew Murray at Flowrate. It isn't the live practice website, and search engines are asked not to list it.</p>
      <h3>Real, from public sources</h3>
      <ul><li>The practice name, address and both dentists</li><li>Dr Wucher's qualifications and research</li><li>The treatments described on the practice's earlier website</li><li>Puzzle of Health's products and prices</li></ul>
      <h3>Placeholders until we hear from you</h3>
      <ul><li>Photos marked “Concept image”, including the pictures of Dr Wucher at work, which were made from his photo for this preview</li><li>Hours, phone and WhatsApp numbers, and registration numbers</li><li>Dr Andreae's and the team's photos</li><li>All wording, until you've approved it</li></ul>
      <h3>Working demos</h3>
      <ul><li>Booking, WhatsApp buttons and the shop checkout behave as they would on the live site. Nothing is sent, and no payment is taken.</li></ul>
      ${sign}
      <div class="pv-actions"><a class="pv-btn pv-primary" href="${waAndrew}" target="_blank" rel="noopener">WhatsApp Andrew</a><a class="pv-btn" href="${mailAndrew}">Email Andrew</a></div>
    </div>`;
    document.body.appendChild(about);

    const welcome = document.createElement('dialog');
    welcome.className = 'pv-dlg pv-welcome'; welcome.id = 'pv-welcome'; welcome.setAttribute('aria-labelledby', 'pv-welcome-h');
    welcome.innerHTML = `<div class="pv-hero"><img src="${BASE}/assets/img/dr-wucher.jpg" alt=""><span><b>Elite Biodental</b>A first look at a new website</span></div>
      <div class="pv-body">
        <h2 id="pv-welcome-h">Welcome, Dr Wucher</h2>
        <p>This is a working first look at a new website for Elite Biodental, with your Puzzle of Health shop alongside it. I built it from what's public about the practice, so you can click through it the way a patient would.</p>
        <ul class="pv-try"><li>Scroll: an old filling is replaced</li><li>Request a time</li><li>Build a plan in three levels</li><li>Shop Puzzle of Health</li></ul>
        <p style="font-size:14px">Nothing you do here is sent anywhere. Photos marked “Concept image”, including the ones of you at work, are placeholders made for this preview.</p>
        <div class="pv-actions"><button class="pv-btn pv-primary" type="button" data-pv-close>Have a look</button></div>
        ${sign}
      </div>`;
    document.body.appendChild(welcome);

    const sheet = document.createElement('div');
    sheet.className = 'pv-sheet'; sheet.setAttribute('role', 'status'); sheet.setAttribute('aria-live', 'polite');
    document.body.appendChild(sheet);
    let hideT;
    window.pvSheet = (html) => {
      sheet.innerHTML = html + '<div class="pv-row"><button class="pv-btn" type="button" data-pv-sheet-close>Got it</button></div>';
      requestAnimationFrame(() => sheet.classList.add('show'));
      clearTimeout(hideT); hideT = setTimeout(() => sheet.classList.remove('show'), 9000);
    };

    const icon = {
      wa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d7a5c" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/></svg>',
      call: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1d7a5c" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>'
    };
    const time = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    document.addEventListener('click', (e) => {
      const open = e.target.closest('[data-pv-open]');
      if (open) { e.preventDefault(); document.getElementById('pv-' + open.dataset.pvOpen).showModal(); return; }
      if (e.target.closest('[data-pv-close]')) { e.target.closest('dialog').close(); return; }
      if (e.target.closest('[data-pv-sheet-close]')) { sheet.classList.remove('show'); return; }
      const d = e.target.closest('[data-demo]');
      if (!d) return;
      e.preventDefault();
      const kind = d.dataset.demo;
      if (kind === 'whatsapp') {
        const who = d.dataset.to || 'the practice';
        pvSheet(`<div class="pv-t"><i>${icon.wa}</i>Opens WhatsApp</div><p>On the live site, this opens a WhatsApp chat with ${esc(who)}, with the message already typed. The patient only taps send.</p><div class="pv-chat"><div class="pv-bubble">${esc(d.dataset.msg || "Hello, I'd like to request a time for a check-up.")}<small>${time()}</small></div></div>`);
      } else if (kind === 'call') {
        pvSheet(`<div class="pv-t"><i>${icon.call}</i>Calls the practice</div><p>On a phone, this rings reception straight away. On a computer, it shows the number. The practice's number goes here once you've confirmed it.</p>`);
      } else if (kind === 'note') {
        pvSheet(`<div class="pv-t"><i>${icon.wa}</i>${esc(d.dataset.title || 'In the live version')}</div><p>${esc(d.dataset.msg || '')}</p>`);
      }
    });
    // clicking the dimmed backdrop closes a dialog
    [about, welcome].forEach(dlg => dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }));
    welcome.addEventListener('close', () => { store.set('pv-welcomed', '1'); resolveReady(); });

    if (!shot && site !== 'plan' && !store.get('pv-welcomed') && typeof welcome.showModal === 'function') {
      welcome.showModal();
      setTimeout(() => welcome.querySelector('[data-pv-close]').focus({ preventScroll: true }), 50);
    } else resolveReady();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
