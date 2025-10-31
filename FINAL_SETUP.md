# 🎯 Final Setup & Deployment

## ✅ Current Status

All code is integrated and ready! Just need to complete these final steps:

---

## 📝 Step 1: Create `.env.local` (Frontend)

**Location:** Root directory (same level as `package.json`)

Create file `.env.local` with:

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

⚠️ **Note:** `.env.local` is in `.gitignore` (won't be committed)

---

## ⚙️ Step 2: Setup Backend Environment

**Location:** `backend/.env`

Get Firebase Admin SDK credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **pillsync-360**
3. Settings ⚙️ → **Project Settings**
4. **Service Accounts** tab
5. Click **"Generate New Private Key"**
6. Download JSON file

Extract values and create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=pillsync-360
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@pillsync-360.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
CORS_ORIGIN=http://localhost:3000
```

**Important:** 
- Copy entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep it in quotes
- Preserve `\n` characters

---

## 🧪 Step 3: Test Locally

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

**Expected:** 
```
✅ Firebase Admin SDK initialized successfully
Server running on port: 5000
```

### Terminal 2: Start Frontend

```bash
npm run dev
```

**Expected:**
```
▲ Next.js 16.0.1
- Local: http://localhost:3000
```

### Test Flow

1. **Backend Health:** `curl http://localhost:5000/health`
2. **Frontend:** Open `http://localhost:3000`
3. **Sign Up:** Create test account
4. **Dashboard:** Should load after login
5. **Add Medication:** Click "Add" → Fill form → Submit
6. **Check Backend Logs:** Should see `POST /api/medications`
7. **Verify in List:** Medication should appear

---

## 🚀 Step 4: Deploy to Vercel

### Deploy Backend First

1. **Vercel Dashboard** → "Add New" → "Project"
2. **Import Repository**
3. **Configure:**
   - Root Directory: `backend`
   - Framework: Other
4. **Environment Variables:**
   ```
   PORT=5000
   NODE_ENV=production
   FIREBASE_PROJECT_ID=pillsync-360
   FIREBASE_CLIENT_EMAIL=your_email@pillsync-360.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
   CORS_ORIGIN=http://localhost:3000
   ```
5. **Deploy** → Copy URL (e.g., `https://pillsync-360-backend.vercel.app`)

### Deploy Frontend

1. **Vercel Dashboard** → "Add New" → "Project"
2. **Import Repository**
3. **Configure:**
   - Root Directory: (root)
   - Framework: Next.js
4. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.vercel.app
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCrbLZprYWvBn6eF30dxK9nifoCBwFaDTI
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pillsync-360.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=pillsync-360
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=876450983631
   NEXT_PUBLIC_FIREBASE_APP_ID=1:876450983631:web:08733dc6311ea24b66d1ba
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XRCJ9GTTHV
   ```
5. **Deploy** → Copy URL

### Update CORS

1. **Backend Project** → Settings → Environment Variables
2. **Edit `CORS_ORIGIN`:** `https://your-frontend-url.vercel.app`
3. **Redeploy Backend**

---

## ✅ Verification

### Production Tests

1. **Backend:** `curl https://your-backend-url.vercel.app/health`
2. **Frontend:** Open production URL
3. **Sign Up/Login**
4. **Add Medication**
5. **Check Network Tab:** API calls to backend
6. **Check Backend Logs:** In Vercel dashboard

---

## 📚 Documentation

- `LOCAL_TESTING.md` - Detailed local testing guide
- `VERCEL_DEPLOYMENT.md` - Complete deployment guide
- `INTEGRATION_COMPLETE.md` - Integration details
- `PRODUCTION_READY.md` - Production checklist

---

## 🎉 Ready!

Everything is set up. Follow the steps above to:
1. ✅ Create environment files
2. ✅ Test locally
3. ✅ Deploy to Vercel
4. ✅ Go live!

**Your full-stack app is production-ready! 🚀**

