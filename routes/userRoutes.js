const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, updateUserRole, deleteUser, checkUsername, getEmailByUsername } = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

// Public Routes
router.get('/check-username', checkUsername);
router.get('/email-by-username/:username', getEmailByUsername);

// Protected Routes (Require Firebase Token)
router.get('/profile', verifyToken, getUserProfile);

// Update profile with single photo upload (MP2 Requirement)
router.put('/profile', verifyToken, upload.single('photo'), updateUserProfile);

// Admin Protected Routes
router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.put('/:id/role', verifyToken, verifyAdmin, updateUserRole);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;
