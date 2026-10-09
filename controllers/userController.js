const User = require('../models/User');
const { sendVerificationEmail: sendEmailVerification } = require('../utils/emailService');

// Get Current User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.mongoUser._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update User Profile (MP2 Requirement)
const updateUserProfile = async (req, res) => {
  try {
    const { displayName, username } = req.body;
    const updateData = {};

    if (displayName) updateData.displayName = displayName;
    if (username) updateData.username = username;
    
    // If a file was uploaded to Cloudinary, update the photoURL
    if (req.file) {
      updateData.photoURL = req.file.path; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.mongoUser._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Check if username is available (Public)
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: 'Username required' });
    const user = await User.findOne({ username });
    res.status(200).json({ available: !user });
  } catch (error) {
    res.status(500).json({ message: 'Error checking username', error: error.message });
  }
};

// Get email by username (Public, for login)
const getEmailByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user email', error: error.message });
  }
};

// Send Verification Email
const sendVerificationEmail = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    const { auth } = require('../utils/firebaseAdmin');
    const rawVerificationUrl = await auth.generateEmailVerificationLink(email);
    
    // Intercept the Firebase action URL and rewrite it to point to our gorgeous custom React page
    const urlObj = new URL(rawVerificationUrl);
    const verificationUrl = `http://localhost:5173/verify-email${urlObj.search}`;
    
    const sent = await sendEmailVerification(email, verificationUrl, firstName, lastName);
    if (sent) {
      res.status(200).json({ message: 'Verification email sent' });
    } else {
      res.status(500).json({ message: 'Failed to send verification email' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error generating verification email', error: error.message });
  }
};

// ADMIN: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// ADMIN: Update user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.status(200).json({ message: 'User role updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

// ADMIN: Delete user
const { auth } = require('../utils/firebaseAdmin');
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Delete from Firebase Auth
    try {
      await auth.deleteUser(user.firebaseUid);
    } catch (firebaseErr) {
      console.error('Failed to delete from Firebase:', firebaseErr);
    }
    
    // Delete from MongoDB
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = { 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  updateUserRole, 
  deleteUser,
  checkUsername,
  getEmailByUsername,
  sendVerificationEmail
};
