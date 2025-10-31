# Backend Setup Guide

## 🔧 Initial Setup

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
cd backend
npm install
```

### 2. Create `.env` File

Create a `.env` file in the `backend/` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin SDK Configuration
# Get these from Firebase Console > Project Settings > Service Accounts
FIREBASE_PROJECT_ID=pillsync-360
FIREBASE_CLIENT_EMAIL=your_service_account_email@pillsync-360.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=pillsync-360.firebasestorage.app

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pillsync-360**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Extract the following values from the JSON:

   - `project_id` → Use as `FIREBASE_PROJECT_ID`
   - `client_email` → Use as `FIREBASE_CLIENT_EMAIL`
   - `private_key` → Use as `FIREBASE_PRIVATE_KEY` (keep it in quotes with `\n`)

**Example:**
```env
FIREBASE_PROJECT_ID=pillsync-360
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@pillsync-360.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

⚠️ **Important:** Keep the private key in double quotes and preserve the `\n` newline characters.

### 4. Update CORS Origin

Update `CORS_ORIGIN` to match your frontend URL:

- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

### 5. Start the Server

```bash
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## ✅ Verify Installation

1. **Check health endpoint:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Expected response:**
   ```json
   {
     "success": true,
     "message": "PillSync-360 Backend API is running",
     "timestamp": "2025-01-01T12:00:00.000Z",
     "environment": "development"
   }
   ```

## 🔍 Troubleshooting

### Error: "Missing Firebase Admin configuration"

- Ensure `.env` file exists in `backend/` directory
- Check all required environment variables are set
- Verify `FIREBASE_PRIVATE_KEY` includes the full key with `-----BEGIN PRIVATE KEY-----` markers

### Error: "Cannot find module"

- Run `npm install` in the `backend/` directory
- Ensure you're running commands from the `backend/` directory

### Port Already in Use

- Change `PORT` in `.env` to a different port (e.g., 5001)
- Or stop the process using port 5000

## 🚀 Next Steps

Once the server is running:

1. Test authentication endpoint with a Firebase ID token
2. Test medication CRUD operations
3. Connect your Next.js frontend to use the backend API
4. Deploy to Render/Vercel when ready

See `README.md` for full API documentation.

