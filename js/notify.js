/**
 * Outbound email notifications (optional).
 * Currently inactive until a provider is configured (EmailJS / webhook).
 * Inquiry tickets and admin workflow work fully without email.
 */
(function (global) {
  'use strict';
  async function notify(payload) {
    if (!global.PSS_EMAILJS && !global.PSS_NOTIFY_WEBHOOK && !global.PSS_FORMSPREE) {
      return { ok: false, reason: 'not_configured' };
    }
    return { ok: false, reason: 'not_configured' };
  }
  global.PSSNotify = { notify };
})(typeof window !== 'undefined' ? window : globalThis);
