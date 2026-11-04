const User = require('../models/User');
const {
  sendVerificationEmail: sendEmailVerification,
  sendPasswordResetEmail,
} = require('../utils/emailService');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.mongoUser._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { displayName, username, email } = req.body;
    const updateData = {};

    if (displayName) updateData.displayName = displayName;
    if (username) updateData.username = username;
    if (email && email.includes('@')) {
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.mongoUser._id },
      });
      if (existing) {
        return res.status(400).json({ message: 'Email is already in use.' });
      }
      updateData.email = normalizedEmail;
    }

    if (req.file) {
      updateData.photoURL = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.mongoUser._id,
      updateData,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'Field';
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken`,
      });
    }
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username)
      return res.status(400).json({ message: 'Username required' });
    const user = await User.findOne({ username });
    res.status(200).json({ available: !user });
  } catch (error) {
    res.status(500).json({
      message: 'Error checking username',
      error: error.message,
    });
  }
};

const getEmailByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ email: user.email });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user email',
      error: error.message,
    });
  }
};

const sendVerificationEmail = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    const { auth } = require('../utils/firebaseAdmin');
    const rawVerificationUrl = await auth.generateEmailVerificationLink(email);

    const urlObj = new URL(rawVerificationUrl);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verificationUrl = `${clientUrl}/verify-email${urlObj.search}`;

    const sent = await sendEmailVerification(
      email,
      verificationUrl,
      firstName,
      lastName,
    );
    if (sent) {
      res.status(200).json({ message: 'Verification email sent' });
    } else {
      res.status(500).json({
        message: 'Failed to send verification email',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error generating verification email',
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const startTime = Date.now();
  try {
    const { identifier } = req.body;
    if (!identifier || !identifier.trim()) {
      return res
        .status(400)
        .json({ message: 'Email or username is required.' });
    }

    const cleanInput = identifier.trim();
    const query = cleanInput.includes('@')
      ? { email: cleanInput.toLowerCase() }
      : { username: cleanInput };

    const user = await User.findOne(query);
    if (!user) {
      const targetDuration = 800 + Math.floor(Math.random() * 250);
      const elapsed = Date.now() - startTime;
      if (elapsed < targetDuration) {
        await new Promise((resolve) =>
          setTimeout(resolve, targetDuration - elapsed),
        );
      }
      return res.status(200).json({
        message:
          'If an account matches that email or username, a password reset link has been sent.',
      });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({
        message: 'Your account has been disabled. Please contact support.',
      });
    }

    const { auth } = require('../utils/firebaseAdmin');
    const rawResetUrl = await auth.generatePasswordResetLink(user.email);
    const urlObj = new URL(rawResetUrl);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password${urlObj.search}`;

    const sent = await sendPasswordResetEmail(
      user.email,
      resetUrl,
      user.displayName,
    );
    if (sent) {
      const targetDuration = 800 + Math.floor(Math.random() * 250);
      const elapsed = Date.now() - startTime;
      if (elapsed < targetDuration) {
        await new Promise((resolve) =>
          setTimeout(resolve, targetDuration - elapsed),
        );
      }
      res.status(200).json({
        message:
          'If an account matches that email or username, a password reset link has been sent.',
      });
    } else {
      res
        .status(500)
        .json({ message: 'Failed to send password reset email via Mailtrap.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error generating password reset link',
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    );
    res.status(200).json({
      message: 'User role updated',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating role',
      error: error.message,
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be disabled.' });
    }
    user.status = status;
    await user.save();

    if (user.firebaseUid) {
      try {
        if (status === 'disabled') {
          await auth.updateUser(user.firebaseUid, { disabled: true });
          await auth.revokeRefreshTokens(user.firebaseUid);
        } else {
          await auth.updateUser(user.firebaseUid, { disabled: false });
        }
      } catch (fbErr) {
        console.error('Firebase status update error:', fbErr);
      }
    }

    res.status(200).json({
      message: `User account has been ${status === 'disabled' ? 'disabled' : 'enabled'}.`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user status',
      error: error.message,
    });
  }
};

const { auth } = require('../utils/firebaseAdmin');
const { cloudinary } = require('../utils/cloudinary');
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    try {
      await auth.deleteUser(user.firebaseUid);
    } catch (firebaseErr) {
      console.error('Failed to delete from Firebase:', firebaseErr);
    }

    if (user.photoURL && user.photoURL.includes('cloudinary.com')) {
      try {
        const parts = user.photoURL.split('/');
        const filename = parts[parts.length - 1];
        const publicId = `saturation_point_new/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error('Failed to delete from Cloudinary:', cloudErr);
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  checkUsername,
  getEmailByUsername,
  sendVerificationEmail,
  forgotPassword,
};
