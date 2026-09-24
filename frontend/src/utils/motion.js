// ── Floating Particle System ─────────────────────────────────
export function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const COLORS = [
    'rgba(0,255,163,',
    'rgba(168,85,247,',
    'rgba(0,212,255,',
  ];

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.y < -10 || this.life > this.maxLife) this.reset();
    }
    draw() {
      const alpha = this.opacity * Math.sin((this.life / this.maxLife) * Math.PI);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${alpha.toFixed(2)})`;
      ctx.fill();
    }
  }

  const init = () => {
    particles = Array.from({ length: 90 }, () => new Particle());
  };

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  };

  resize();
  init();
  loop();
  window.addEventListener('resize', () => { resize(); });

  return () => {
    cancelAnimationFrame(animId);
    canvas.remove();
    window.removeEventListener('resize', resize);
  };
}

// ── Animated Number Counter ──────────────────────────────────
export function animateCounter(from, to, duration, setter) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out-expo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.round(from + (to - from) * eased);
    setter(current);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── Staggered reveal on scroll ───────────────────────────────
export function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Pause all .reveal elements and play on scroll-in
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    el.style.animationPlayState = 'paused';
    obs.observe(el);
  });
}
