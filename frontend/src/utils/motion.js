// ═══════════════════════════════════════════════════════════════
//  SentinelPay – AI Neural Motion Engine
// ═══════════════════════════════════════════════════════════════

// ── Neural Network Canvas ────────────────────────────────────
export function initNeuralCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'neural-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;

  const COLORS = {
    node:    'rgba(0,255,163,',
    link:    'rgba(0,255,163,',
    pulse:   '#00ffa3',
    purple:  'rgba(168,85,247,',
    cyan:    'rgba(0,212,255,',
  };

  /* ── Resize ── */
  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };

  /* ── Node ── */
  class Node {
    constructor() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 2 + 1;
      this.color = Math.random() > 0.7 ? COLORS.purple : Math.random() > 0.5 ? COLORS.cyan : COLORS.node;
      this.alpha = Math.random() * 0.5 + 0.3;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update(t) {
      this.x += this.vx;
      this.y += this.vy;
      // Soft bounce
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      // Gentle pulse in size
      this.pulseR = this.r + Math.sin(t * 0.002 + this.pulsePhase) * 0.6;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.pulseR, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.fill();

      // Halo
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.pulseR + 3, 0, Math.PI * 2);
      ctx.strokeStyle = `${this.color}${this.alpha * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  /* ── Signal Pulse ── */
  class Pulse {
    constructor(from, to) {
      this.from = from;
      this.to   = to;
      this.t    = 0;          // 0→1 progress
      this.speed = 0.008 + Math.random() * 0.006;
      this.alive = true;
    }

    update() {
      this.t += this.speed;
      if (this.t >= 1) this.alive = false;
    }

    draw() {
      const x = this.from.x + (this.to.x - this.from.x) * this.t;
      const y = this.from.y + (this.to.y - this.from.y) * this.t;
      const alpha = Math.sin(this.t * Math.PI) * 0.9;

      // Leading dot
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,163,${alpha})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,163,${alpha * 0.3})`;
      ctx.fill();

      // Trail
      const trail = 0.12;
      const tx = this.from.x + (this.to.x - this.from.x) * Math.max(0, this.t - trail);
      const ty = this.from.y + (this.to.y - this.from.y) * Math.max(0, this.t - trail);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = `rgba(0,255,163,${alpha * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  /* ── Link drawing ── */
  const MAX_DIST = 180;

  const drawLinks = (t) => {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          // Animated dash offset for "data flowing" look
          ctx.save();
          ctx.setLineDash([4, 6]);
          ctx.lineDashOffset = -t * 0.04;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,255,163,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  };

  /* ── Init ── */
  const COUNT = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 14000), 70);
  let pulses = [];
  let lastPulse = 0;

  const init = () => {
    nodes = Array.from({ length: COUNT }, () => new Node());
  };

  /* ── Loop ── */
  const loop = (t) => {
    ctx.clearRect(0, 0, W, H);

    drawLinks(t);
    nodes.forEach(n => { n.update(t); n.draw(); });

    // Spawn pulses periodically
    if (t - lastPulse > 600 + Math.random() * 800) {
      lastPulse = t;
      const i = Math.floor(Math.random() * nodes.length);
      let j;
      do { j = Math.floor(Math.random() * nodes.length); } while (j === i);
      pulses.push(new Pulse(nodes[i], nodes[j]));
    }

    pulses.forEach(p => { p.update(); p.draw(); });
    pulses = pulses.filter(p => p.alive);

    animId = requestAnimationFrame(loop);
  };

  resize();
  init();
  animId = requestAnimationFrame(loop);
  window.addEventListener('resize', () => { resize(); init(); });

  return () => {
    cancelAnimationFrame(animId);
    canvas.remove();
  };
}

// ── Animated Number Counter ──────────────────────────────────
export function animateCounter(from, to, duration, setter) {
  if (from === to) { setter(to); return; }
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    // ease-out-expo
    const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    setter(Math.round(from + (to - from) * e));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── Typewriter Effect ────────────────────────────────────────
// Pass a setter(string), array of strings to cycle through
export function typewriter(strings, setter, { speed = 55, pause = 1800 } = {}) {
  let si = 0, ci = 0, deleting = false;
  let id;

  const tick = () => {
    const full = strings[si];
    if (!deleting) {
      ci++;
      setter(full.slice(0, ci));
      if (ci >= full.length) {
        deleting = true;
        id = setTimeout(tick, pause);
        return;
      }
    } else {
      ci--;
      setter(full.slice(0, ci));
      if (ci === 0) {
        deleting = false;
        si = (si + 1) % strings.length;
      }
    }
    id = setTimeout(tick, deleting ? speed * 0.5 : speed);
  };

  id = setTimeout(tick, 400);
  return () => clearTimeout(id);
}
