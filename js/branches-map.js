/**
 * Interactive PSM branches map — side panel details
 */
(function () {
  'use strict';

  const ROOT = document.getElementById('branches-map-root');
  if (!ROOT) return;

  let campuses = [];
  const legend = document.getElementById('branch-legend');
  const sideEmpty = document.getElementById('branch-side-empty');
  const sideDetail = document.getElementById('branch-side-detail');

  const tooltip = document.createElement('div');
  tooltip.className = 'branch-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.appendChild(tooltip);

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function loadData() {
    try {
      const res = await fetch('data/branches.json', { cache: 'no-cache' });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  }

  function ensureInlineSvg(cb) {
    let svg = ROOT.querySelector('svg');
    if (svg && svg.querySelector('#features, #land, path')) {
      cb(svg);
      return;
    }
    fetch('assets/map-oman.svg')
      .then((r) => r.text())
      .then((text) => {
        const box = document.createElement('div');
        box.innerHTML = text.trim();
        const el = box.querySelector('svg');
        if (!el) return;
        el.classList.add('branches-inline');
        el.removeAttribute('width');
        el.removeAttribute('height');
        el.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        ROOT.innerHTML = '';
        ROOT.appendChild(el);
        cb(el);
      })
      .catch(console.warn);
  }

  function renderPins(svg) {
    let layer = svg.querySelector('#map-pins');
    if (!layer) {
      layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      layer.setAttribute('id', 'map-pins');
      svg.appendChild(layer);
    }
    while (layer.firstChild) layer.removeChild(layer.firstChild);

    const scale = 1.2;

    campuses.forEach((c) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'svg-branch-pin' + (c.highlight ? ' is-here' : ''));
      g.setAttribute('data-id', c.id);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', c.name + ' — view details');
      const base =
        'translate(' + c.coords.x + ',' + c.coords.y + ') scale(' + scale + ') translate(-12,-32)';
      g.setAttribute('transform', base);
      g.dataset.baseTransform = base;

      g.innerHTML =
        '<ellipse cx="12" cy="31.5" rx="3.5" ry="1.4" fill="#000" opacity="0.18"></ellipse>' +
        '<path d="M12 1.2C7.03 1.2 3 5.23 3 10.2c0 6.2 9 16.3 9 16.3s9-10.1 9-16.3c0-4.97-4.03-9-9-9z" fill="#C81E3A" stroke="#7a0f22" stroke-width="1"></path>' +
        '<circle cx="12" cy="10.2" r="5.1" fill="#fff"></circle>' +
        '<image href="assets/school-logo-pin.png" x="7.4" y="5.6" width="9.2" height="9.2" preserveAspectRatio="xMidYMid slice"></image>' +
        '<circle cx="12" cy="14" r="16" fill="transparent"></circle>';

      bindPin(g, c);
      layer.appendChild(g);
    });
  }

  
  function pulsePin(el) {
    if (!el) return;
    el.classList.remove('is-pulse');
    // reflow so animation can restart
    void el.getBoundingClientRect();
    el.classList.add('is-pulse');
    const base = el.dataset.baseTransform || el.getAttribute('transform') || '';
    el.setAttribute(
      'transform',
      base + ' translate(12,32) scale(1.22) translate(-12,-32)'
    );
    window.clearTimeout(el._pulseTimer);
    el._pulseTimer = window.setTimeout(function () {
      el.classList.remove('is-pulse');
      if (!el.classList.contains('is-selected')) {
        el.setAttribute('transform', el.dataset.baseTransform || base);
      } else {
        el.setAttribute(
          'transform',
          (el.dataset.baseTransform || base) + ' translate(12,32) scale(1.1) translate(-12,-32)'
        );
      }
    }, 420);
  }

  function bindPin(el, c) {
    el.addEventListener('mouseenter', (e) => {
      showTip(c, e);
      showSide(c);
      el.setAttribute(
        'transform',
        el.dataset.baseTransform + ' translate(12,32) scale(1.14) translate(-12,-32)'
      );
      setActivePin(c.id);
    });
    el.addEventListener('mousemove', moveTip);
    el.addEventListener('mouseleave', () => {
      hideTip();
      el.setAttribute('transform', el.dataset.baseTransform);
    });
    el.addEventListener('focus', () => {
      showSide(c);
      setActivePin(c.id);
    });
    el.addEventListener('click', () => {
      pulsePin(el);
      showSide(c);
      setActivePin(c.id);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pulsePin(el);
        showSide(c);
        setActivePin(c.id);
      }
    });
  }

  function setActivePin(id) {
    document.querySelectorAll('.svg-branch-pin').forEach((p) => {
      p.classList.toggle('is-selected', p.getAttribute('data-id') === id);
    });
    document.querySelectorAll('.branch-chip').forEach((p) => {
      p.classList.toggle('is-selected', p.getAttribute('data-id') === id);
    });
  }

  let sideAnimTimer = null;
  let currentSideId = null;

  function buildSideHTML(c) {
    const phoneOk = c.phone && String(c.phone).indexOf('XX') === -1;
    const chips = (c.highlights || []).map(function (h) {
      return '<span class="side-chip">' + esc(h) + '</span>';
    }).join('');
    return (
      '<div class="branch-side-layer-inner">' +
      '<div class="branch-side-hero">' +
      '<img class="branch-side-hero-img" src="' + esc(c.image || 'assets/campus-photo.jpg') + '" alt="' + esc(c.name || 'Campus') + '" loading="lazy" decoding="async"/>' +
      '<div class="branch-side-hero-fade" aria-hidden="true"></div>' +
      '<div class="branch-side-badge" aria-hidden="true">' +
      '<img class="branch-side-badge-logo" src="assets/school-logo-pin.png" alt="" width="48" height="48" decoding="async"/>' +
      '</div></div>' +
      (c.highlight ? '<span class="network-pill">Our campus</span>' : '') +
      '<h3>' + esc(c.name) + '</h3>' +
      (chips ? '<div class="side-chips">' + chips + '</div>' : '') +
      '<p class="branch-side-blurb">' + esc(c.blurb || '') + '</p>' +
      '<div class="branch-side-grid">' +
      '<div><span class="lbl">Curriculum</span><strong>' + esc(c.curriculum || 'FBISE') + '</strong></div>' +
      '<div><span class="lbl">Grades</span><strong>' + esc(c.grades || '—') + '</strong></div>' +
      '</div>' +
      '<dl class="branch-side-meta">' +
      '<div><dt>Address</dt><dd>' + esc(c.address) + '</dd></div>' +
      '<div><dt>Phone</dt><dd>' +
      (phoneOk
        ? '<a href="tel:' + esc(String(c.phone).replace(/\s/g, '')) + '">' + esc(c.phone) + '</a>'
        : esc(c.phone || '—')) +
      '</dd></div>' +
      '<div><dt>Email</dt><dd><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></dd></div>' +
      '<div><dt>Established</dt><dd>' + esc(c.established || '—') + '</dd></div>' +
      '</dl>' +
      '<a class="btn btn-primary btn-sm branch-side-cta" href="' + esc(c.link) + '"' +
      (String(c.link).indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') +
      '>Visit Branch Page</a>' +
      '</div>'
    );
  }

  function showSide(c) {
    if (!sideDetail || !c) return;
    if (currentSideId === c.id && sideDetail.querySelector('.branch-side-layer-inner')) return;
    currentSideId = c.id;

    if (sideEmpty) sideEmpty.hidden = true;
    sideDetail.hidden = false;

    const html = buildSideHTML(c);
    if (sideAnimTimer) clearTimeout(sideAnimTimer);

    // First load
    if (!sideDetail.querySelector('.branch-side-layer-inner')) {
      sideDetail.innerHTML = html;
      sideDetail.classList.remove('is-switching', 'is-out');
      sideDetail.classList.add('is-ready', 'is-animate-in');
      return;
    }

    // Right panel: slide/fade out → swap → slide/fade in
    sideDetail.classList.remove('is-ready', 'is-animate-in');
    sideDetail.classList.add('is-switching', 'is-out');

    sideAnimTimer = setTimeout(function () {
      sideDetail.innerHTML = html;
      sideDetail.classList.remove('is-out');
      // force reflow
      void sideDetail.offsetWidth;
      sideDetail.classList.remove('is-switching');
      sideDetail.classList.add('is-ready', 'is-animate-in');
    }, 220);
  }




  function renderLegend() {
    if (!legend) return;
    legend.innerHTML = campuses
      .map((c) => {
        const label = c.name
          .replace(/^PSM\s+/, '')
          .replace(/\s+Branch$/, '')
          .replace(/\s+Main Campus.*/, 'Muscat');
        return (
          '<button type="button" class="branch-chip' +
          (c.highlight ? ' is-here' : '') +
          '" data-id="' +
          esc(c.id) +
          '">' +
          esc(label) +
          '</button>'
        );
      })
      .join('');
    legend.querySelectorAll('.branch-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const c = campuses.find((x) => x.id === btn.dataset.id);
        if (c) {
          showSide(c);
          setActivePin(c.id);
        }
      });
    });
  }

  function showTip(c, e) {
    tooltip.hidden = false;
    const tag = c.highlight ? '<span class="tip-tag">Our campus</span>' : '';
    tooltip.innerHTML =
      '<div class="tip-title">' + esc(c.name) + tag + '</div>' +
      '<div class="tip-blurb">' + esc(c.blurb || c.address || '') + '</div>' +
      '<div class="tip-cta">Details on the right →</div>';
    moveTip(e);
  }
  function moveTip(e) {
    if (tooltip.hidden) return;
    const x = e.clientX || 0;
    const y = e.clientY || 0;
    const tw = tooltip.offsetWidth || 100;
    const th = tooltip.offsetHeight || 24;
    let left = x + 12;
    let top = y - th - 8;
    if (left + tw > window.innerWidth - 8) left = x - tw - 12;
    if (top < 8) top = y + 14;
    tooltip.style.transform = 'translate(' + left + 'px,' + top + 'px)';
  }
  function hideTip() {
    tooltip.hidden = true;
  }

  (async function init() {
    campuses = await loadData();
    ensureInlineSvg((svg) => renderPins(svg));
    renderLegend();
    // Default: show Seeb (this campus)
    const seeb = campuses.find((c) => c.highlight) || campuses[0];
    if (seeb) {
      showSide(seeb);
      setActivePin(seeb.id);
    }
  })();
})();
