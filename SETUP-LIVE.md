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

1. Open the website + admin (password `seeb2026`)  
2. Admin dashboard should say **Sync mode: LIVE (all visitors)**  
3. Change a stat → Save → another phone/browser should show the new number after a second  

## Notes

- First time you save content from admin, it creates the cloud document automatically  
- Contact form & admissions also write to the cloud when LIVE is on  
- Document file previews: small files are stored; very large files may only store the file name in the cloud  
- Free Spark plan is enough for a school site at normal traffic  
