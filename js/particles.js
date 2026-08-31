/**
 * Pakistan School Seeb — interactive particle mesh
 * Smooth cursor field, linked nodes, soft glow (desktop only)
 */
(function () {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch =
    window.matchMedia('(pointer: coarse)').matches ||
    window.innerWidth < 768;

  if (prefersReduced || isTouch) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let lastTs = 0;

  // Smoothed pointer (lerp) for fluid reaction
  const pointer = {
    x: -9999,
    y: -9999,
    tx: -9999,
    ty: -9999,
    active: false
  };

  const CONFIG = {
    density: 16000, // px² per particle
    maxCount: 110,
    minCount: 48,
    linkDist: 130,
    linkDistSq: 130 * 130,
    influence: 150,
    influenceSq: 150 * 150,
    attract: 0.028,
    repel: 0.55,
    drift: 0.22,
    friction: 0.96,
    sizeMin: 1.2,
    sizeMax: 2.6,
    pointerLerp: 0.12
  };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn() {
    const area = width * height;
    const count = Math.max(
      CONFIG.minCount,
      Math.min(CONFIG.maxCount, Math.floor(area / CONFIG.density))
    );
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.drift,
        vy: (Math.random() - 0.5) * CONFIG.drift,
        size: CONFIG.sizeMin + Math.random() * (CONFIG.sizeMax - CONFIG.sizeMin),
        phase: Math.random() * Math.PI * 2,
        pulse: 0.6 + Math.random() * 0.4
      });
    }
  }

  function theme() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) {
      return {
        core: [0, 200, 110],
        line: [0, 168, 89],
        glow: [74, 222, 128],
        aura: 0.14
      };
    }
    // Match soft green hero
    return {
      core: [255, 255, 255],
      line: [0, 102, 43],
      glow: [0, 168, 89],
      aura: 0.16
    };
  }

  function wrap(p) {
    const m = 40;
    if (p.x < -m) p.x = width + m;
    if (p.x > width + m) p.x = -m;
    if (p.y < -m) p.y = height + m;
    if (p.y > height + m) p.y = -m;
  }

  function draw(ts) {
    const dt = Math.min(32, ts - lastTs || 16) / 16;
    lastTs = ts;

    // Smooth pointer toward target
    if (pointer.active) {
      pointer.x += (pointer.tx - pointer.x) * CONFIG.pointerLerp;
      pointer.y += (pointer.ty - pointer.y) * CONFIG.pointerLerp;
    }

    ctx.clearRect(0, 0, width, height);
    const col = theme();

    // Cursor glow removed (cleaner UI)

    // Physics
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.phase += 0.015 * dt;

      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < CONFIG.influenceSq && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          // Near: gentle push out; mid-range: slight pull into orbit
          if (dist < 55) {
            const f = ((55 - dist) / 55) * CONFIG.repel * dt;
            p.vx += nx * f;
            p.vy += ny * f;
          } else {
            const f = ((CONFIG.influence - dist) / CONFIG.influence) * CONFIG.attract * dt;
            p.vx -= nx * f;
            p.vy -= ny * f;
          }
          p.pulse = Math.min(1.6, p.pulse + 0.04);
        }
      }

      p.vx += (Math.random() - 0.5) * 0.01 * dt;
      p.vy += (Math.random() - 0.5) * 0.01 * dt;
      p.vx *= CONFIG.friction;
      p.vy *= CONFIG.friction;
      // Cap speed
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > 2.2) {
        p.vx = (p.vx / sp) * 2.2;
        p.vy = (p.vy / sp) * 2.2;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.pulse += (1 - p.pulse) * 0.03;
      wrap(p);
    }

    // Links
    ctx.lineCap = 'round';
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > CONFIG.linkDistSq) continue;
        const dist = Math.sqrt(distSq);
        let alpha = (1 - dist / CONFIG.linkDist) * 0.35;

        // Brighten links near cursor
        if (pointer.active) {
          const mx = (a.x + b.x) * 0.5;
          const my = (a.y + b.y) * 0.5;
          const md = Math.hypot(mx - pointer.x, my - pointer.y);
          if (md < CONFIG.influence) {
            alpha += (1 - md / CONFIG.influence) * 0.35;
          }
        }

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${col.line[0]},${col.line[1]},${col.line[2]},${Math.min(0.55, alpha)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    }

    // Nodes
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const breathe = 0.85 + Math.sin(p.phase) * 0.15;
      let r = p.size * breathe * p.pulse;
      let near = false;

      if (pointer.active) {
        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (d < CONFIG.influence) {
          near = true;
          r *= 1 + (1 - d / CONFIG.influence) * 0.55;
        }
      }

      // Glow
      if (near || p.pulse > 1.05) {
        const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
        gg.addColorStop(0, `rgba(${col.glow[0]},${col.glow[1]},${col.glow[2]},0.35)`);
        gg.addColorStop(1, 'transparent');
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = near
        ? `rgba(${col.glow[0]},${col.glow[1]},${col.glow[2]},0.95)`
        : `rgba(${col.core[0]},${col.core[1]},${col.core[2]},0.7)`;
      ctx.fill();
    }

    animationId = requestAnimationFrame(draw);
  }

  function onMove(e) {
    pointer.tx = e.clientX;
    pointer.ty = e.clientY;
    if (!pointer.active) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }
    pointer.active = true;
  }

  function onLeave() {
    pointer.active = false;
    pointer.tx = -9999;
    pointer.ty = -9999;
  }

  resize();
  spawn();
  animationId = requestAnimationFrame(draw);

  window.addEventListener(
    'resize',
    function () {
      resize();
      spawn();
    },
    { passive: true }
  );
  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  window.addEventListener('blur', onLeave);
})();
