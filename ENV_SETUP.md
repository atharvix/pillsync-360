# 🔧 Environment Variables Setup

## Frontend: `.env.local`

**Create this file in the ROOT directory** (same level as `package.json`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCrbLZprYWvBn6eF30dxK9nifoCBwFaDTI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pillsync-360.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pillsync-360
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=876450983631
NEXT_PUBLIC_FIREBASE_APP_ID=1:876450983631:web:08733dc6311ea24b66d1ba
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XRCJ9GTTHV
```

**For Production (after backend deployment):**
Update `NEXT_PUBLIC_API_BASE_URL` to your backend Vercel URL.

---

## Backend: `backend/.env`

**Create this file in the `backend/` directory:**

1. **Get Firebase Admin SDK Credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Project: **pillsync-360**
   - Settings ⚙️ → **Project Settings**
   - **Service Accounts** tab
   - Click **"Generate New Private Key"**
   - Download JSON file

2. **Extract values from JSON:**
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

3. **Create `backend/.env`:**

```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=pillsync-360
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@pillsync-360.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FULL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
CORS_ORIGIN=http://localhost:3000
```

⚠️ **Critical Notes:**
- Private key MUST be in double quotes
- Keep all `\n` characters (they represent newlines)
- Include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers

---

## ✅ Verification

After creating both files:

1. **Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Should see: `✅ Firebase Admin SDK initialized successfully`

2. **Frontend:**
   ```bash
   npm run dev
   ```
   Should load without errors

3. **Test:**
   - Backend: `curl http://localhost:5000/health`
   - Frontend: `http://localhost:3000`

---

## 🚨 Security Reminder

- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ `backend/.env` should be in `.gitignore` (already configured)
- ⚠️ **NEVER commit these files to git**
- ⚠️ **NEVER expose Firebase Admin SDK credentials**

