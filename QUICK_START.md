# 🚀 Quick Start Guide

## Local Development Setup

### 1. Environment Variables

**Frontend (`.env.local` in root):**
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

**Backend (`backend/.env`):**
```env
PORT=5000
FIREBASE_PROJECT_ID=pillsync-360
FIREBASE_CLIENT_EMAIL=your_service_account_email@pillsync-360.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
CORS_ORIGIN=http://localhost:3000
```

### 2. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 3. Test

1. Open `http://localhost:3000`
2. Sign up / Login
3. Add a medication → Should go through backend API
4. Check `http://localhost:5000/health` → Should return success

---

## Vercel Deployment

### Backend Deployment

1. Go to Vercel → New Project
2. Import repository
3. **Root Directory:** `backend`
4. **Framework:** Other
5. Add environment variables (see `DEPLOYMENT_GUIDE.md`)
6. Deploy
7. Copy backend URL

### Frontend Deployment

1. Go to Vercel → New Project (or existing)
2. **Root Directory:** (root)
3. **Framework:** Next.js
4. Add environment variables:
   - `NEXT_PUBLIC_API_BASE_URL` = your backend URL
   - All `NEXT_PUBLIC_FIREBASE_*` variables
5. Deploy

### Update CORS

After both deployed:
1. Update backend `CORS_ORIGIN` = frontend URL
2. Redeploy backend

---

## ✅ Integration Complete!

- ✅ API Client created (`lib/apiClient.ts`)
- ✅ Store uses backend API for medication writes
- ✅ Firestore used for real-time reads
- ✅ Environment variables configured
- ✅ Deployment configs ready
- ✅ Build successful

**Next:** Fill in `.env.local` and test locally! 🎉

