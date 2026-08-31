# Enable LIVE updates for everyone (Firebase — free)

Without this, the site only updates instantly on **your** browser.  
With Firebase, **all visitors** see stats, notices, tickets, and admission status in real time.

## 1. Create a Firebase project (5 minutes)

1. Open https://console.firebase.google.com and sign in with Google  
2. **Add project** → name it e.g. `pakistan-school-seeb` → continue  
3. Disable Google Analytics if you want (optional) → Create  

## 2. Register a web app

1. On the project overview, click the **Web** icon `</>`  
2. App nickname: `PS Seeb Website`  
3. Copy the `firebaseConfig` object values  

## 3. Create Firestore database

1. Left menu → **Build** → **Firestore Database**  
2. **Create database** → **Start in test mode** → choose a region → Enable  

Test mode allows open read/write for development. Later you can lock rules down.

## 4. Paste config into the website

Edit the file **`js/firebase-config.js`** on GitHub (or locally then upload):

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc"
};
```

Save and upload `js/firebase-config.js` to your repo.

## 5. Verify

1. Open the website + admin (your staff admin password (see admin.html hash setup in SECURITY.md))  
2. Admin dashboard should say **Sync mode: LIVE (all visitors)**  
3. Change a stat → Save → another phone/browser should show the new number after a second  

## Notes

- First time you save content from admin, it creates the cloud document automatically  
- Contact form & admissions also write to the cloud when LIVE is on  
- Document file previews: small files are stored; very large files may only store the file name in the cloud  
- Free Spark plan is enough for a school site at normal traffic  


## Email notifications (optional)

After a parent submits an **inquiry** or **admission**, you can send email in three ways:

### A) EmailJS (easiest for static sites)
1. Create free account at https://www.emailjs.com  
2. Add an email service + template with variables: `to_email`, `tracking_id`, `message`, `to_name`  
3. In `index.html` (or a small `js/notify-config.js`) before other scripts:

```html
<script>
window.PSS_EMAILJS = {
  serviceId: 'service_xxx',
  templateId: 'template_xxx',
  publicKey: 'your_public_key'
};
</script>
```

### B) Formspree
```html
<script>window.PSS_FORMSPREE = 'https://formspree.io/f/yourid';</script>
```

### C) Webhook (Make / n8n / Firebase Function)
```html
<script>window.PSS_NOTIFY_WEBHOOK = 'https://your-endpoint.example/hooks/pss';</script>
```

School staff can also print inquiry receipts from the Contact confirmation card and from Admin → Inquiries → Print.


## Inquiry status sync (important)

Firestore rules must allow **read + update** on `inquiries` or admin status changes will not appear on the public Track form for other devices.

1. Open Firebase Console → Firestore → Rules
2. Paste the project file `firestore.rules`
3. Publish

Until rules are published, status still updates in the **same browser** via localStorage.
