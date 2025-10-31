# 🚀 Vercel Deployment Guide

Complete guide to deploy both frontend and backend to Vercel.

## 📋 Pre-Deployment Checklist

- [ ] Frontend `.env.local` created with all Firebase config
- [ ] Backend `.env` created with Firebase Admin SDK credentials
- [ ] Both projects build successfully locally
- [ ] All API endpoints tested locally

---

## 🔧 Step 1: Environment Variables Setup

### Frontend Environment Variables (Vercel Dashboard)

1. Go to your Vercel project → Settings → Environment Variables
2. Add the following variables:

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

### Backend Environment Variables (Vercel Dashboard)

1. Go to your backend Vercel project → Settings → Environment Variables
2. Add the following variables:

```
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=pillsync-360
FIREBASE_CLIENT_EMAIL=your_service_account_email@pillsync-360.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**⚠️ Important:** 
- Keep `FIREBASE_PRIVATE_KEY` in quotes
- Preserve `\n` characters in the private key
- Update `CORS_ORIGIN` to your frontend URL after deployment

---

## 🎯 Step 2: Deploy Backend First

### Option A: Separate Vercel Project (Recommended)

1. **Create New Vercel Project:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your repository

2. **Configure Build Settings:**
   - **Root Directory:** `backend`
   - **Build Command:** (leave empty or `npm install`)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`
   - **Framework Preset:** Other

3. **Deploy:**
   - Vercel will detect `backend/vercel.json`
   - Add environment variables in dashboard
   - Click "Deploy"

4. **Get Backend URL:**
   - After deployment, note the URL (e.g., `https://pillsync-360-backend.vercel.app`)
   - Update frontend `NEXT_PUBLIC_API_BASE_URL` with this URL

### Option B: Monorepo Deployment (Single Project)

If deploying both in one project:

1. Configure `vercel.json` in root:
```json
{
  "buildCommand": "npm run build",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/backend/server.js"
    }
  ]
}
```

2. Deploy from root directory

---

## 🎨 Step 3: Deploy Frontend

1. **Create New Vercel Project:**
   - Import your repository
   - Or connect existing project

2. **Configure Build Settings:**
   - **Root Directory:** (root, leave empty)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Framework Preset:** Next.js

3. **Add Environment Variables:**
   - Use the backend URL from Step 2
   - Add all `NEXT_PUBLIC_*` variables

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

---

## ✅ Step 4: Update CORS After Deployment

After both are deployed:

1. **Get Frontend URL** (e.g., `https://pillsync-360.vercel.app`)
2. **Update Backend CORS:**
   - Go to backend Vercel project → Environment Variables
   - Update `CORS_ORIGIN` to frontend URL
   - Redeploy backend

---

## 🧪 Step 5: Testing

### Test Backend Health
```bash
curl https://your-backend-url.vercel.app/health
```

### Test Frontend
- Open frontend URL
- Login
- Try adding a medication
- Check browser console for API calls

---

## 🔍 Troubleshooting

### Backend Errors

**Error: "Missing Firebase Admin configuration"**
- Check environment variables are set in Vercel
- Verify `FIREBASE_PRIVATE_KEY` format (with quotes and `\n`)

**Error: "CORS error"**
- Update `CORS_ORIGIN` in backend environment variables
- Redeploy backend after updating

### Frontend Errors

**Error: "API request failed"**
- Check `NEXT_PUBLIC_API_BASE_URL` is correct
- Verify backend is deployed and accessible
- Check browser console for detailed errors

**Error: "Firebase not initialized"**
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Check Firebase config values are correct

### Build Errors

**Backend build fails:**
- Ensure `package.json` exists in `backend/` directory
- Check Node.js version (should be 18+)

**Frontend build fails:**
- Check for TypeScript errors
- Verify all imports are correct
- Check `next.config.ts` configuration

---

## 📊 Deployment URLs

After successful deployment:

- **Frontend:** `https://pillsync-360.vercel.app`
- **Backend:** `https://pillsync-360-backend.vercel.app`
- **Health Check:** `https://pillsync-360-backend.vercel.app/health`

---

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to main branch
- Pull request creation
- Manual deployment trigger

---

## 📝 Post-Deployment

1. ✅ Test all API endpoints
2. ✅ Verify authentication flow
3. ✅ Test medication CRUD operations
4. ✅ Check error handling
5. ✅ Verify CORS is working
6. ✅ Monitor logs in Vercel dashboard

---

## 🎉 Success!

Your full-stack app is now live on Vercel!

- Frontend: [Your Frontend URL]
- Backend API: [Your Backend URL]

