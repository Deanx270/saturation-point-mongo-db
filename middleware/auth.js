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

    const clientEmail =
      req.headers['x-user-email'] &&
      req.headers['x-user-email'].includes('@') &&
      !req.headers['x-user-email'].endsWith('@users.thesaturationpoint.com')
        ? req.headers['x-user-email'].toLowerCase().trim()
        : null;

    const resolvedEmail = decodedToken.email || clientEmail;

    if (user && resolvedEmail && user.email.endsWith('@users.thesaturationpoint.com')) {
      const conflictUser = await User.findOne({
        email: resolvedEmail,
        _id: { $ne: user._id },
      });
      if (conflictUser) {
        conflictUser.firebaseUid = decodedToken.uid;
        if (!conflictUser.photoURL && (decodedToken.picture || user.photoURL)) {
          conflictUser.photoURL = decodedToken.picture || user.photoURL;
        }
        await conflictUser.save();
        await User.deleteOne({ _id: user._id });
        user = conflictUser;
      } else {
        user.email = resolvedEmail;
        if (resolvedEmail === 'admin@admin.com') {
          user.role = 'admin';
        }
        await user.save();
      }
    }

    if (!user && resolvedEmail) {
      user = await User.findOne({ email: resolvedEmail });
      if (user) {
        user.firebaseUid = decodedToken.uid;
        if (!user.photoURL && decodedToken.picture) {
          user.photoURL = decodedToken.picture;
        }
        if (resolvedEmail === 'admin@admin.com') {
          user.role = 'admin';
        }
        await user.save();
      }
    }

    if (!user) {
      const clientName = req.headers['x-user-name']
        ? decodeURIComponent(req.headers['x-user-name'])
        : null;
      const clientPhoto = req.headers['x-user-photo'] || null;

      const email =
        resolvedEmail ||
        `${decodedToken.uid}@users.thesaturationpoint.com`;
      const displayName =
        decodedToken.name ||
        clientName ||
        (resolvedEmail ? resolvedEmail.split('@')[0] : 'User');

      user = await User.create({
        firebaseUid: decodedToken.uid,
        email,
        displayName,
        photoURL:
          decodedToken.picture ||
          clientPhoto ||
          '/images/default-avatar.png',
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
