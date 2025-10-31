# 🚀 Complete Vercel Deployment Guide

Step-by-step guide to deploy both frontend and backend to Vercel.

---

## 📋 Prerequisites

- [ ] Local testing passes (see `LOCAL_TESTING.md`)
- [ ] Backend `.env` configured with Firebase Admin SDK
- [ ] Frontend `.env.local` configured
- [ ] GitHub repository connected (recommended)

---

## 🎯 Deployment Strategy

**Option 1: Separate Projects (Recommended)**
- Frontend: One Vercel project
- Backend: Separate Vercel project
- Easier to manage, scale, and debug

**Option 2: Monorepo (Single Project)**
- Both in one Vercel project
- Use rewrites to route `/api/*` to backend

We'll use **Option 1** for clarity.

---

## 🔧 Step 1: Deploy Backend

### 1.1 Create Backend Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. **Import Git Repository** (or create new)
4. Select your repository

### 1.2 Configure Backend Project

**Project Settings:**
- **Project Name:** `pillsync-360-backend` (or your choice)
- **Root Directory:** `backend`
- **Framework Preset:** Other
- **Build Command:** (leave empty)
- **Output Directory:** (leave empty)
- **Install Command:** `npm install`

### 1.3 Add Environment Variables

Click **"Environment Variables"** and add:

```env
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=pillsync-360
FIREBASE_CLIENT_EMAIL=your_service_account_email@pillsync-360.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
CORS_ORIGIN=http://localhost:3000
```

⚠️ **Important:**
- Get `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` from Firebase Console → Service Accounts
- Keep `FIREBASE_PRIVATE_KEY` in quotes with `\n` characters
- We'll update `CORS_ORIGIN` after frontend deployment

### 1.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. **Copy the deployment URL** (e.g., `https://pillsync-360-backend.vercel.app`)

### 1.5 Verify Backend

Test the health endpoint:
```bash
curl https://your-backend-url.vercel.app/health
```

Should return:
```json
{
  "success": true,
  "message": "PillSync-360 Backend API is running"
}
```

---

## 🎨 Step 2: Deploy Frontend

### 2.1 Create Frontend Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. **Import the same repository** (or different if separated)

### 2.2 Configure Frontend Project

**Project Settings:**
- **Project Name:** `pillsync-360` (or your choice)
- **Root Directory:** (leave empty - root)
- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCrbLZprYWvBn6eF30dxK9nifoCBwFaDTI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pillsync-360.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pillsync-360
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=876450983631
NEXT_PUBLIC_FIREBASE_APP_ID=1:876450983631:web:08733dc6311ea24b66d1ba
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XRCJ9GTTHV
```

⚠️ **Important:**
- Replace `https://your-backend-url.vercel.app` with your actual backend URL from Step 1.4

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. **Copy the frontend URL** (e.g., `https://pillsync-360.vercel.app`)

---

## 🔄 Step 3: Update CORS

### 3.1 Update Backend CORS

1. Go to **Backend Vercel Project** → **Settings** → **Environment Variables**
2. Find `CORS_ORIGIN`
3. **Edit** to use your frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```
4. **Redeploy backend** (Vercel will auto-redeploy or click "Redeploy")

---

## ✅ Step 4: Final Verification

### 4.1 Test Production URLs

**Backend Health:**
```bash
curl https://your-backend-url.vercel.app/health
```

**Frontend:**
1. Open `https://your-frontend-url.vercel.app`
2. Should load homepage

### 4.2 Test Full Flow

1. **Sign Up** on production frontend
2. **Login** with credentials
3. **Add Medication** - should work via backend API
4. **Check Backend Logs** in Vercel dashboard:
   - Go to Backend Project → Functions → View Logs
   - Should see API requests

### 4.3 Verify API Calls

1. Open browser DevTools → Network tab
2. Add a medication
3. Should see request to: `https://your-backend-url.vercel.app/api/medications`
4. Check response is successful (200 OK)

---

## 🔍 Troubleshooting

### Issue: CORS Error

**Symptom:** Browser console shows CORS error

**Solution:**
1. Verify `CORS_ORIGIN` in backend env vars matches frontend URL exactly
2. Ensure no trailing slashes
3. Redeploy backend after updating

### Issue: 401 Unauthorized

**Symptom:** API returns 401 errors

**Solution:**
1. Check user is logged in
2. Verify Firebase config in frontend env vars
3. Check backend logs for token validation errors

### Issue: Backend Returns 500

**Symptom:** Backend API returns 500 errors

**Solution:**
1. Check Vercel Function Logs
2. Verify all backend env vars are set correctly
3. Check Firebase Admin SDK credentials are valid
4. Ensure Firestore rules allow operations

### Issue: Build Fails

**Symptom:** Deployment fails during build

**Solution:**
1. **Frontend:** Check for TypeScript errors - run `npm run build` locally
2. **Backend:** Ensure `package.json` is correct in `backend/` directory
3. Check Vercel build logs for specific errors

---

## 📊 Monitoring

### Vercel Dashboard

- **Frontend:** View deployments, logs, analytics
- **Backend:** View function logs, invocations, errors

### Check Function Logs

1. Go to Backend Project → **Functions** tab
2. Click on function name
3. View real-time logs

---

## 🎉 Success!

Once both are deployed and tested:

- ✅ Frontend: `https://your-frontend-url.vercel.app`
- ✅ Backend: `https://your-backend-url.vercel.app`
- ✅ Health Check: `https://your-backend-url.vercel.app/health`

**Your full-stack app is now live! 🚀**

---

## 📝 Post-Deployment

- [ ] Update documentation with production URLs
- [ ] Set up custom domains (optional)
- [ ] Configure monitoring/alerts (optional)
- [ ] Set up staging environment (optional)

---

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to main/master branch
- Manual deployment trigger

Both frontend and backend will auto-deploy when you push changes!

