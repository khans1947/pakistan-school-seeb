/**
 * FIREBASE CONFIG — required for LIVE updates for all visitors
 * ----------------------------------------------------------------
 * 1. Go to https://console.firebase.google.com
 * 2. Create a project (e.g. "pakistan-school-seeb")
 * 3. Add a Web app → copy the firebaseConfig object
 * 4. Enable Firestore Database → Create database → Start in TEST mode
 *    (for production, tighten rules later)
 * 5. Paste your config BELOW, replacing the null values
 * 6. Upload this file to GitHub
 *
 * Leave as-is (all null) to use offline / same-browser mode only.
 */
window.FIREBASE_CONFIG = {
  apiKey: null,
  authDomain: null,
  projectId: null,
  storageBucket: null,
  messagingSenderId: null,
  appId: null
};

// Set to true only after you pasted a real config above
window.FIREBASE_ENABLED = !!(
  window.FIREBASE_CONFIG &&
  window.FIREBASE_CONFIG.apiKey &&
  window.FIREBASE_CONFIG.projectId
);
