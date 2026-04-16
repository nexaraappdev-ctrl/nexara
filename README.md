# Nexara — Setup Guide

## What you're getting

* **Sign In/Up** — Email/password, Google OAuth, Phone (SMS)
* **Live video chat** — Camera, mic, screenshare
* **Text chat** — Realtime alongside video
* **Staff roles** — Founder → Manager → Admin → Moderator → VIP → User
* **Report system** — Users report, staff resolve in the admin panel
* **All free** — Firebase free tier + Render free tier + Netlify free tier

\---

## Step 1 — Firebase Setup (Auth + Database)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. **Create a new project** (e.g. "Nexara")
3. Go to **Authentication → Sign-in method** and enable:

   * ✅ Email/Password
   * ✅ Google
   * ✅ Phone
4. Go to **Firestore Database → Create database** (start in production mode)
5. Add these Firestore security rules under **Rules**:

```
rules\\\_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
        in \\\['admin','manager','founder'];
    }
    match /reports/{id} {
      allow create: if request.auth != null;
      allow read, update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
        in \\\['moderator','admin','manager','founder'];
    }
  }
}
```

6. Go to **Project Settings → Your apps → Web app** → Register and copy your config
7. Paste it into `frontend/js/config.js`

\---

## Step 2 — Deploy Backend to Render

1. Push the `backend/` folder to a **GitHub repo**
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Settings:

   * **Build command:** `npm install`
   * **Start command:** `npm start`
   * **Instance type:** Free
5. Deploy — copy the URL (e.g. `https://your-app.onrender.com`)
6. Paste it into `frontend/js/config.js` as `BACKEND\\\_URL`

> ⚠️ \\\*\\\*Free Render tier sleeps after 15 min of inactivity\\\*\\\* — first connection may take \\\~30s to wake up.

\---

## Step 3 — Deploy Frontend to Netlify

1. Push the `frontend/` folder to a **GitHub repo** (can be separate or a subfolder)
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Settings:

   * **Base directory:** `frontend` (or leave blank if it's the root)
   * **Publish directory:** `frontend` (or `.`)
   * **Build command:** (leave blank — no build needed)
4. Deploy
5. Add your **Netlify domain** to Firebase Auth:

   * Firebase Console → Authentication → Settings → Authorized domains → Add domain

\---

## Step 4 — Set Your Role as Founder

1. Create an account on your site
2. In Firebase Console → Firestore → `users` collection
3. Find your user document → edit `role` field to `"founder"`
4. Now you can manage all other users from the Admin Panel (⚙️ button in chat)

\---

## Staff Roles

|Role|Can Do|
|-|-|
|**Founder**|Everything — assign any role, ban, resolve reports|
|**Manager**|Assign roles up to admin, ban users, resolve reports|
|**Admin**|View/resolve reports, ban users|
|**Moderator**|View and resolve reports|
|**VIP**|Cosmetic badge only (future features)|
|**User**|Default|

\---

## File Structure

```
backend/
  server.js         ← Express + Socket.io (deploy to Render)
  package.json

frontend/
  index.html        ← Sign in / Sign up page
  chat.html         ← Main video chat
  admin.html        ← Staff panel
  \\\_redirects        ← Netlify routing
  js/
    config.js       ← ⚠️ Fill in your Firebase + Render URL here
```

