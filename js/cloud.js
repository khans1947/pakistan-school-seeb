/**
 * Cloud data layer — Firebase Firestore when configured, else localStorage.
 * Collections: content (doc: main), inquiries, applications
 */
(function (global) {
  'use strict';

  const LOCAL = {
    content: 'pss-admin-content',
    inquiries: 'pss-inquiries',
    applications: 'pss-applications'
  };

  let db = null;
  let ready = false;
  const listeners = [];

  function isCloud() {
    return !!(global.FIREBASE_ENABLED && db);
  }

  async function init() {
    if (!global.FIREBASE_ENABLED || !global.FIREBASE_CONFIG) {
      ready = true;
      return false;
    }
    try {
      // Firebase v9 modular via CDN compat for simple script tags
      if (!global.firebase) {
        console.warn('[cloud] Firebase SDK not loaded');
        ready = true;
        return false;
      }
      if (!global.firebase.apps.length) {
        global.firebase.initializeApp(global.FIREBASE_CONFIG);
      }
      db = global.firebase.firestore();
      ready = true;
      return true;
    } catch (e) {
      console.warn('[cloud] init failed', e);
      ready = true;
      return false;
    }
  }

  // ----- Content (stats, ticker, notices) -----
  async function getContent() {
    if (isCloud()) {
      const snap = await db.collection('content').doc('main').get();
      if (snap.exists) return snap.data();
      return null;
    }
    try {
      const s = localStorage.getItem(LOCAL.content);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  }

  async function setContent(data) {
    if (isCloud()) {
      await db.collection('content').doc('main').set(data, { merge: true });
      return;
    }
    localStorage.setItem(LOCAL.content, JSON.stringify(data));
    try {
      new BroadcastChannel('pss-content').postMessage(data);
    } catch (e) {}
  }

  function subscribeContent(callback) {
    if (isCloud()) {
      return db.collection('content').doc('main').onSnapshot(
        (snap) => { if (snap.exists) callback(snap.data()); },
        (err) => console.warn('[cloud] content listen', err)
      );
    }
    // local: storage + broadcast
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
    // initial
    getContent().then((d) => { if (d) callback(d); });
    return () => {
      window.removeEventListener('storage', onStorage);
      try { if (bc) bc.close(); } catch (e) {}
    };
  }

  // ----- Inquiries -----
  async function listInquiries() {
    if (isCloud()) {
      const snap = await db.collection('inquiries').orderBy('createdAt', 'desc').limit(200).get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    try {
      return JSON.parse(localStorage.getItem(LOCAL.inquiries) || '[]');
    } catch { return []; }
  }

  async function addInquiry(item) {
    const row = {
      ...item,
      status: item.status || 'new',
      createdAt: item.createdAt || new Date().toISOString()
    };
    if (isCloud()) {
      const ref = await db.collection('inquiries').add(row);
      return { ...row, id: ref.id };
    }
    const list = await listInquiries();
    row.id = row.id || ('INQ-' + Date.now().toString(36).toUpperCase());
    list.push(row);
    localStorage.setItem(LOCAL.inquiries, JSON.stringify(list));
    return row;
  }

  async function updateInquiry(id, patch) {
    if (isCloud()) {
      await db.collection('inquiries').doc(id).set(patch, { merge: true });
      return;
    }
    const list = await listInquiries();
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) {
      list[i] = { ...list[i], ...patch };
      localStorage.setItem(LOCAL.inquiries, JSON.stringify(list));
    }
  }

  function subscribeInquiries(callback) {
    if (isCloud()) {
      return db.collection('inquiries').orderBy('createdAt', 'desc').limit(200)
        .onSnapshot((snap) => {
          callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.warn(err));
    }
    callback([]); // local admin polls via its own load
    return () => {};
  }

  // ----- Applications -----
  async function listApplications() {
    if (isCloud()) {
      const snap = await db.collection('applications').orderBy('submittedAt', 'desc').limit(200).get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    try {
      return JSON.parse(localStorage.getItem(LOCAL.applications) || '[]');
    } catch { return []; }
  }

  async function addApplication(item) {
    const row = {
      ...item,
      status: item.status || 'pending',
      submittedAt: item.submittedAt || new Date().toISOString()
    };
    // Strip huge base64 if cloud (Firestore 1MB doc limit) — keep names only in cloud, or compress
    if (isCloud()) {
      const forCloud = {
        ...row,
        documents: (row.documents || []).map((d) => ({
          name: typeof d === 'string' ? d : d.name,
          type: d.type || '',
          size: d.size || 0
          // dataUrl omitted in cloud to stay under size limits — use Storage later if needed
        }))
      };
      // Keep dataUrls in a subcollection only for small files
      const ref = await db.collection('applications').add(forCloud);
      // Store previews separately if small enough
      const docs = row.documents || [];
      for (let i = 0; i < docs.length; i++) {
        const d = docs[i];
        if (d && d.dataUrl && d.dataUrl.length < 900000) {
          await db.collection('applications').doc(ref.id).collection('files').doc('f' + i).set({
            name: d.name,
            type: d.type,
            dataUrl: d.dataUrl
          });
        }
      }
      return { ...row, id: ref.id };
    }
    const list = await listApplications();
    list.push(row);
    localStorage.setItem(LOCAL.applications, JSON.stringify(list));
    return row;
  }

  async function updateApplication(trackingId, patch) {
    if (isCloud()) {
      const snap = await db.collection('applications').where('trackingId', '==', trackingId).limit(1).get();
      if (!snap.empty) {
        await snap.docs[0].ref.set(patch, { merge: true });
      }
      return;
    }
    const list = await listApplications();
    const i = list.findIndex((x) => x.trackingId === trackingId);
    if (i >= 0) {
      list[i] = { ...list[i], ...patch };
      localStorage.setItem(LOCAL.applications, JSON.stringify(list));
    }
  }

  async function getApplicationByTracking(trackingId) {
    if (isCloud()) {
      const snap = await db.collection('applications').where('trackingId', '==', trackingId).limit(1).get();
      if (snap.empty) return null;
      const doc = snap.docs[0];
      const data = { id: doc.id, ...doc.data() };
      // load file previews
      try {
        const files = await doc.ref.collection('files').get();
        if (!files.empty) {
          data.documents = files.docs.map((f) => f.data());
        }
      } catch (e) {}
      return data;
    }
    const list = await listApplications();
    return list.find((x) => x.trackingId === trackingId) || null;
  }

  function subscribeApplications(callback) {
    if (isCloud()) {
      return db.collection('applications').orderBy('submittedAt', 'desc').limit(200)
        .onSnapshot((snap) => {
          callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, (err) => console.warn(err));
    }
    return () => {};
  }

  global.PSSCloud = {
    init,
    isCloud: () => isCloud(),
    getContent,
    setContent,
    subscribeContent,
    listInquiries,
    addInquiry,
    updateInquiry,
    subscribeInquiries,
    listApplications,
    addApplication,
    updateApplication,
    getApplicationByTracking,
    subscribeApplications
  };
})(window);
