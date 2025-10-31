# 🧪 Integration Test Script

## Automated Testing Guide

### Pre-Test Setup

1. **Create `.env.local`** (see `ENV_SETUP.md`)
2. **Create `backend/.env`** (see `ENV_SETUP.md`)
3. **Install dependencies:**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend && npm install
   ```

---

## Test Procedure

### Step 1: Start Backend

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Firebase Admin SDK initialized successfully
Server running on port: 5000
Health check: http://localhost:5000/health
```

**Verify:**
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "PillSync-360 Backend API is running",
  "timestamp": "...",
  "environment": "development"
}
```

### Step 2: Start Frontend

**Terminal 2:**
```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.1
- Local: http://localhost:3000
```

**Verify:**
- Open `http://localhost:3000`
- Should see homepage
- No console errors

### Step 3: Test Authentication

1. **Sign Up:**
   - Go to `/signup`
   - Fill form: Name, Email, Password, Role
   - Click "Create Account"
   - Should redirect to dashboard
   - Check backend logs: Should see initialization

2. **Login:**
   - Go to `/login`
   - Enter credentials
   - Click "Login"
   - Should redirect to dashboard

### Step 4: Test Medication CRUD

#### Test CREATE
1. On dashboard, click "Add" in Medication List
2. Fill form:
   - Name: Test Medication
   - Dosage: 100mg
   - Frequency: 1/day
3. Click "Add Medication"
4. **Check Backend Terminal:**
   ```
   POST /api/medications
   ```
5. **Check Frontend:**
   - Medication should appear in list
   - Should see real-time sync

#### Test READ
1. Medication should appear in list automatically
2. Check it has correct data
3. List is populated from Firestore (real-time)

#### Test UPDATE
1. Click "Edit Dosage" on any medication
2. Change dosage to "200mg"
3. Select reason
4. Click "Save"
5. **Check Backend Terminal:**
   ```
   PUT /api/medications/:id
   ```
6. Medication should update in list

#### Test DELETE
1. Click "Delete" on any medication
2. Confirm deletion
3. **Check Backend Terminal:**
   ```
   DELETE /api/medications/:id
   ```
4. Medication should disappear from list

### Step 5: Test Upload Section

1. Click file input in Upload Section
2. Select an image file
3. Click "Run OCR"
4. Wait for processing
5. Review extracted medications
6. Click "Confirm to list"
7. **Check Backend Terminal:**
   - Should see multiple `POST /api/medications` requests
8. Medications should appear in list

### Step 6: Verify Real-Time Sync

1. Open dashboard in **two browser windows**
2. In Window 1: Add a medication
3. **Window 2 should update automatically** (Firestore listener)
4. In Window 2: Delete a medication
5. **Window 1 should update automatically**

---

## ✅ Success Criteria

All tests should pass:

- [ ] Backend health check returns success
- [ ] Frontend loads without errors
- [ ] Sign up creates user in Firestore
- [ ] Login works and redirects
- [ ] Add medication → Backend receives POST request
- [ ] Medication appears in list (real-time)
- [ ] Update medication → Backend receives PUT request
- [ ] Delete medication → Backend receives DELETE request
- [ ] Real-time sync works across windows
- [ ] Upload section adds via backend API
- [ ] No console errors
- [ ] No CORS errors

---

## 🐛 Troubleshooting

### Backend won't start
- Check `backend/.env` exists
- Verify Firebase Admin SDK credentials
- Check all required env vars are set

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_BASE_URL` is correct
- Verify backend is running
- Check CORS_ORIGIN in backend `.env`

### 401 Unauthorized errors
- Verify user is logged in
- Check Firebase config in `.env.local`
- Verify token is being sent (check Network tab)

### Medications not appearing
- Check backend logs for API calls
- Verify Firestore listener is active
- Check browser console for errors

---

## 📊 Test Results Log

Document your test results:

```
Date: ___________
Backend Health: [ ] Pass [ ] Fail
Frontend Load: [ ] Pass [ ] Fail
Sign Up: [ ] Pass [ ] Fail
Login: [ ] Pass [ ] Fail
Add Medication: [ ] Pass [ ] Fail
Update Medication: [ ] Pass [ ] Fail
Delete Medication: [ ] Pass [ ] Fail
Real-Time Sync: [ ] Pass [ ] Fail
Upload Section: [ ] Pass [ ] Fail

Overall: [ ] Ready for Production [ ] Needs Fixes
```

---

## 🎯 Next: Deploy to Vercel

Once all tests pass, proceed to `VERCEL_DEPLOYMENT.md`

