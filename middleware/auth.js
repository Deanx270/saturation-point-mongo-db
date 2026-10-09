const { auth } = require('../utils/firebaseAdmin');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, unauthorized.' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    
    // Check if user exists in MongoDB, if not, create them
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || decodedToken.email.split('@')[0],
        photoURL: decodedToken.picture || '/images/default-avatar.png',
        role: decodedToken.email === 'admin@admin.com' ? 'admin' : 'user'
      });
    }
    
    req.mongoUser = user; // Attach MongoDB user object to request
    
    // Block incomplete profiles from using the API, except for endpoints needed to complete the profile
    const exemptUrls = [
      '/api/users/profile',
      '/api/users/check-username'
    ];
    const isExempt = exemptUrls.some(url => req.originalUrl.startsWith(url));
    
    if (!user.username && !isExempt) {
      return res.status(403).json({ message: 'Profile completion required.', needsProfileCompletion: true });
    }

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.mongoUser && req.mongoUser.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access required.' });
  }
};

module.exports = { verifyToken, verifyAdmin };
