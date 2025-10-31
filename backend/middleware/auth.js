const { verifyIdToken } = require('../config/firebaseAdmin');

/**
 * Middleware to verify Firebase ID token from Authorization header
 * Adds user info to req.user if token is valid
 */
async function verifyToken(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header. Format: Bearer <token>',
      });
    }

    // Extract token
    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Token not provided',
      });
    }

    // Verify token
    const decodedToken = await verifyIdToken(idToken);
    
    // Add user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: error.message || 'Invalid or expired token',
    });
  }
}

/**
 * Optional: Middleware to check if user has specific role
 * (Can be extended for role-based access control)
 */
function requireRole(role) {
  return async (req, res, next) => {
    // This is a placeholder - implement role checking based on your user document structure
    // For now, we'll just check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // TODO: Fetch user document from Firestore and check role
    // const userDoc = await getFirestore().collection('users').doc(req.user.uid).get();
    // if (userDoc.data()?.role !== role) {
    //   return res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
    // }

    next();
  };
}

module.exports = {
  verifyToken,
  requireRole,
};

