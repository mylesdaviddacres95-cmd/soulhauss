/* SoulHauss preview site. Plain JavaScript, no libraries. */
(() => {
  const root = document.documentElement;
  const reduce = root.classList.contains('calm') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Paper grain ---------- */
  (() => {
    const el = $('#grain');
    if (!el) return;
    try {
      const size = 180;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      const img = ctx.createImageData(size, size);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() < 0.5 ? 30 : 235;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = Math.random() * 255;
      }
      ctx.putImageData(img, 0, 0);
      el.style.backgroundImage = `url(${c.toDataURL('image/png')})`;
    } catch (e) { /* decoration only */ }
  })();

  /* ---------- The door ---------- */
  const door = $('#door');
  const doorway = $('#doorway');
  const hintText = $('#door-hint-text');
  const dots = $$('.door__dots i');
  const knockWords = $$('.knock');
  let knocks = 0;
  let opened = false;
  let audio;
  let autoTimer;

  function knockSound() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const t = audio.currentTime;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(210, t);
      osc.frequency.exponentialRampToValueAtTime(72, t + 0.09);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.5, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      osc.connect(gain).connect(audio.destination);
      osc.start(t);
      osc.stop(t + 0.17);
      const len = Math.floor(audio.sampleRate * 0.03);
      const buf = audio.createBuffer(1, len, audio.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const noise = audio.createBufferSource();
      noise.buffer = buf;
      const band = audio.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.value = 950;
      const g2 = audio.createGain();
      g2.gain.value = 0.22;
      noise.connect(band).connect(g2).connect(audio.destination);
      noise.start(t);
    } catch (e) { /* silence is fine */ }
  }

  function enter() { root.classList.add('entered'); }

  // The door swings, light pours out of the doorway and fills the screen, then clears to show the page
  function openDoor(quiet) {
    if (opened || !door) return;
    opened = true;
    clearTimeout(autoTimer);
    const leaf = $('#door-leaf');
    const scene = $('#door-scene');
    if (leaf && scene) {
      const r = leaf.getBoundingClientRect();
      const sr = scene.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      door.style.setProperty('--fx', `${cx}px`);
      door.style.setProperty('--fy', `${cy}px`);
      scene.style.transformOrigin = `${cx - sr.left}px ${cy - sr.top}px`;
    }
    door.classList.add('is-open');
    const T = reduce ? { flood: 320, through: 1050, done: 1800 } : { flood: 640, through: 1800, done: 2800 };
    setTimeout(() => door.classList.add('is-flood'), T.flood);
    setTimeout(() => {
      door.classList.add('is-through');
      root.classList.remove('door-closed');
      enter();
      window.dispatchEvent(new Event('scroll'));
    }, T.through);
    setTimeout(() => {
      door.setAttribute('hidden', '');
      const h = $('#hero-h');
      if (h && !quiet) h.focus({ preventScroll: true });
    }, T.done);
  }

  // Each knock lands as an eight-point star, in the brand colours
  function burst(x, y, bigger) {
    const el = document.createElement('span');
    el.className = `burst${bigger ? ' burst--big' : ''}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0L59 41L100 50L59 59L50 100L41 59L0 50L41 41Z" fill="${bigger ? '#E9B454' : '#BF4317'}"/><path d="M20 20L50 42L80 20L58 50L80 80L50 58L20 80L42 50Z" fill="${bigger ? '#BF4317' : '#E9B454'}"/></svg>`;
    door.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 950);
  }

  function knock(e) {
    if (opened) return;
    knocks += 1;
    clearTimeout(autoTimer);
    if (doorway) {
      // the star always shows, so a knock is never silent
      const r = doorway.getBoundingClientRect();
      const x = e && e.clientX ? e.clientX : r.left + r.width / 2;
      const y = e && e.clientY ? e.clientY : r.top + r.height * 0.44;
      burst(x, y, knocks > 1);
      if (!reduce) {
        doorway.classList.remove('thud');
        void doorway.offsetWidth;
        doorway.classList.add('thud');
      }
    }
    door.classList.add(knocks > 1 ? 'knocked-2' : 'knocked-1');
    if (dots[knocks - 1]) dots[knocks - 1].classList.add('on');
    if (knockWords[knocks - 1]) knockWords[knocks - 1].classList.add('on');
    if (hintText) hintText.textContent = knocks === 1 ? 'And once more' : 'Come on in';
    if (knocks >= 2) setTimeout(() => openDoor(false), reduce ? 220 : 400);
    else autoTimer = setTimeout(() => openDoor(true), 12000);
    if (navigator.vibrate) { try { navigator.vibrate(18); } catch (err) { /* fine */ } }
    knockSound();
  }

  if (door && root.classList.contains('door-closed')) {
    // One knock per touch. Pointer events where the browser has them, touch or mouse where it does not,
    // and a plain click as the last resort (screen readers, unusual in-app browsers).
    const hit = $('#door-hit');
    let lastDown = -1e9;
    const down = (e) => {
      const now = performance.now();
      if (now - lastDown < 60) return;
      knock(e);
      lastDown = performance.now();
    };
    if (window.PointerEvent) {
      hit.addEventListener('pointerdown', down);
    } else {
      hit.addEventListener('touchstart', (e) => { const t = e.touches && e.touches[0]; down(t ? { clientX: t.clientX, clientY: t.clientY } : e); }, { passive: true });
      hit.addEventListener('mousedown', (e) => { if (performance.now() - lastDown > 500) down(e); });
    }
    hit.addEventListener('click', (e) => { if (performance.now() - lastDown > 800) { knock(e); } });
    $('#door-skip').addEventListener('click', (e) => { e.stopPropagation(); openDoor(false); });
    document.addEventListener('keydown', (e) => { if (!opened && e.key === 'Escape') openDoor(false); });
    document.addEventListener('keydown', (e) => {
      if (opened || e.target.closest('#door-skip')) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); knock(); }
    });
    autoTimer = setTimeout(() => openDoor(true), 16000);
  } else {
    opened = true;
    if (door) door.setAttribute('hidden', '');
    root.classList.remove('door-closed');
    enter();
  }

  /* ---------- Social battery ---------- */
  const STATES = {
    1: ['Running on empty.', 'Good. Come anyway. Find a quiet corner, pick up something creative and let the afternoon come to you. Nobody will ask you to do an icebreaker.'],
    2: ['A bit flat.', 'Start with the craft table and your free brew. If a chat happens, lovely. If it does not, also lovely.'],
    3: ['Half charged.', 'Drift between a quiet craft and a proper chat. Both are the point.'],
    4: ['Feeling sociable.', 'Pull up a chair at the big table. The guest session is going to be your kind of thing.'],
    5: ['Fully charged.', 'Get stuck into the group quiz, meet everyone and fill your cup.']
  };
  const VALUE_TEXT = { 1: 'Running on empty', 2: 'A bit flat', 3: 'Half charged', 4: 'Feeling sociable', 5: 'Fully charged' };
  const THEME = { low: '#2C2F18', mid: '#F3EFDD', high: '#F2C76F' };

  const batUI = $('#battery-ui');
  const batInput = $('#battery-input');
  const batCells = $$('.battery__cell');
  const batState = $('#bat-state');
  const batSay = $('#bat-say');
  const minis = $$('.minibat');
  const themeMeta = $('meta[name="theme-color"]');
  let level = 3;

  function setLevel(v, opts = {}) {
    v = Math.max(1, Math.min(5, Math.round(v)));
    const changed = v !== level;
    level = v;
    const mood = v <= 2 ? 'low' : v === 3 ? 'mid' : 'high';
    root.dataset.battery = String(v);
    root.dataset.mood = mood;
    batCells.forEach((c, i) => { c.classList.toggle('on', i < v); c.classList.toggle('is-current', i === v - 1); });
    minis.forEach((m) => $$('i', m).forEach((c, i) => c.classList.toggle('on', i < v)));
    if (batInput) {
      batInput.value = String(v);
      batInput.setAttribute('aria-valuetext', VALUE_TEXT[v]);
    }
    if (batState) batState.textContent = STATES[v][0];
    if (batSay) batSay.textContent = STATES[v][1];
    if (themeMeta) themeMeta.setAttribute('content', THEME[mood]);
    if (opts.save) { try { sessionStorage.setItem('sh-battery', String(v)); } catch (e) {} }
    if (changed && opts.haptic && navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
  }

  let stored = 3;
  try { stored = parseInt(sessionStorage.getItem('sh-battery'), 10) || 3; } catch (e) {}
  setLevel(stored);

  if (batUI) {
    const body = $('.battery__body', batUI);
    let dragging = false;
    const fromX = (x) => {
      const r = body.getBoundingClientRect();
      const p = (x - r.left) / r.width;
      return Math.floor(Math.max(0, Math.min(0.999, p)) * 5) + 1;
    };
    batUI.addEventListener('pointerdown', (e) => {
      dragging = true;
      try { batUI.setPointerCapture(e.pointerId); } catch (err) {}
      setLevel(fromX(e.clientX), { save: true, haptic: true });
    });
    batUI.addEventListener('pointermove', (e) => { if (dragging) setLevel(fromX(e.clientX), { save: true, haptic: true }); });
    const stop = () => { dragging = false; };
    batUI.addEventListener('pointerup', stop);
    batUI.addEventListener('pointercancel', stop);
    batInput.addEventListener('input', () => setLevel(Number(batInput.value), { save: true }));
  }

  /* ---------- Scroll-driven pieces ---------- */
  const steps = $$('.step');
  const stepsBox = $('#noon-steps');
  const thread = $('#thread');
  const handH = $('#hand-h');
  const handM = $('#hand-m');
  const wedge = $('#clock-wedge');
  const nowTime = $('#noon-time');
  const nowWhat = $('#noon-what');
  const rules = $$('.rule');
  const reveals = $$('.reveal');
  let ticking = false;
  let tiltEls = [];
  const coarse = window.matchMedia('(hover: none)').matches;

  // The heading itself is watched; an inner wrapper is what gets wiped in
  reveals.forEach((el) => {
    const inner = document.createElement('span');
    inner.className = 'reveal__in';
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
  });

  function polar(angleDeg, r) {
    const a = (angleDeg - 90) * Math.PI / 180;
    return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
  }

  function drawClock(p) {
    const mins = p * 90;
    const hourAngle = (3 + mins / 60) * 30;
    const minAngle = (mins % 60) * 6;
    handH.setAttribute('transform', `rotate(${hourAngle.toFixed(2)} 100 100)`);
    handM.setAttribute('transform', `rotate(${minAngle.toFixed(2)} 100 100)`);
    const [x1, y1] = polar(90, 70);
    const [x2, y2] = polar(hourAngle, 70);
    wedge.setAttribute('d', mins < 0.5 ? '' : `M100 100 L${x1.toFixed(2)} ${y1.toFixed(2)} A70 70 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`);
    const total = 180 + Math.round(mins);
    nowTime.textContent = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}pm`;
  }

  function onScroll() {
    ticking = false;
    const vh = window.innerHeight;

    // A heading that has scrolled into view is always shown
    reveals.forEach((el) => {
      if (!el.classList.contains('in') && el.getBoundingClientRect().top < vh * 0.9) el.classList.add('in');
    });

    // On a phone there is no pointer to lean towards, so cards lean as they pass through the screen
    if (coarse && !reduce) {
      tiltEls.forEach((el, k) => {
        if (el.classList.contains('is-tilting')) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        const t = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - vh / 2) / (vh * 0.6)));
        el.style.setProperty('--rx', `${(t * 7).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(t * (k % 2 ? 3 : -3)).toFixed(2)}deg`);
      });
    }

    // House rules fill in, one line at a time
    rules.forEach((el) => { el.classList.toggle('is-on', el.getBoundingClientRect().top < vh * 0.7); });

    // The afternoon thread: an ink line fills as you scroll and the time keeps pace
    if (stepsBox && thread && steps.length) {
      const line = vh * 0.5;
      const box = stepsBox.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (line - box.top) / (box.height || 1)));
      thread.style.setProperty('--p', `${(p * 100).toFixed(2)}%`);
      const tops = steps.map((el) => el.getBoundingClientRect().top);
      const lastH = steps[steps.length - 1].getBoundingClientRect().height || 1;
      let current = 0;
      tops.forEach((t, k) => { if (t <= line) current = k; });
      const marks = [0, 20, 75, 90];
      const span = current < steps.length - 1 ? tops[current + 1] - tops[current] : lastH;
      const local = Math.max(0, Math.min(1, (line - tops[current]) / (span || 1)));
      const total = 180 + Math.round(marks[current] + (marks[current + 1] - marks[current]) * local);
      if (nowTime) nowTime.textContent = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}pm`;
      steps.forEach((el, k) => el.classList.toggle('is-now', k === current));
    }
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  onScroll();

  /* ---------- Thumb bar ---------- */
  if ('IntersectionObserver' in window) {
    const bar = $('#bar');
    const watch = [$('#hero-book'), $('#tickets-book'), $('.foot__cols')].filter(Boolean);
    const seen = new Map();
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting));
      const anyVisible = [...seen.values()].some(Boolean);
      const on = !anyVisible && window.scrollY > 200;
      bar.classList.toggle('is-on', on);
      bar.setAttribute('aria-hidden', on ? 'false' : 'true');
      $$('a', bar).forEach((a) => { a.tabIndex = on ? 0 : -1; });
    }, { threshold: 0.01 });
    watch.forEach((el) => barIO.observe(el));
  }

  /* ---------- Tactile cards ---------- */
  if (!reduce) {
    $$('.print:not(.print--step), .next, .sleeve__btn, .know__tickets, .rules__note, .frame').forEach((el) => {
      el.classList.add('tilt');
      const lean = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-py * 7).toFixed(2)}deg`);
        el.style.setProperty('--lift', '-4px');
        el.classList.add('is-tilting');
      };
      const rest = () => {
        el.classList.remove('is-tilting');
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--lift', '0px');
      };
      el.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') lean(e); });
      el.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') lean(e); });
      el.addEventListener('pointerleave', rest);
      el.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') setTimeout(rest, 220); });
      el.addEventListener('pointercancel', rest);
    });
    tiltEls = $$('.tilt');
    requestTick();
  }

  /* ---------- Light: drifting motes, and a small star where you touch ---------- */
  if (!reduce) {
    const motes = $('#motes');
    if (motes) {
      let html = '';
      for (let k = 0; k < 16; k++) {
        const size = 5 + ((k * 7) % 6);
        html += `<i style="--x:${(4 + (k * 61) % 92)}%;--s:${size}px;--t:${14 + (k * 5) % 13}s;--d:-${(k * 3.7).toFixed(1)}s;--dx:${((k % 2 ? 1 : -1) * (10 + (k * 9) % 34))}px"></i>`;
      }
      motes.innerHTML = html;
    }
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || root.classList.contains('door-closed')) return;
      if (e.target.closest('input, textarea, select')) return;
      const el = document.createElement('span');
      el.className = 'spark';
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0L59 41L100 50L59 59L50 100L41 59L0 50L41 41Z" fill="#E9B454"/><path d="M20 20L50 42L80 20L58 50L80 80L50 58L20 80L42 50Z" fill="#BF4317"/></svg>';
      document.body.appendChild(el);
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
    }, { passive: true });
  }

  /* ---------- Guest cards ---------- */
  $$('.sleeve').forEach((sleeve) => {
    const btn = $('.sleeve__btn', sleeve);
    btn.addEventListener('click', () => {
      const flipped = sleeve.classList.toggle('is-flipped');
      btn.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    });
  });

  /* ---------- Sign-up (preview only, nothing is sent) ---------- */
  const join = $('#join');
  if (join) {
    join.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#j-name').value.trim();
      const email = $('#j-email').value.trim();
      const ok = name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && $('#j-consent').checked;
      const err = $('#j-err');
      const done = $('#j-done');
      if (!ok) {
        err.textContent = $('#j-consent').checked
          ? 'Please add a name and a valid email address.'
          : 'Please add your name and email, and tick the box so we know it is okay to email you.';
        err.hidden = false;
        done.hidden = true;
        return;
      }
      err.hidden = true;
      done.hidden = false;
    });
  }
})();
