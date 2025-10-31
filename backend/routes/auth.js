const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getFirestore, verifyIdToken } = require('../config/firebaseAdmin');

/**
 * @route   GET /api/auth/verify
 * @desc    Verify Firebase ID token and return user info
 * @access  Public (but requires valid token)
 */
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Missing authorization header',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(idToken);

    // Get user document from Firestore
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User document does not exist in Firestore',
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        profile: userData.profile || {},
        role: userData.role || 'patient',
        createdAt: userData.createdAt,
      },
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: error.message || 'Token verification failed',
    });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user's profile
 * @access  Private
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User document does not exist',
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      data: {
        uid: req.user.uid,
        email: req.user.email,
        profile: userData.profile || {},
        role: userData.role || 'patient',
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

module.exports = router;

