/**
 * PSS Cloud — enterprise data layer
 * Collections: content, applications, inquiries, inventory, notices, faculty, siteSettings
 * Firebase Firestore when configured; localStorage + BroadcastChannel fallback.
 */
(function (global) {
  'use strict';

  const LOCAL = {
    content: 'pss-admin-content',
    inquiries: 'pss-inquiries',
    applications: 'pss-applications',
    inventory: 'pss-inventory',
    notices: 'pss-notices',
    faculty: 'pss-faculty',
    siteSettings: 'pss-site-settings'
  };

  const APP_STATUSES = [
    'submitted', 'under_review', 'interview_scheduled',
    'accepted', 'waitlisted', 'rejected', 'pending'
  ];

  let db = null;
  let ready = false;

  function isCloud() {
    return !!(global.FIREBASE_ENABLED && db);
  }

  async function init() {
    if (!global.FIREBASE_ENABLED || !global.FIREBASE_CONFIG) {
      ready = true;
      return false;
    }
    try {
      if (!global.firebase) {
        console.warn('[cloud] Firebase SDK not loaded');
        ready = true;
        return false;
      }
      if (!global.firebase.apps.length) {
        global.firebase.initializeApp(global.FIREBASE_CONFIG);
      }
      db = global.firebase.firestore();
      try {
        db.settings({ experimentalForceLongPolling: true, merge: true });
      } catch (e) {}
      try { await db.enableNetwork(); } catch (e) {}
      ready = true;
      return true;
    } catch (e) {
      console.warn('[cloud] init failed', e);
      ready = true;
      return false;
    }
  }

  function lsGet(key, fallback) {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : fallback;
    } catch { return fallback; }
  }
  function lsSet(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
  function broadcast(channel, data) {
    try { new BroadcastChannel(channel).postMessage(data); } catch (e) {}
  }

  // ----- Content -----
  async function getContent() {
    if (isCloud()) {
      try {
        const snap = await db.collection('content').doc('main').get({ source: 'server' });
        if (snap.exists) return snap.data();
      } catch (e1) {
        try {
          const snap = await db.collection('content').doc('main').get();
          if (snap.exists) return snap.data();
        } catch (e2) { console.warn('[cloud] getContent', e1); }
      }
      return null;
    }
    return lsGet(LOCAL.content, null);
  }

  async function setContent(data) {
    if (isCloud()) {
      await db.collection('content').doc('main').set(data, { merge: true });
      return;
    }
    lsSet(LOCAL.content, data);
    broadcast('pss-content', data);
  }

  function subscribeContent(callback) {
    if (isCloud()) {
      return db.collection('content').doc('main').onSnapshot(
        (snap) => { if (snap.exists) callback(snap.data()); },
        (err) => console.warn('[cloud] content listen', err)
      );
    }
    const onStorage = (e) => {
      if (e.key === LOCAL.content && e.newValue) {
        try { callback(JSON.parse(e.newValue)); } catch (err) {}
      }
    };
    window.addEventListener('storage', onStorage);
    let bc;
    try {
      bc = new BroadcastChannel('pss-content');
      bc.onmessage = (e) => { if (e.data) callback(e.data); };
    } catch (e) {}
    getContent().then((d) => { if (d) callback(d); });
    return () => {
      window.removeEventListener('storage', onStorage);
      try { if (bc) bc.close(); } catch (e) {}
    };
  }

  // ----- Applications -----
  async function listApplications() {
    if (isCloud()) {
      try {
        const snap = await db.collection('applications').orderBy('submittedAt', 'desc').limit(500).get();
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn('[cloud] listApplications', e);
        return [];
      }
    }
    return lsGet(LOCAL.applications, []);
  }

  async function getApplicationByTrackingId(trackingId) {
    const id = (trackingId || '').trim().toUpperCase();
    if (!id) return null;
    if (isCloud()) {
      try {
        const snap = await db.collection('applications')
          .where('trackingId', '==', id).limit(1).get();
        if (!snap.empty) {
          const d = snap.docs[0];
          return { id: d.id, ...d.data() };
        }
      } catch (e) {
        console.warn('[cloud] getApplicationByTrackingId', e);
      }
      return null;
    }
    const list = lsGet(LOCAL.applications, []);
    return list.find((a) => (a.trackingId || '').toUpperCase() === id) || null;
  }

  async function addApplication(app) {
    const row = {
      ...app,
      status: app.status || 'submitted',
      adminNotes: app.adminNotes || '',
      publicNotes: app.publicNotes || '',
      timeline: app.timeline || [
        { status: 'submitted', at: new Date().toISOString(), note: 'Application received' }
      ],
      submittedAt: app.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (isCloud()) {
      const ref = await db.collection('applications').add(row);
      return { ...row, id: ref.id };
    }
    const list = lsGet(LOCAL.applications, []);
    row.id = row.id || ('APP-' + Date.now().toString(36).toUpperCase());
    list.unshift(row);
    lsSet(LOCAL.applications, list);
    broadcast('pss-applications', list);
    return row;
  }

  async function updateApplication(trackingIdOrId, patch) {
    const now = new Date().toISOString();
    const updates = { ...patch, updatedAt: now };

    if (isCloud()) {
      // Prefer trackingId lookup then doc id
      let docId = trackingIdOrId;
      try {
        const byTrack = await db.collection('applications')
          .where('trackingId', '==', trackingIdOrId).limit(1).get();
        if (!byTrack.empty) docId = byTrack.docs[0].id;
      } catch (e) {}
      const ref = db.collection('applications').doc(docId);
      const snap = await ref.get();
      if (snap.exists && updates.status && !Array.isArray(updates.timeline)) {
        const data = snap.data();
        const timeline = Array.isArray(data.timeline) ? data.timeline.slice() : [];
        const last = timeline.length ? timeline[timeline.length - 1] : null;
        if (!last || last.status !== updates.status) {
          timeline.push({
            status: updates.status,
            at: now,
            note: updates.publicNotes || updates.adminNotes || updates.adminNote || updates.status
          });
        }
        updates.timeline = timeline;
      }
      await ref.set(updates, { merge: true });
      return;
    }

    const list = lsGet(LOCAL.applications, []);
    const i = list.findIndex(
      (a) => a.trackingId === trackingIdOrId || a.id === trackingIdOrId
    );
    if (i >= 0) {
      if (updates.status && !Array.isArray(updates.timeline)) {
        const timeline = Array.isArray(list[i].timeline) ? list[i].timeline.slice() : [];
        const last = timeline.length ? timeline[timeline.length - 1] : null;
        if (!last || last.status !== updates.status) {
          timeline.push({
            status: updates.status,
            at: now,
            note: updates.publicNotes || updates.adminNotes || updates.adminNote || updates.status
          });
        }
        updates.timeline = timeline;
      }
      list[i] = { ...list[i], ...updates };
      lsSet(LOCAL.applications, list);
      broadcast('pss-applications', list);
    }
  }

  async function deleteApplication(trackingIdOrId) {
    if (isCloud()) {
      let docId = trackingIdOrId;
      try {
        const byTrack = await db.collection('applications')
          .where('trackingId', '==', trackingIdOrId).limit(1).get();
        if (!byTrack.empty) docId = byTrack.docs[0].id;
      } catch (e) {}
      await db.collection('applications').doc(docId).delete();
      return;
    }
    const list = lsGet(LOCAL.applications, []);
    const filtered = list.filter(
      (a) => a.trackingId !== trackingIdOrId && a.id !== trackingIdOrId
    );
    lsSet(LOCAL.applications, filtered);
    broadcast('pss-applications', filtered);
  }

  function subscribeApplications(callback) {
    if (isCloud()) {
      return db.collection('applications').orderBy('submittedAt', 'desc').limit(500)
        .onSnapshot((snap) => {
          callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.warn('[cloud] apps listen', err));
    }
    const emit = () => callback(lsGet(LOCAL.applications, []));
    const onStorage = (e) => { if (e.key === LOCAL.applications) emit(); };
    window.addEventListener('storage', onStorage);
    let bc;
    try {
      bc = new BroadcastChannel('pss-applications');
      bc.onmessage = () => emit();
    } catch (e) {}
    emit();
    return () => {
      window.removeEventListener('storage', onStorage);
      try { if (bc) bc.close(); } catch (e) {}
    };
  }

  // ----- Inquiries -----
  async function listInquiries() {
    let cloudList = [];
    if (isCloud()) {
      try {
        const snap = await db.collection('inquiries').orderBy('createdAt', 'desc').limit(200).get();
        cloudList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn('[cloud] listInquiries', e);
      }
    }
    const localList = lsGet(LOCAL.inquiries, []);
    // Merge by trackingId / id — prefer newer updatedAt
    const map = {};
    function keyOf(x) {
      return String(x.trackingId || x.id || '').toUpperCase();
    }
    function newer(a, b) {
      const ta = Date.parse(a.updatedAt || a.createdAt || 0) || 0;
      const tb = Date.parse(b.updatedAt || b.createdAt || 0) || 0;
      return ta >= tb ? a : b;
    }
    localList.forEach((x) => {
      const k = keyOf(x);
      if (k) map[k] = x;
    });
    cloudList.forEach((x) => {
      const k = keyOf(x);
      if (!k) return;
      map[k] = map[k] ? newer(map[k], x) : x;
    });
    return Object.values(map).sort((a, b) =>
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    );
  }

  async function resolveInquiryDocId(idOrTracking) {
    const key = String(idOrTracking || '').trim();
    if (!key) return null;
    // Direct doc id
    try {
      const snap = await db.collection('inquiries').doc(key).get();
      if (snap.exists) return key;
    } catch (e) {}
    // By trackingId field
    try {
      let q = await db.collection('inquiries').where('trackingId', '==', key).limit(1).get();
      if (!q.empty) return q.docs[0].id;
      q = await db.collection('inquiries').where('trackingId', '==', key.toUpperCase()).limit(1).get();
      if (!q.empty) return q.docs[0].id;
    } catch (e) {}
    // By embedded id field
    try {
      const q = await db.collection('inquiries').where('id', '==', key).limit(1).get();
      if (!q.empty) return q.docs[0].id;
    } catch (e) {}
    return null;
  }

  async function addInquiry(item) {
    const tid = String(item.trackingId || item.id || ('INQ-' + Date.now().toString(36).toUpperCase())).toUpperCase();
    const row = {
      ...item,
      trackingId: tid,
      status: item.status || 'new',
      statusHistory: item.statusHistory || [
        { status: 'new', at: new Date().toISOString(), note: 'Inquiry received' }
      ],
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    // Keep trackingId as public ticket; do not force id = tid when cloud assigns doc id
    if (isCloud()) {
      const payload = { ...row };
      delete payload.id; // let Firestore assign, keep trackingId
      const ref = await db.collection('inquiries').add(payload);
      return { ...payload, id: ref.id, trackingId: tid };
    }
    const localRow = { ...row, id: tid };
    const list = await listInquiries();
    list.unshift(localRow);
    lsSet(LOCAL.inquiries, list);
    return localRow;
  }

  async function updateInquiry(idOrTracking, patch) {
    const updates = { ...patch, updatedAt: patch.updatedAt || new Date().toISOString() };
    const key = String(idOrTracking || '').trim();
    const keyU = key.toUpperCase();

    // 1) Always update localStorage (works even when Firestore rules block writes)
    const list = lsGet(LOCAL.inquiries, []);
    let found = false;
    for (let i = 0; i < list.length; i++) {
      const ids = [list[i].id, list[i].trackingId].map((v) => String(v || '').toUpperCase());
      if (ids.includes(keyU) || ids.includes(key)) {
        const prev = list[i];
        const hist = Array.isArray(prev.statusHistory) ? prev.statusHistory.slice() : [];
        if (updates.status && (!hist.length || hist[hist.length - 1].status !== updates.status)) {
          hist.push({
            status: updates.status,
            at: updates.updatedAt,
            note: updates.publicNotes || updates.note || ('Status: ' + updates.status)
          });
          updates.statusHistory = hist;
        }
        list[i] = { ...prev, ...updates, trackingId: prev.trackingId || keyU };
        found = true;
      }
    }
    if (!found && key) {
      list.unshift({
        id: key,
        trackingId: keyU,
        ...updates
      });
    }
    lsSet(LOCAL.inquiries, list);
    try {
      broadcast('pss-inquiries', { type: 'update', id: keyU, patch: updates });
    } catch (e) {}

    // 2) Cloud (may fail if rules block — local already saved)
    if (isCloud()) {
      try {
        let docId = await resolveInquiryDocId(idOrTracking);
        if (!docId) {
          // Try list match
          const all = await listInquiries();
          const hit = all.find((x) =>
            String(x.trackingId || '').toUpperCase() === keyU ||
            String(x.id || '').toUpperCase() === keyU
          );
          docId = hit && hit.id ? hit.id : null;
        }
        if (docId) {
          try {
            const cur = await db.collection('inquiries').doc(docId).get();
            if (cur.exists && updates.status) {
              const data = cur.data() || {};
              const hist = Array.isArray(data.statusHistory) ? data.statusHistory.slice() : [];
              if (!hist.length || hist[hist.length - 1].status !== updates.status) {
                hist.push({
                  status: updates.status,
                  at: updates.updatedAt,
                  note: updates.publicNotes || updates.note || ('Status: ' + updates.status)
                });
                updates.statusHistory = hist;
              }
            }
          } catch (e) {}
          await db.collection('inquiries').doc(docId).set(updates, { merge: true });
        } else {
          // Create / merge by ticket id as doc id so track can find it
          await db.collection('inquiries').doc(keyU).set(
            { trackingId: keyU, ...updates },
            { merge: true }
          );
        }
      } catch (e) {
        console.warn('[cloud] updateInquiry failed (local saved)', e);
      }
    }
    return updates;
  }

  async function deleteInquiry(idOrTracking) {
    if (isCloud()) {
      const docId = (await resolveInquiryDocId(idOrTracking)) || String(idOrTracking || '').trim();
      await db.collection('inquiries').doc(docId).delete();
      return;
    }
    const key = String(idOrTracking || '').trim().toUpperCase();
    const list = await listInquiries();
    const filtered = list.filter((x) => {
      const ids = [x.id, x.trackingId].map((v) => String(v || '').toUpperCase());
      return !ids.includes(key);
    });
    lsSet(LOCAL.inquiries, filtered);
  }

  async function getInquiryByTrackingId(trackingId) {
    const key = String(trackingId || '').trim().toUpperCase();
    if (!key) return null;
    let cloudRow = null;
    if (isCloud()) {
      try {
        let q = await db.collection('inquiries').where('trackingId', '==', key).limit(1).get();
        if (q.empty) {
          q = await db.collection('inquiries').where('trackingId', '==', String(trackingId).trim()).limit(1).get();
        }
        if (!q.empty) cloudRow = { id: q.docs[0].id, ...q.docs[0].data() };
        if (!cloudRow) {
          const direct = await db.collection('inquiries').doc(key).get();
          if (direct.exists) cloudRow = { id: direct.id, ...direct.data() };
        }
      } catch (e) {
        console.warn('[cloud] getInquiryByTrackingId', e);
      }
    }
    const local = lsGet(LOCAL.inquiries, []);
    const localRow =
      local.find((x) => String(x.trackingId || '').toUpperCase() === key) ||
      local.find((x) => String(x.id || '').toUpperCase() === key) ||
      null;
    if (cloudRow && localRow) {
      const tc = Date.parse(cloudRow.updatedAt || cloudRow.createdAt || 0) || 0;
      const tl = Date.parse(localRow.updatedAt || localRow.createdAt || 0) || 0;
      // Newer record wins (so admin local status beats stale cloud)
      return tl >= tc ? { ...cloudRow, ...localRow } : { ...localRow, ...cloudRow };
    }
    return localRow || cloudRow || null;
  }

  function subscribeInquiries(callback) {
    if (isCloud()) {
      return db.collection('inquiries').orderBy('createdAt', 'desc').limit(200)
        .onSnapshot((snap) => {
          callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.warn('[cloud] inq listen', err));
    }
    const emit = () => callback(lsGet(LOCAL.inquiries, []));
    emit();
    const onStorage = (e) => { if (e.key === LOCAL.inquiries) emit(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }

  // ----- Inventory (books + uniforms + stationery) -----
  async function listInventory() {
    if (isCloud()) {
      try {
        const snap = await db.collection('inventory').orderBy('updatedAt', 'desc').limit(500).get();
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        // fallback without order
        const snap = await db.collection('inventory').limit(500).get();
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    }
    return lsGet(LOCAL.inventory, null);
  }

  async function setInventory(items) {
    if (isCloud()) {
      const batch = db.batch();
      // Simple: store as single doc for school-scale inventory
      await db.collection('inventory').doc('catalog').set({
        items,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return;
    }
    lsSet(LOCAL.inventory, items);
    broadcast('pss-inventory', items);
  }

  async function getInventoryCatalog() {
    if (isCloud()) {
      try {
        const snap = await db.collection('inventory').doc('catalog').get();
        if (snap.exists) return snap.data().items || [];
      } catch (e) { console.warn('[cloud] inventory', e); }
      return [];
    }
    const local = lsGet(LOCAL.inventory, null);
    return local || [];
  }

  function subscribeInventory(callback) {
    if (isCloud()) {
      return db.collection('inventory').doc('catalog').onSnapshot(
        (snap) => { callback(snap.exists ? (snap.data().items || []) : []); },
        (err) => console.warn('[cloud] inv listen', err)
      );
    }
    const emit = () => callback(lsGet(LOCAL.inventory, []) || []);
    const onStorage = (e) => { if (e.key === LOCAL.inventory) emit(); };
    window.addEventListener('storage', onStorage);
    let bc;
    try {
      bc = new BroadcastChannel('pss-inventory');
      bc.onmessage = (e) => { if (e.data) callback(e.data); };
    } catch (e) {}
    emit();
    return () => {
      window.removeEventListener('storage', onStorage);
      try { if (bc) bc.close(); } catch (e) {}
    };
  }

  // ----- Notices (dedicated collection + content.notices) -----
  async function listNotices() {
    if (isCloud()) {
      try {
        const snap = await db.collection('notices').orderBy('publishDate', 'desc').limit(100).get();
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        const content = await getContent();
        return (content && content.notices) || [];
      }
    }
    const local = lsGet(LOCAL.notices, null);
    if (local) return local;
    const content = await getContent();
    return (content && content.notices) || [];
  }

  async function setNotices(notices) {
    if (isCloud()) {
      await db.collection('content').doc('main').set({ notices }, { merge: true });
      return;
    }
    lsSet(LOCAL.notices, notices);
    const content = lsGet(LOCAL.content, {}) || {};
    content.notices = notices;
    lsSet(LOCAL.content, content);
    broadcast('pss-content', content);
  }

  // ----- Site settings -----
  async function getSiteSettings() {
    if (isCloud()) {
      try {
        const snap = await db.collection('siteSettings').doc('main').get();
        if (snap.exists) return snap.data();
      } catch (e) {}
      return null;
    }
    return lsGet(LOCAL.siteSettings, null);
  }

  async function setSiteSettings(data) {
    if (isCloud()) {
      await db.collection('siteSettings').doc('main').set(data, { merge: true });
      return;
    }
    lsSet(LOCAL.siteSettings, data);
  }

  // Notification hook (email/WhatsApp webhook — configure endpoint)
  async function triggerNotification(payload) {
    const endpoint = global.PSS_NOTIFY_WEBHOOK;
    if (!endpoint) {
      console.info('[cloud] notification queued (no webhook):', payload.type, payload.to);
      return { ok: false, reason: 'no_webhook' };
    }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { ok: res.ok };
    } catch (e) {
      console.warn('[cloud] notify failed', e);
      return { ok: false, error: String(e) };
    }
  }

  global.PSSCloud = {
    init,
    isCloud,
    isReady: () => ready,
    APP_STATUSES,
    getContent,
    setContent,
    subscribeContent,
    listApplications,
    getApplicationByTrackingId,
    getApplicationByTracking: getApplicationByTrackingId,
    addApplication,
    updateApplication,
    deleteApplication,
    subscribeApplications,
    listInquiries,
    addInquiry,
    deleteInquiry,
    updateInquiry,
    getInquiryByTrackingId, getInquiryByTrackingId,
    subscribeInquiries,
    getInventoryCatalog,
    setInventory,
    subscribeInventory,
    listNotices,
    setNotices,
    getSiteSettings,
    setSiteSettings,
    triggerNotification
  };
})(typeof window !== 'undefined' ? window : globalThis);
