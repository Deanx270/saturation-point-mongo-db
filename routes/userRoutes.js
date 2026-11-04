const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
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
} = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests. Please try again after 15 minutes.',
  },
});

router.get('/check-username', checkUsername);
router.get('/email-by-username/:username', getEmailByUsername);
router.post('/send-verification', emailRateLimiter, sendVerificationEmail);
router.post('/forgot-password', emailRateLimiter, forgotPassword);

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, upload.single('photo'), updateUserProfile);

router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.put('/:id/role', verifyToken, verifyAdmin, updateUserRole);
router.put('/:id/status', verifyToken, verifyAdmin, updateUserStatus);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;
