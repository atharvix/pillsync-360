# PillSync-360 Backend API

Backend API server for PillSync-360 medication management system, built with Node.js, Express, and Firebase Admin SDK.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase project with Firestore enabled
- Firebase service account credentials

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

3. **Get Firebase Admin SDK credentials:**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (`pillsync-360`)
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file
   - Extract the following values and add to `.env`:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
     - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and `\n` characters)

4. **Start the server:**

```bash
# Development mode (with nodemon for auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── firebaseAdmin.js      # Firebase Admin SDK initialization
├── middleware/
│   └── auth.js               # Authentication middleware
├── routes/
│   ├── auth.js               # Authentication routes
│   └── medications.js        # Medication CRUD routes
├── .env                      # Environment variables (not in git)
├── .env.example             # Environment variables template
├── server.js                # Express server setup
└── package.json             # Dependencies and scripts
```

## 🔌 API Endpoints

### Health Check

```
GET /health
```

Returns server status.

### Authentication

#### Verify Token
```
GET /api/auth/verify
Headers: Authorization: Bearer <firebase_id_token>
```

Verifies Firebase ID token and returns user information.

#### Get Profile
```
GET /api/auth/profile
Headers: Authorization: Bearer <firebase_id_token>
```

Returns authenticated user's profile from Firestore.

### Medications

All medication endpoints require authentication via `Authorization: Bearer <token>` header.

#### Get All Medications
```
GET /api/medications
```

Returns all medications for the authenticated user.

#### Get Single Medication
```
GET /api/medications/:id
```

Returns a specific medication by ID.

#### Create Medication
```
POST /api/medications
Body: {
  "name": "Metformin",
  "dosage": "500mg",
  "frequency": "2/day",
  "start": "31 Oct",
  "end": "",
  "addedBy": "Doctor"
}
```

#### Update Medication
```
PUT /api/medications/:id
Body: {
  "dosage": "750mg",
  "frequency": "3/day"
}
```

#### Delete Medication
```
DELETE /api/medications/:id
```

## 🔐 Authentication

All protected routes require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

To get the token from your Next.js frontend:

```javascript
import { auth } from '@/src/firebase';
import { getIdToken } from 'firebase/auth';

// Get current user's ID token
const token = await getIdToken(auth.currentUser);

// Use in API request
fetch('http://localhost:5000/api/medications', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🌐 CORS Configuration

Update `CORS_ORIGIN` in `.env` to allow your frontend domain:

```env
CORS_ORIGIN=http://localhost:3000
```

For production:
```env
CORS_ORIGIN=https://your-domain.com
```

## 🚀 Deployment

### Deploy to Render

1. **Create a new Web Service** on [Render](https://render.com)
2. **Connect your repository**
3. **Set environment variables** in Render dashboard:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `PORT` (usually set automatically by Render)
   - `NODE_ENV=production`
   - `CORS_ORIGIN` (your frontend URL)
4. **Build command:** `npm install`
5. **Start command:** `npm start`

### Deploy to Vercel Functions

1. Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. Set environment variables in Vercel dashboard
3. Deploy

## 🧪 Testing with cURL

```bash
# Health check
curl http://localhost:5000/health

# Get medications (replace TOKEN with actual Firebase ID token)
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/medications

# Create medication
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Aspirin","dosage":"100mg","frequency":"1/day"}' \
  http://localhost:5000/api/medications
```

## 📝 Notes

- Never commit `.env` file or service account keys to git
- Firebase Admin SDK has full access to your Firestore - keep credentials secure
- All routes validate user ownership of resources
- Timestamps are handled automatically by Firestore

## 🐛 Troubleshooting

**Error: "Missing Firebase Admin configuration"**
- Check your `.env` file has all required variables
- Ensure `FIREBASE_PRIVATE_KEY` includes the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers

**Error: "Invalid token"**
- Token may be expired - get a new token from frontend
- Ensure token is sent in `Authorization: Bearer <token>` format

**CORS errors**
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- Ensure frontend includes credentials if needed

## 📄 License

ISC

