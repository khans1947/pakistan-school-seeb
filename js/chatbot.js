/**
 * Pakistan School Seeb — Site Content Assistant
 * Answers ONLY questions related to this website's content.
 * No external AI API (safe on GitHub Pages). Knowledge is embedded from site pages.
 */
(function () {
  'use strict';

  const WA = 'https://wa.me/96824464345?text=' + encodeURIComponent(
    'Assalamu Alaikum, I need help regarding Pakistan School Seeb.'
  );
  const PHONE = '+968 2446 4345';
  const PHONE2 = '+968 2446 8990';
  const EMAIL = 'principal.seeb@pakistanschool.edu.om';
  const MAP = 'https://maps.app.goo.gl/v7tvFpXM1BwE5kMU7';
  const MAIN = 'https://www.pakistanschool.edu.om/';
  const SITE = {
    name: 'Pakistan School Seeb',
    address: 'Building 356, Way 5889, Al Chradi, Al Seeb, Muscat, Sultanate of Oman',
    established: '21 August 2014',
    principal: 'Mr. Saqib Ali Shah',
    students: '1,300+',
    faculty: '85+',
    grades: 'KG to Grade 12',
    curricula: 'FBISE and Cambridge / IGCSE',
  };

  let lastTopic = null;
  let pendingQuestion = null;

  const GRADE_RE = /\b(kg|kindergarten|grade\s*([0-9]{1,2})|g\s*([0-9]{1,2})|class\s*([0-9]{1,2}))\b/i;

  function extractGrade(text) {
    const t = (text || '').trim();
    if (/^(kg|kindergarten)$/i.test(t)) return 'KG';
    if (/^\d{1,2}$/.test(t)) {
      const n = parseInt(t, 10);
      if (n >= 1 && n <= 12) return String(n);
    }
    const m = t.match(GRADE_RE);
    if (!m) return null;
    if (/kg|kindergarten/i.test(m[0])) return 'KG';
    const n = m[2] || m[3] || m[4];
    return n ? String(parseInt(n, 10)) : null;
  }

  function booksAnswer(grade) {
    if (grade) {
      return 'For <strong>Grade ' + grade + '</strong>, open <a href="books.html">Books &amp; Stock</a>, filter by that grade, and expand the set card for full-set and individual book prices/stock. Bookstore: Sunday–Thursday, 8:00 AM – 12:30 PM.';
    }
    return 'Check prices and stock on <a href="books.html">Books &amp; Stock</a>. Each grade has a full set — click a card for details. Bookstore: <strong>Sunday–Thursday, 8:00 AM – 12:30 PM</strong>.';
  }

  /** Knowledge base drawn from site pages only */
  const TOPICS = {
    books: {
      keys: ['book', 'books', 'textbook', 'stock', 'price list', 'bookstore', 'stationery', 'out of stock'],
      answer: (t) => {
        const g = extractGrade(t);
        if (g) { pendingQuestion = null; return booksAnswer(g); }
        pendingQuestion = 'grade';
        return booksAnswer(null) + follow('Which grade? Reply e.g. <strong>Grade 9</strong> or <strong>KG</strong>.');
      }
    },
    admissions: {
      keys: ['admission', 'admit', 'apply', 'enroll', 'enrol', 'registration', 'new student', 'how to apply', 'documents required', 'join school'],
      answer: () => {
        pendingQuestion = 'admission-grade';
        return 'Apply online on <a href="admissions.html">Admissions</a>: multi-step form (student, guardian, records, documents), then you get a <strong>tracking ID</strong>. Office: <strong>8:00 AM – 1:00 PM</strong> (Sun–Thu). <a href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a> or call ' + PHONE + '.' +
          follow('Which grade is the student joining?');
      }
    },
    documents: {
      keys: ['document', 'documents', 'civil id', 'passport', 'birth certificate', 'report card', 'what to bring'],
      answer: () =>
        'Typical uploads on the application: student photo / Civil ID copy, birth certificate or passport, previous school report (if any). Max ~2MB each (image or PDF). Originals are required at confirmation. Start at <a href="admissions.html">Admissions</a>.'
    },
    track: {
      keys: ['track', 'tracking', 'application status', 'status', 'tracking id', 'reference', 'where is my application'],
      answer: () =>
        'Enter your tracking ID (e.g. PSS-…) under <a href="admissions.html#track">Admissions → Application Status</a>. Use the same ID from your submission receipt.'
    },
    fees: {
      keys: ['fee', 'fees', 'tuition', 'payment', 'pay', 'transport', 'bus', 'calculator', 'invoice', 'how much'],
      answer: () =>
        'Use the <a href="admissions.html#fee">fee calculator</a> on Admissions for tuition + transport by grade and route. Figures are indicative — confirm with Accounts. Call ' + PHONE + ' or email ' + EMAIL + '.'
    },
    location: {
      keys: ['location', 'address', 'map', 'where', 'direction', 'visit', 'campus', 'how to reach', 'al seeb', 'seeb'],
      answer: () =>
        'We are at <strong>' + SITE.address + '</strong>. <a href="' + MAP + '" target="_blank" rel="noopener">Google Maps</a> · <a href="contact.html">Contact page</a>.'
    },
    timings: {
      keys: ['timing', 'timings', 'time', 'hours', 'open', 'school time', 'schedule', 'when open', 'weekend', 'friday'],
      answer: () =>
        'School: <strong>Sunday–Thursday, about 7:30 AM – 2:00 PM</strong>. Admissions: 8:00 AM – 1:00 PM. Bookstore: 8:00 AM – 12:30 PM. Weekend: Friday–Saturday.'
    },
    uniform: {
      keys: ['uniform', 'dress code', 'tie', 'clothes', 'pe kit'],
      answer: () =>
        'Uniforms and related items appear under Stationery on <a href="books.html">Books &amp; Stock</a> when available. Follow official circulars for dress code.'
    },
    contact: {
      keys: ['contact', 'phone', 'email', 'call', 'whatsapp', 'number', 'reach us', 'inquiry'],
      answer: () =>
        'Phone: <a href="tel:+96824464345">' + PHONE + '</a> / ' + PHONE2 + '<br>Email: <a href="mailto:' + EMAIL + '">' + EMAIL + '</a><br><a href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a> · <a href="contact.html">Contact form</a>'
    },
    curriculum: {
      keys: ['fbise', 'cambridge', 'igcse', 'curriculum', 'syllabus', 'stream', 'pathway', 'subject', 'board'],
      answer: () =>
        'We offer <strong>' + SITE.curricula + '</strong> pathways for ' + SITE.grades + '. See <a href="academics.html">Academics</a> or Home → Academic Streams.'
    },
    academics: {
      keys: ['academic', 'academics', 'teacher', 'faculty', 'calendar', 'exam schedule'],
      answer: () =>
        'Faculty directory, calendar, and pathways are on <a href="academics.html">Academics</a>. Notices for exams also appear on the Home noticeboard.'
    },
    notices: {
      keys: ['holiday', 'vacation', 'off', 'closed', 'notice', 'circular', 'exam', 'event calendar'],
      answer: () =>
        'Circulars, exams, and holidays: <a href="index.html#notices">Home → Live Noticeboard</a> or <a href="notices.html">Notices</a>. Filter by category.'
    },
    portals: {
      keys: ['portal', 'lms', 'login', 'parent portal', 'student portal', 'webmail'],
      answer: () =>
        'Use <strong>Portals</strong> in the site menu for Student LMS, Parent Portal, and staff webmail (external links).'
    },
    principal: {
      keys: ['principal', 'head', 'saqib', 'who is principal'],
      answer: () =>
        'Principal: <strong>' + SITE.principal + '</strong>. Welcome message on the Home page. Email: ' + EMAIL + '.'
    },
    about: {
      keys: ['about', 'history', 'established', 'when founded', 'heritage', 'who are you'],
      answer: () =>
        SITE.name + ' opened on <strong>' + SITE.established + '</strong> under the Pakistan School Muscat / Pakistan Schools Oman network, supervised by the Ministry of Education. About <strong>' + SITE.students + ' students</strong> and <strong>' + SITE.faculty + ' faculty</strong>.'
    },
    facilities: {
      keys: ['facility', 'facilities', 'lab', 'library', 'sport', 'stem', 'robotics', 'auditorium', 'ict'],
      answer: () =>
        'STEM labs, robotics, digital library, ICT, sports grounds, and auditorium — see Home → Facilities or open the <strong>Virtual Tour</strong> from the hero.'
    },
    network: {
      keys: ['network', 'branch', 'branches', 'sohar', 'nizwa', 'salalah', 'buraimi', 'musannah', 'muscat', 'mabelah', 'pakistan schools oman'],
      answer: () =>
        'Pakistan Schools Oman network: <strong>Muscat (Main), Seeb, Sohar, Musannah, Nizwa, Salalah, Buraimi</strong>, plus planned <strong>Mabelah</strong>. Interactive map on the Home page. Main portal: <a href="' + MAIN + '" target="_blank" rel="noopener">pakistanschool.edu.om</a>.'
    },
    stats: {
      keys: ['student', 'students', 'faculty', 'pass rate', 'strength', 'how many', 'enrolment', 'enrollment'],
      answer: () =>
        'About <strong>' + SITE.students + ' students</strong>, <strong>' + SITE.faculty + ' faculty</strong>, ' + SITE.grades + '. Live stats on the Home hero (may be updated by admin).'
    },
    gallery: {
      keys: ['gallery', 'photo', 'club', 'student life', 'activity', 'sports day', 'pakistan day'],
      answer: () =>
        'Photos and clubs: <a href="gallery.html">Student Life / Gallery</a>.'
    },
    tour: {
      keys: ['virtual tour', 'tour', '3d tour', 'walkthrough'],
      answer: () =>
        'Click <strong>Take a Virtual Tour</strong> on the Home page for campus stops (entrance, labs, sports, library, auditorium).'
    },
    privacy: {
      keys: ['privacy', 'data protection', 'gdpr', 'personal data'],
      answer: () =>
        'See our <a href="privacy.html">Privacy Policy</a>. For access or correction requests, contact the office.'
    },
    terms: {
      keys: ['terms', 'policy', 'rules', 'admission policy'],
      answer: () =>
        'Site terms: <a href="terms.html">Terms</a>. Admission policies are confirmed by the school office during application review.'
    },
    admin: {
      keys: ['admin panel', 'staff login', 'dashboard password'],
      answer: () =>
        'The staff admin panel is for authorized school staff only. Parents should use Admissions tracking, Contact, or Portals — not the admin URL.'
    },
    greeting: {
      keys: ['hello', 'hi', 'salam', 'assalam', 'hey', 'good morning', 'good afternoon', 'good evening', 'marhaba'],
      answer: () =>
        'Assalamu Alaikum! I am the <strong>' + SITE.name + ' site assistant</strong>. I only answer questions about this website — admissions, fees, books, location, academics, and more. What would you like to know?'
    },
    thanks: {
      keys: ['thank', 'shukran', 'bye', 'allah hafiz', 'jazak', 'ok thanks'],
      answer: () =>
        'You are welcome. For urgent matters: ' + PHONE + ' or <a href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a>.'
    },
    help: {
      keys: ['help', 'what can you', 'menu', 'options', 'what do you know'],
      answer: () =>
        'I can help with: <strong>admissions, tracking, fees, books, uniform, location, timings, curriculum, academics, notices, facilities, branches, virtual tour, contact</strong>. Ask in plain language or use the quick buttons.'
    }
  };

  function follow(html) {
    return '<div class="pss-follow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A859" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> ' + html + '</div>';
  }

  function detectTopic(text) {
    const t = text.toLowerCase();
    let best = null, score = 0;
    for (const [id, topic] of Object.entries(TOPICS)) {
      let s = 0;
      for (const k of topic.keys) {
        if (t.includes(k)) s += (k.includes(' ') ? k.length + 8 : k.length + 2);
      }
      if (s > score) { score = s; best = id; }
    }
    return score >= 3 ? best : null;
  }

  function isLikelyOffTopic(text) {
    const t = text.toLowerCase();
    const off = [
      'weather', 'stock market', 'bitcoin', 'recipe', 'movie', 'football score',
      'homework solve', 'write essay', 'chatgpt', 'joke', 'who is the president',
      'code for me', 'python script', 'girlfriend', 'boyfriend'
    ];
    return off.some((k) => t.includes(k));
  }

  function handlePending(text) {
    const g = extractGrade(text);
    if (pendingQuestion === 'grade' || pendingQuestion === 'admission-grade') {
      if (g) {
        const was = pendingQuestion;
        pendingQuestion = null;
        lastTopic = was === 'grade' ? 'books' : 'admissions';
        if (was === 'grade') return booksAnswer(g);
        return 'Thank you. For <strong>Grade ' + g + '</strong>, complete the form on <a href="admissions.html">Admissions</a>. Prepare report cards and ID documents. Office: 8:00 AM – 1:00 PM (Sun–Thu).';
      }
      if (/^(yes|yeah|yep|ok|sure|please)$/i.test(text.trim())) {
        return 'Please reply with the grade, e.g. <strong>9</strong>, <strong>Grade 11</strong>, or <strong>KG</strong>.';
      }
    }
    return null;
  }

  function reply(text) {
    const raw = (text || '').trim();
    if (!raw) {
      return 'Please type a short question about the school website — e.g. “How do I apply?” or “Where is the campus?”';
    }

    if (isLikelyOffTopic(raw)) {
      return 'I only answer questions about <strong>' + SITE.name + '</strong> and this website (admissions, fees, books, location, academics…). Try one of those topics, or <a href="contact.html">contact the school</a>.';
    }

    const pendingReply = handlePending(raw);
    if (pendingReply) return pendingReply;

    const gOnly = extractGrade(raw);
    if (gOnly && (lastTopic === 'books' || /book|stock|price|set/i.test(raw))) {
      lastTopic = 'books';
      pendingQuestion = null;
      return booksAnswer(gOnly);
    }

    const topicId = detectTopic(raw);
    if (!topicId) {
      if (lastTopic === 'books' && gOnly) return booksAnswer(gOnly);
      return 'I could not match that to our website content. Try: <strong>admissions</strong>, <strong>fees</strong>, <strong>books</strong>, <strong>location</strong>, <strong>timings</strong>, or <strong>track application</strong>. Or <a href="' + WA + '" target="_blank" rel="noopener">WhatsApp the school</a>.';
    }

    lastTopic = topicId;
    return TOPICS[topicId].answer(raw);
  }

  // ——— UI ———
  const style = document.createElement('style');
  style.textContent = `
    .pss-chat-btn{position:fixed;bottom:1.5rem;left:1.5rem;z-index:910;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;background:linear-gradient(135deg,#01411C,#00A859);color:#fff;box-shadow:0 6px 24px rgba(0,168,89,.4);display:flex;align-items:center;justify-content:center;transition:transform .25s}
    .pss-chat-btn:hover{transform:scale(1.06)}
    .pss-chat-btn svg{width:26px;height:26px}
    .pss-chat-btn .pss-badge{position:absolute;top:-2px;right:-2px;width:12px;height:12px;background:#4ADE80;border-radius:50%;border:2px solid #fff}
    .pss-chat-panel{position:fixed;bottom:5.5rem;left:1.5rem;z-index:920;width:min(400px,calc(100vw - 2rem));height:500px;max-height:calc(100vh - 8rem);background:var(--bg-secondary,#fff);border:1px solid var(--border-glass,rgba(0,168,89,.25));border-radius:1.15rem;box-shadow:0 16px 48px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden;font-family:Inter,system-ui,sans-serif}
    .pss-chat-panel.open{display:flex;animation:pssIn .25s ease}
    @keyframes pssIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    .pss-chat-head{background:linear-gradient(135deg,#01411C,#00A859);color:#fff;padding:.9rem 1rem;display:flex;align-items:center;justify-content:space-between;gap:.5rem}
    .pss-chat-head strong{font-size:.95rem}.pss-chat-head span{font-size:.72rem;opacity:.9;display:block}
    .pss-chat-close{background:rgba(255,255,255,.2);border:none;color:#fff;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:1.2rem}
    .pss-chat-msgs{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.65rem;background:var(--bg-primary,#F8FAFC)}
    .pss-bubble{max-width:92%;padding:.7rem .9rem;border-radius:.9rem;font-size:.88rem;line-height:1.5;word-break:break-word}
    .pss-bubble a{color:#00A859;font-weight:600;text-decoration:underline}
    .pss-bubble.bot{align-self:flex-start;background:var(--bg-secondary,#fff);border:1px solid var(--border-glass,rgba(0,168,89,.2));color:var(--text-primary,#0F172A)}
    .pss-bubble.user{align-self:flex-end;background:linear-gradient(135deg,#01411C,#00A859);color:#fff}
    .pss-follow{margin-top:.55rem;padding:.45rem .55rem;background:rgba(0,168,89,.08);border-radius:.5rem;font-size:.8rem;color:var(--text-secondary,#475569);display:flex;align-items:flex-start;gap:.35rem}
    .pss-typing{align-self:flex-start;padding:.5rem .8rem;font-size:.8rem;color:var(--text-muted,#64748B)}
    .pss-chat-input{display:flex;gap:.4rem;padding:.65rem;border-top:1px solid var(--border-glass,rgba(0,168,89,.2));background:var(--bg-secondary,#fff)}
    .pss-chat-input input{flex:1;border:1px solid var(--border-glass,rgba(0,168,89,.25));border-radius:.65rem;padding:.6rem .75rem;font-size:.9rem;background:var(--bg-primary,#F8FAFC);color:var(--text-primary,#0F172A)}
    .pss-chat-input button{border:none;border-radius:.65rem;padding:0 .9rem;background:#00A859;color:#fff;font-weight:600;cursor:pointer}
    .pss-quick{display:flex;flex-wrap:wrap;gap:.4rem;padding:0 .65rem .55rem;background:var(--bg-secondary,#fff)}
    .pss-quick button{border:1px solid var(--border-glass,rgba(0,168,89,.3));background:rgba(0,168,89,.1);color:#01411C;font-size:.72rem;font-weight:600;padding:.35rem .55rem;border-radius:999px;cursor:pointer}
    [data-theme="dark"] .pss-quick button{color:#E2E8F0}
    @media(max-width:768px){
      .pss-chat-btn{left:1rem;bottom:calc(4.5rem + env(safe-area-inset-bottom,0px));width:50px;height:50px}
      .pss-chat-panel{left:.5rem;right:.5rem;width:auto;bottom:calc(7rem + env(safe-area-inset-bottom,0px));height:min(440px,calc(100dvh - 9rem))}
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.className = 'pss-chat-btn';
  btn.setAttribute('aria-label', 'Open site assistant');
  btn.innerHTML = '<span class="pss-badge" aria-hidden="true"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  const panel = document.createElement('div');
  panel.className = 'pss-chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Pakistan School Seeb site assistant');
  panel.innerHTML = `
    <div class="pss-chat-head">
      <div>
        <strong>Seeb Site Assistant</strong>
        <span>Website content only · Not a general AI</span>
      </div>
      <button type="button" class="pss-chat-close" aria-label="Close">×</button>
    </div>
    <div class="pss-chat-msgs" id="pss-chat-msgs"></div>
    <div class="pss-quick">
      <button type="button" data-q="how to apply for admission">Admissions</button>
      <button type="button" data-q="track my application status">Track app</button>
      <button type="button" data-q="fees and transport calculator">Fees</button>
      <button type="button" data-q="books stock and prices">Books</button>
      <button type="button" data-q="school location map">Location</button>
      <button type="button" data-q="school timings hours">Timings</button>
      <button type="button" data-q="curriculum FBISE Cambridge">Curriculum</button>
      <button type="button" data-q="pakistan schools oman branches">Branches</button>
    </div>
    <form class="pss-chat-input" id="pss-chat-form">
      <input type="text" id="pss-chat-input" placeholder="Ask about this school website…" autocomplete="off" aria-label="Your question">
      <button type="submit">Send</button>
    </form>`;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  const msgs = panel.querySelector('#pss-chat-msgs');
  const form = panel.querySelector('#pss-chat-form');
  const input = panel.querySelector('#pss-chat-input');

  function addBubble(html, who) {
    const d = document.createElement('div');
    d.className = 'pss-bubble ' + who;
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function botReply(text) {
    const typing = document.createElement('div');
    typing.className = 'pss-typing';
    typing.textContent = 'Assistant is typing…';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => {
      typing.remove();
      addBubble(reply(text), 'bot');
    }, 280 + Math.min(String(text).length * 5, 400));
  }

  function openChat() {
    panel.classList.add('open');
    if (!msgs.dataset.greeted) {
      addBubble(reply('hello'), 'bot');
      msgs.dataset.greeted = '1';
    }
    setTimeout(() => input.focus(), 80);
  }
  function closeChat() { panel.classList.remove('open'); }

  btn.addEventListener('click', () => (panel.classList.contains('open') ? closeChat() : openChat()));
  panel.querySelector('.pss-chat-close').addEventListener('click', closeChat);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addBubble(text.replace(/</g, '&lt;'), 'user');
    input.value = '';
    botReply(text);
  });

  panel.querySelectorAll('.pss-quick button').forEach((b) => {
    b.addEventListener('click', () => {
      addBubble(b.textContent.trim().replace(/</g, '&lt;'), 'user');
      botReply(b.dataset.q);
    });
  });
})();
