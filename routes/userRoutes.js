const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

// Protected Routes (Require Firebase Token)
router.get('/profile', verifyToken, getUserProfile);

// Update profile with single photo upload (MP2 Requirement)
router.put('/profile', verifyToken, upload.single('photo'), updateUserProfile);

module.exports = router;
