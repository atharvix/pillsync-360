# 🧪 Local Testing Guide

## ✅ Pre-Test Checklist

- [ ] `.env.local` created in root with all Firebase config
- [ ] Backend `.env` created with Firebase Admin SDK credentials
- [ ] Both `node_modules` installed (`npm install` in root and `backend/`)

---

## 🚀 Start Both Servers

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Firebase Admin SDK initialized successfully
╔════════════════════════════════════════════════════════════╗
║         PillSync-360 Backend API Server                    ║
╠════════════════════════════════════════════════════════════╣
║  Server running on port: 5000                              ║
║  Environment: development                                  ║
║  Health check: http://localhost:5000/health               ║
║  API base: http://localhost:5000/api                      ║
╚════════════════════════════════════════════════════════════╝
```

### Terminal 2: Frontend
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.0.1
  - Local:        http://localhost:3000
```

---

## ✅ Verification Tests

### 1. Backend Health Check

Open browser or run:
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "PillSync-360 Backend API is running",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "environment": "development"
}
```

### 2. Frontend Load Test

1. Open `http://localhost:3000`
2. Should see homepage with "Get Started" button
3. No console errors

### 3. Authentication Flow

#### Sign Up:
1. Click "Sign Up" or go to `http://localhost:3000/signup`
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: test1234
   - Role: Patient
3. Click "Create Account"
4. Should redirect to dashboard
5. Check backend terminal - should see API calls

#### Login:
1. If already signed up, go to `http://localhost:3000/login`
2. Enter email and password
3. Click "Login"
4. Should redirect to dashboard

### 4. Medication CRUD Tests

#### Add Medication:
1. On dashboard, find "Medication List" section
2. Click "Add" button
3. Fill form:
   - Medicine Name: Aspirin
   - Dosage: 100mg
   - Frequency: 1/day
   - Start Date: 01 Nov
4. Click "Add Medication"
5. **Check backend terminal** - should see:
   ```
   POST /api/medications
   ```
6. Medication should appear in list (real-time from Firestore)

#### Update Medication:
1. Find medication in list
2. Click "Edit Dosage"
3. Change dosage (e.g., 200mg)
4. Select reason
5. Click "Save"
6. **Check backend terminal** - should see:
   ```
   PUT /api/medications/:id
   ```
7. Medication should update in list

#### Delete Medication:
1. Click "Delete" on any medication
2. Confirm deletion
3. **Check backend terminal** - should see:
   ```
   DELETE /api/medications/:id
   ```
4. Medication should disappear

### 5. Upload Section Test

1. Go to "Upload: Prescription & Pharmacy Bill" section
2. Click file input, select an image
3. Click "Run OCR"
4. Wait for processing
5. Review extracted medications
6. Click "Confirm to list"
7. **Check backend terminal** - should see multiple POST requests
8. Medications should appear in list

### 6. Real-Time Sync Test

1. Open dashboard in two browser windows/tabs
2. Add medication in one window
3. Should appear in other window automatically (Firestore real-time)

---

## 🔍 Debugging Checklist

### Backend Not Starting?

**Error: "Missing Firebase Admin configuration"**
- Check `backend/.env` exists
- Verify all required variables are set:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

**Error: "Port 5000 already in use"**
- Change `PORT` in `backend/.env` to `5001`
- Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to `http://localhost:5001`

### Frontend Not Connecting to Backend?

**Error: "Failed to fetch" or CORS error**
- Check backend is running
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL

**Error: "User not authenticated"**
- Check Firebase config in `.env.local`
- Verify user is logged in
- Check browser console for auth errors

### Medication Operations Not Working?

**Error: "401 Unauthorized"**
- Check user is logged in
- Verify token is being sent (check Network tab)
- Check backend is receiving Authorization header

**Error: "500 Internal Server Error"**
- Check backend terminal for error logs
- Verify Firebase Admin SDK initialized
- Check Firestore security rules allow operations

---

## 📊 Expected Backend Logs

When everything works, you should see:

```
2025-01-01T12:00:00.000Z - GET /health
2025-01-01T12:00:00.000Z - POST /api/medications
2025-01-01T12:00:00.000Z - GET /api/medications
2025-01-01T12:00:00.000Z - PUT /api/medications/:id
2025-01-01T12:00:00.000Z - DELETE /api/medications/:id
```

---

## ✅ Success Criteria

- [ ] Backend health check returns success
- [ ] Frontend loads without errors
- [ ] Can sign up and login
- [ ] Dashboard loads after login
- [ ] Can add medication (see backend logs)
- [ ] Medication appears in list
- [ ] Can update medication
- [ ] Can delete medication
- [ ] Upload section works
- [ ] Real-time sync works (test in 2 windows)

---

## 🎯 Next: Deploy to Vercel

Once all tests pass locally, proceed to Vercel deployment!

See `DEPLOYMENT_GUIDE.md` for step-by-step instructions.

