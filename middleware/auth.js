const { auth } = require('../utils/firebaseAdmin');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'No token provided, unauthorized.' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;

    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user && decodedToken.email) {
      user = await User.findOne({ email: decodedToken.email });
      if (user) {
        user.firebaseUid = decodedToken.uid;
        if (!user.photoURL && decodedToken.picture) {
          user.photoURL = decodedToken.picture;
        }
        await user.save();
      }
    }

    if (!user) {
      const email =
        decodedToken.email ||
        `${decodedToken.uid}@users.thesaturationpoint.com`;
      const displayName =
        decodedToken.name ||
        (decodedToken.email ? decodedToken.email.split('@')[0] : 'User');

      user = await User.create({
        firebaseUid: decodedToken.uid,
        email,
        displayName,
        photoURL: decodedToken.picture || '/images/default-avatar.png',
        role: email === 'admin@admin.com' ? 'admin' : 'user',
      });
    }

    req.mongoUser = user;

    const exemptUrls = ['/api/users/profile', '/api/users/check-username'];
    const isExempt = exemptUrls.some((url) => req.originalUrl.startsWith(url));

    if (!user.username && !isExempt) {
      return res.status(403).json({
        message: 'Profile completion required.',
        needsProfileCompletion: true,
      });
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
