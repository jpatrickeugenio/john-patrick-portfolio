(() => {
  const $ = id => document.getElementById('zid-' + id);
  const box = $('lanyard'), card = $('id');
  if (!box || !card) return;
  const side = ['L','R'];

  // Tweak these to change the feel
  const REST_TOP = 270;      // how far the card hangs below the top
  const STIFFNESS = 0.045;   // higher = snaps back faster
  const DAMPING = 0.92;      // lower = stops swinging sooner
  const MAX_DRAG = 140;      // how far you can pull the card

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const getScale = () => parseFloat(getComputedStyle(box).getPropertyValue('--zid-scale')) || 1;
  let W = box.clientWidth, cardW = card.offsetWidth;
  let x = 0, y = 0, vx = 0, vy = 0, drag = false, sx = 0, sy = 0, lx = 0, ly = 0, running = false;

  function layout() {
    W = box.clientWidth; cardW = card.offsetWidth;
    card.style.left = (W - cardW) / 2 + 'px';
    card.style.top = REST_TOP + 'px';
    draw();
  }

  const ang = (tx, ty) => Math.atan2(-tx, ty) * 180 / Math.PI;  // rotate local +y onto direction (tx,ty)

  function draw() {
    const cx = W / 2 + x, cy = REST_TOP + y + 12;
    const sag = 40 + Math.abs(x) * 0.15;
    side.forEach((s, i) => {
      const ax = W / 2 + (i ? 60 : -60), ay = -20, ex = cx + (i ? 6 : -6);
      const qx = (ax + ex) / 2 + x * 0.2, qy = cy / 2 + sag;
      const d = `M${ax},${ay} Q${qx},${qy} ${ex},${cy}`;
      ['edge','peach','strap'].forEach(n => $(n + s).setAttribute('d', d));
      $('t' + s).setAttribute('d', `M${ex},${cy} Q${qx},${qy} ${ax},${ay}`);   // reversed, so text reads upward
      $('top' + s).setAttribute('transform', `translate(${ax},${ay}) rotate(${ang(qx - ax, qy - ay)})`);
      $('bot' + s).setAttribute('transform', `translate(${ex},${cy}) rotate(${ang(ex - qx, cy - qy)})`);
    });
    const rot = Math.max(-28, Math.min(28, x / 6 + vx * 0.6));
    card.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg)`;
    card.style.setProperty('--zid-sheen', (50 + rot * 3) + '%');
  }

  // The loop only runs while the card is moving, so it costs nothing when idle.
  function start() { if (!running) { running = true; requestAnimationFrame(tick); } }
  function tick() {
    if (!drag) {
      vx += -STIFFNESS * x; vy += -STIFFNESS * y;
      vx *= DAMPING; vy *= DAMPING;
      x += vx; y += vy;
      if (Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) < 0.02) {
        x = y = vx = vy = 0; draw(); running = false; return;
      }
    }
    draw();
    requestAnimationFrame(tick);
  }
  const kick = n => { vx += n; start(); };

  card.addEventListener('pointerdown', e => {
    drag = true; card.classList.add('zid-dragging'); card.setPointerCapture(e.pointerId);
    const k = getScale(); sx = e.clientX - x * k; sy = e.clientY - y * k; lx = e.clientX; ly = e.clientY; start();
  });
  card.addEventListener('pointermove', e => {
    if (!drag) return;
    const k = getScale();
    let nx = (e.clientX - sx) / k, ny = (e.clientY - sy) / k;
    const dist = Math.hypot(nx, ny);
    if (dist > MAX_DRAG) { nx *= MAX_DRAG / dist; ny *= MAX_DRAG / dist; }
    vx = (e.clientX - lx) / k * 0.6; vy = (e.clientY - ly) / k * 0.6;
    x = nx; y = ny; lx = e.clientX; ly = e.clientY;
  });
  const release = () => { drag = false; card.classList.remove('zid-dragging'); start(); };
  card.addEventListener('pointerup', release);
  card.addEventListener('pointercancel', release);
  card.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); kick(-8); }
    if (e.key === 'ArrowRight') { e.preventDefault(); kick(8); }
  });

  window.addEventListener('resize', layout);
  layout();

  // Give the card one small swing when the welcome loader finishes.
  if (!reduceMotion) {
    const loader = document.getElementById('loader');
    const done = () => !loader || /\b(is-hidden|loader-hidden)\b/.test(loader.className);
    if (done()) kick(7);
    else new MutationObserver((_, o) => {
      if (done()) { o.disconnect(); setTimeout(() => kick(7), 250); }
    }).observe(loader, { attributes: true, attributeFilter: ['class'] });
  }
})();