/**
 * Firebase config for Pakistan School Seeb — LIVE sync for all visitors
 *
 * SECURITY (required):
 * 1. Restrict this API key by HTTP referrer in Google Cloud Console:
 *    https://console.cloud.google.com/apis/credentials?project=panel-e3ee1
 *    Allow: https://khans1947.github.io/*
 * 2. Publish firestore.rules from the project root (see SECURITY.md)
 * 3. Change the admin password in admin.html before real use
 *
 * This web apiKey is public by design. Never commit a service-account JSON.
 */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyC7p3oZOkdA3ptYqf2D9s_8HCYTm2p1_94",
  authDomain: "panel-e3ee1.firebaseapp.com",
  projectId: "panel-e3ee1",
  storageBucket: "panel-e3ee1.firebasestorage.app",
  messagingSenderId: "444110735302",
  appId: "1:444110735302:web:05f8ca8d305428eb8e54c7",
  measurementId: "G-JXFNCE2HYH"
};

window.FIREBASE_ENABLED = !!(
  window.FIREBASE_CONFIG &&
  window.FIREBASE_CONFIG.apiKey &&
  window.FIREBASE_CONFIG.projectId
);
