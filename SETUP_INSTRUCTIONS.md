# 🔧 Setup Instructions

## ✅ Integration Complete - Final Steps

Your frontend and backend are now fully integrated! Here's what you need to do:

---

## 📝 Step 1: Create `.env.local` File

Create a file named `.env.local` in the **root directory** (same level as `package.json`) with:

```env
# Backend API URL
# For local development:
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# For production (after backend is deployed):
# NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.vercel.app

# Firebase Configuration (get from Firebase Console)
# Go to: Firebase Console > Project Settings > General > Your apps > Web app
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCrbLZprYWvBn6eF30dxK9nifoCBwFaDTI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pillsync-360.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pillsync-360
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=876450983631
NEXT_PUBLIC_FIREBASE_APP_ID=1:876450983631:web:08733dc6311ea24b66d1ba
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XRCJ9GTTHV
```

---

## 🚀 Step 2: Test Locally

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Should see: `✅ Firebase Admin SDK initialized successfully`
Should see: `Server running on port: 5000`

### Start Frontend (Terminal 2)
```bash
npm run dev
```
Should start on `http://localhost:3000`

### Test
1. Open `http://localhost:3000`
2. Sign up / Login
3. Try adding a medication
4. Check backend terminal for API logs
5. Check browser console for successful API calls

---

## 🎯 Step 3: Deploy to Vercel

### Deploy Backend First

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New" → "Project"**
3. **Import your repository**
4. **Configure:**
   - **Root Directory:** `backend`
   - **Framework Preset:** Other
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)

5. **Add Environment Variables:**
   ```
   PORT=5000
   NODE_ENV=production
   FIREBASE_PROJECT_ID=pillsync-360
   FIREBASE_CLIENT_EMAIL=your_service_account_email@pillsync-360.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
   CORS_ORIGIN=http://localhost:3000
   ```

6. **Deploy** and copy the URL (e.g., `https://pillsync-360-backend.vercel.app`)

### Deploy Frontend

1. **Create New Vercel Project** (or use existing)
2. **Configure:**
   - **Root Directory:** (root, leave empty)
   - **Framework Preset:** Next.js

3. **Add Environment Variables:**
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

4. **Deploy**

### Update CORS

1. **Get frontend URL** from Vercel (e.g., `https://pillsync-360.vercel.app`)
2. **Go to backend project** → Settings → Environment Variables
3. **Update `CORS_ORIGIN`** to frontend URL
4. **Redeploy backend**

---

## ✅ What Was Integrated

### Frontend Changes:
- ✅ `lib/apiClient.ts` - API client with auth token handling
- ✅ `lib/store.tsx` - Uses backend API for medication CRUD
- ✅ `src/firebase.js` - Uses environment variables
- ✅ All components use backend via `useStore()` hook

### Backend:
- ✅ Express server with Firebase Admin SDK
- ✅ Authentication middleware
- ✅ Medication CRUD endpoints
- ✅ Ready for deployment

### Data Flow:
- **Writes:** Frontend → Backend API → Firestore (via Admin SDK)
- **Reads:** Firestore → Frontend (real-time via onSnapshot)

---

## 🧪 Testing Checklist

- [ ] Backend health check works: `curl http://localhost:5000/health`
- [ ] Frontend loads: `http://localhost:3000`
- [ ] Can sign up / login
- [ ] Can add medication (check backend logs)
- [ ] Medication appears in list (real-time sync)
- [ ] Can update medication
- [ ] Can delete medication
- [ ] No console errors

---

## 📚 Documentation Files

- `INTEGRATION_COMPLETE.md` - Full integration details
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- `QUICK_START.md` - Quick reference
- `backend/README.md` - Backend API documentation

---

## 🎉 Ready!

Your full-stack app is integrated and ready for deployment! 🚀

