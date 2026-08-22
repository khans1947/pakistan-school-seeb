/**
 * Loads data/content.json and fills stats, ticker, and noticeboard.
 * Falls back to HTML defaults if fetch fails.
 */
(function () {
  'use strict';

  const DATA_URL = 'data/content.json';

  function setStats(stats) {
    if (!stats) return;
    const map = [
      { key: 'students', suffix: '+' },
      { key: 'faculty', suffix: '+' },
      { key: 'passRate', suffix: '%' },
      { key: 'grades', suffix: '' }
    ];
    const els = document.querySelectorAll('.stat-value[data-count]');
    // Order: students, faculty, passRate, grades
    const values = [stats.students, stats.faculty, stats.passRate, stats.grades];
    els.forEach((el, i) => {
      if (values[i] != null) {
        el.dataset.count = String(values[i]);
        if (map[i]) el.dataset.suffix = map[i].suffix;
        // Reset display so animation can run again if needed
        el.textContent = '0';
      }
    });
    // Re-trigger count animation
    animateStats();
  }

  function animateStats() {
    const stats = document.querySelectorAll('.stat-value[data-count]');
    stats.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      if (isNaN(target)) return;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current.toLocaleString() + suffix;
      }, 30);
    });
  }

  function setTicker(items) {
    const ticker = document.querySelector('.ticker');
    if (!ticker || !items || !items.length) return;
    // Duplicate for seamless loop
    const html = items.map(t => `<span class="ticker-item">${escapeHtml(t)}</span>`).join('');
    ticker.innerHTML = html + html;
  }

  function setNotices(notices) {
    const list = document.querySelector('.notice-list');
    if (!list || !notices) return;

    const catLabel = {
      exams: 'Exams',
      circulars: 'Circulars',
      events: 'Events',
      holidays: 'Holidays'
    };

    list.innerHTML = notices.map(n => {
      const high = n.priority === 'high' ? ' high' : '';
      const label = catLabel[n.category] || n.category;
      let icsBtn = '';
      if (n.icsStart) {
        const ics = JSON.stringify({
          title: n.title,
          start: n.icsStart,
          end: n.icsEnd || n.icsStart,
          desc: n.summary || '',
          location: 'Pakistan School Seeb'
        });
        icsBtn = `<button class="btn btn-sm btn-secondary mt-1" data-ics='${ics.replace(/'/g, '&#39;')}'>Add to Calendar</button>`;
      }
      return `
        <article class="glass-card notice-item" data-category="${escapeAttr(n.category)}">
          <div class="notice-date"><span class="day">${escapeHtml(n.day)}</span><span class="month">${escapeHtml(n.month)}</span></div>
          <div class="notice-body">
            <div class="notice-meta">
              <span class="notice-cat${high}">${escapeHtml(label)}</span>
              ${n.priority === 'high' ? '<span style="font-size:0.8rem;color:var(--text-muted)">Priority: High</span>' : ''}
            </div>
            <h4>${escapeHtml(n.title)}</h4>
            <p>${escapeHtml(n.summary || '')}</p>
            ${icsBtn}
          </div>
        </article>`;
    }).join('');

    // Re-bind ICS buttons
    list.querySelectorAll('[data-ics]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const data = JSON.parse(btn.getAttribute('data-ics'));
          const ics = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pakistan School Seeb//EN',
            'BEGIN:VEVENT',
            `DTSTART:${data.start}`,
            `DTEND:${data.end}`,
            `SUMMARY:${data.title}`,
            `DESCRIPTION:${data.desc || ''}`,
            `LOCATION:${data.location || 'Pakistan School Seeb'}`,
            'END:VEVENT', 'END:VCALENDAR'
          ].join('\r\n');
          const blob = new Blob([ics], { type: 'text/calendar' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${(data.title || 'event').replace(/\s+/g, '-')}.ics`;
          a.click();
          URL.revokeObjectURL(url);
          if (window.showToast) showToast('Event added to your calendar!');
        } catch (e) {}
      });
    });

    // Re-bind filter if search exists
    if (typeof window.rebindNoticeFilters === 'function') {
      window.rebindNoticeFilters();
    }
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
  }

  fetch(DATA_URL + '?t=' + Date.now())
    .then(r => {
      if (!r.ok) throw new Error('no data');
      return r.json();
    })
    .then(data => {
      setStats(data.stats);
      setTicker(data.ticker);
      setNotices(data.notices);
    })
    .catch(() => {
      // Keep hardcoded HTML content; still animate stats
      animateStats();
    });
})();
