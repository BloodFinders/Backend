const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, verifyOtp, login, refresh, forgotPassword, resetPassword, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Input validator middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

router.post(
  '/register',
  [
    body('fullName', 'Full Name is required').notEmpty(),
    body('email', 'Please provide a valid email').isEmail(),
    body('phone', 'Phone number is required').notEmpty(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  validate,
  register
);

router.post(
  '/verify-otp',
  [
    body('email', 'Email is required').isEmail(),
    body('otp', 'OTP must be 4 digits').isLength({ min: 4, max: 4 }),
  ],
  validate,
  verifyOtp
);

router.post(
  '/login',
  [
    body('email', 'Email is required').notEmpty(),
    body('password', 'Password is required').notEmpty(),
  ],
  validate,
  login
);

router.post(
  '/refresh',
  [
    body('refreshToken', 'Refresh token is required').notEmpty(),
  ],
  validate,
  refresh
);

router.post(
  '/forgot-password',
  [body('email', 'Please provide a valid email').isEmail()],
  validate,
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('email', 'Email is required').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('otp', 'OTP must be 4 digits').isLength({ min: 4, max: 4 }),
  ],
  validate,
  resetPassword
);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
