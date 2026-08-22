/**
 * Pakistan School Seeb - Interactive Particle Mesh Background
 * GPU-friendly canvas system with cursor repulsion & aurora glow
 */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // Skip heavy particles on touch / mobile
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  if (isTouch) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height, particles = [], mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
  let lastMouse = { x: 0, y: 0 };
  let animationId;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const CONFIG = {
    particleCount: 90,
    connectionDist: 140,
    mouseRadius: 160,
    repulsion: 0.8,
    baseSpeed: 0.35,
    particleSize: 1.8,
    glowSize: 6,
  };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles = [];
    const count = Math.min(CONFIG.particleCount, Math.floor((width * height) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.baseSpeed,
        vy: (Math.random() - 0.5) * CONFIG.baseSpeed,
        size: CONFIG.particleSize + Math.random() * 1.2,
        alpha: 0.4 + Math.random() * 0.5,
      });
    }
  }

  function getThemeColor() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark
      ? { r: 0, g: 168, b: 89, a: 0.7 }
      : { r: 0, g: 102, b: 43, a: 0.55 };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const col = getThemeColor();

    // Soft aurora glow following mouse
    if (mouse.x > 0) {
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
      grad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0.12)`);
      grad.addColorStop(0.5, `rgba(${col.r}, ${col.g}, ${col.b}, 0.04)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * CONFIG.repulsion;
        p.vy += Math.sin(angle) * force * CONFIG.repulsion;
      }

      // Velocity damping + base drift
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vx += (Math.random() - 0.5) * 0.02;
      p.vy += (Math.random() - 0.5) * 0.02;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      // Draw particle with glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${p.alpha})`;
      ctx.fill();

      // Soft glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * CONFIG.glowSize, 0, Math.PI * 2);
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * CONFIG.glowSize);
      glow.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${p.alpha * 0.25})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fill();
    }

    // Connections
    ctx.lineWidth = 0.8;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectionDist) {
          const alpha = (1 - dist / CONFIG.connectionDist) * 0.35 * col.a;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
          ctx.stroke();
        }
      }
    }

    // Subtle grid ripple near mouse
    if (mouse.x > 0) {
      const gridSize = 50;
      ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.06)`;
      ctx.lineWidth = 0.5;
      const startX = Math.floor((mouse.x - 200) / gridSize) * gridSize;
      const startY = Math.floor((mouse.y - 200) / gridSize) * gridSize;
      for (let gx = startX; gx < mouse.x + 200; gx += gridSize) {
        for (let gy = startY; gy < mouse.y + 200; gy += gridSize) {
          const ddx = gx - mouse.x;
          const ddy = gy - mouse.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 180) {
            const offset = Math.sin(d * 0.04 - Date.now() * 0.003) * (1 - d / 180) * 4;
            ctx.beginPath();
            ctx.arc(gx + offset, gy + offset, 1.5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  function onMouseMove(e) {
    mouse.vx = e.clientX - lastMouse.x;
    mouse.vy = e.clientY - lastMouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
  }

  function onMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  // Init
  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseleave', onMouseLeave);

  // Observe theme changes
  const observer = new MutationObserver(() => {});
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
