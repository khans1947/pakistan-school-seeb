/**
 * Pakistan School Seeb - Core Interactions
 */
(function () {
  'use strict';

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('pss-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);

  function updateThemeIcon() {
    if (!themeToggle) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark
      ? '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('pss-theme', next);
      updateThemeIcon();
    });
  }

  // ===== Mobile Menu =====
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  // ===== Navbar scroll =====
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ===== Tabs =====
  document.querySelectorAll('[data-tabs]').forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = container.querySelector(`[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });

  // ===== Noticeboard Filter =====
  const noticeSearch = document.getElementById('notice-search');
  const noticeChips = document.querySelectorAll('.filter-chips .chip');
  const noticeItems = document.querySelectorAll('.notice-item');
  let activeCategory = 'all';

  function filterNotices() {
    const q = (noticeSearch?.value || '').toLowerCase().trim();
    noticeItems.forEach(item => {
      const cat = item.dataset.category || '';
      const text = item.textContent.toLowerCase();
      const matchCat = activeCategory === 'all' || cat === activeCategory;
      const matchQ = !q || text.includes(q);
      item.style.display = matchCat && matchQ ? '' : 'none';
    });
  }

  if (noticeSearch) noticeSearch.addEventListener('input', filterNotices);
  noticeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      noticeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.filter || 'all';
      filterNotices();
    });
  });

  // ===== Testimonial Slider =====
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.slider-dots .dot');
  let currentSlide = 0;
  if (track && dots.length) {
    function goToSlide(i) {
      currentSlide = i;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    }
    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
    setInterval(() => goToSlide((currentSlide + 1) % dots.length), 6000);
  }

  // ===== Gallery Filter & Lightbox =====
  const galleryFilters = document.querySelectorAll('.gallery-filters .chip');
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryFilters.forEach(chip => {
    chip.addEventListener('click', () => {
      galleryFilters.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter || 'all';
      galleryItems.forEach(item => {
        const cat = item.dataset.category || '';
        item.style.display = filter === 'all' || cat === filter ? '' : 'none';
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (!lightbox) return;
      const title = item.dataset.title || '';
      const emoji = item.querySelector('.gallery-placeholder')?.textContent || '📷';
      lightboxContent.innerHTML = `
        <div class="placeholder">${emoji}</div>
        <h3 style="color:white;margin-bottom:0.5rem">${title}</h3>
        <p style="color:rgba(255,255,255,0.7)">${item.dataset.date || ''}</p>
      `;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  if (lightbox) {
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }
  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ===== Quick Portal Modal =====
  const portalBtn = document.getElementById('portal-btn');
  const portalModal = document.getElementById('portal-modal');
  if (portalBtn && portalModal) {
    portalBtn.addEventListener('click', () => {
      portalModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    portalModal.querySelector('.modal-close')?.addEventListener('click', () => {
      portalModal.classList.remove('open');
      document.body.style.overflow = '';
    });
    portalModal.addEventListener('click', e => {
      if (e.target === portalModal) {
        portalModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== Principal Video Modal =====
  const videoBtn = document.getElementById('principal-video-btn');
  const videoModal = document.getElementById('video-modal');
  if (videoBtn && videoModal) {
    videoBtn.addEventListener('click', () => {
      videoModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    videoModal.querySelector('.modal-close')?.addEventListener('click', closeVideo);
    videoModal.addEventListener('click', e => { if (e.target === videoModal) closeVideo(); });
  }
  function closeVideo() {
    videoModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ===== Toast =====
  window.showToast = function (msg, duration = 4000) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  };

  // ===== Contact Form =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');
      let valid = true;
      [name, email, message].forEach(f => {
        if (!f.value.trim()) { f.classList.add('error'); valid = false; }
        else f.classList.remove('error');
      });
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        valid = false;
      }
      if (!valid) return;
      showToast('Thank you! Your inquiry has been received. We will respond shortly.');
      contactForm.reset();
    });
  }

  // ===== Active Nav Link =====
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ===== Animate stats on scroll =====
  const stats = document.querySelectorAll('.stat-value[data-count]');
  if (stats.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current.toLocaleString() + suffix;
          }, 30);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(s => observer.observe(s));
  }

  // ===== Add to Calendar (.ics) =====
  document.querySelectorAll('[data-ics]').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = JSON.parse(btn.dataset.ics);
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Pakistan School Seeb//EN',
        'BEGIN:VEVENT',
        `DTSTART:${data.start}`,
        `DTEND:${data.end}`,
        `SUMMARY:${data.title}`,
        `DESCRIPTION:${data.desc || ''}`,
        `LOCATION:${data.location || 'Pakistan School Seeb'}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      const blob = new Blob([ics], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.title.replace(/\s+/g, '-')}.ics`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Event added to your calendar!');
    });
  });
})();
