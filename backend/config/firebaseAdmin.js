const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let initialized = false;

function initializeFirebaseAdmin() {
  if (initialized) {
    return admin;
  }

  try {
    // Check if Firebase Admin is already initialized
    if (admin.apps.length === 0) {
      // Initialize with service account credentials from environment variables
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      // Validate required environment variables
      if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error(
          'Missing Firebase Admin configuration. Please check your .env file.\n' +
          'Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.projectId}.appspot.com`,
      });

      console.log('✅ Firebase Admin SDK initialized successfully');
      initialized = true;
    } else {
      console.log('✅ Firebase Admin SDK already initialized');
      initialized = true;
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error.message);
    throw error;
  }

  return admin;
}

// Get Firestore instance
function getFirestore() {
  const admin = initializeFirebaseAdmin();
  return admin.firestore();
}

// Get Auth instance
function getAuth() {
  const admin = initializeFirebaseAdmin();
  return admin.auth();
}

// Verify Firebase ID Token
async function verifyIdToken(idToken) {
  try {
    const admin = initializeFirebaseAdmin();
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
}

module.exports = {
  initializeFirebaseAdmin,
  getFirestore,
  getAuth,
  verifyIdToken,
  admin: initializeFirebaseAdmin(),
};

