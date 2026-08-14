const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  register, verifyOtp, login, refresh, forgotPassword, resetPassword, getMe, updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authStrictLimiter, otpLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ── Valid blood groups ─────────────────────────────────────────────────────
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ── Input validator middleware ─────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

// ── POST /register ─────────────────────────────────────────────────────────
router.post(
  '/register',
  authStrictLimiter,
  [
    body('fullName', 'Full name is required')
      .notEmpty()
      .isString()
      .isLength({ max: 100 }).withMessage('Full name must not exceed 100 characters')
      .trim(),
    body('email', 'Please provide a valid email')
      .isEmail()
      .normalizeEmail()
      .isLength({ max: 254 }).withMessage('Email must not exceed 254 characters'),
    body('phone', 'Phone must be exactly 10 digits')
      .matches(/^[0-9]{10}$/),
    body('password', 'Password must be at least 8 characters')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters'),
    body('bloodGroup', 'Invalid blood group')
      .optional()
      .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`),
    body('city', 'City must not exceed 100 characters')
      .optional()
      .isLength({ max: 100 })
      .trim(),
  ],
  validate,
  register
);

// ── POST /verify-otp ───────────────────────────────────────────────────────
router.post(
  '/verify-otp',
  otpLimiter,
  [
    body('email', 'Please provide a valid email')
      .isEmail()
      .normalizeEmail(),
    body('otp', 'OTP must be exactly 4 digits')
      .isLength({ min: 4, max: 4 })
      .matches(/^[0-9]{4}$/).withMessage('OTP must contain only digits'),
  ],
  validate,
  verifyOtp
);

// ── POST /login ────────────────────────────────────────────────────────────
router.post(
  '/login',
  authStrictLimiter,
  [
    body('email', 'Email or phone is required')
      .notEmpty()
      .isLength({ max: 254 }).withMessage('Input too long')
      .trim(),
    body('password', 'Password is required')
      .notEmpty()
      .isLength({ max: 128 }).withMessage('Password too long'),
  ],
  validate,
  login
);

// ── POST /refresh ──────────────────────────────────────────────────────────
router.post(
  '/refresh',
  authStrictLimiter, // Prevent brute-force token rotation attacks
  [
    body('refreshToken', 'Refresh token is required')
      .notEmpty()
      .isLength({ max: 512 }).withMessage('Invalid token format'),
  ],
  validate,
  refresh
);

// ── POST /forgot-password ──────────────────────────────────────────────────
router.post(
  '/forgot-password',
  authStrictLimiter,
  [
    body('email', 'Please provide a valid email')
      .isEmail()
      .normalizeEmail()
      .isLength({ max: 254 }).withMessage('Email too long'),
  ],
  validate,
  forgotPassword
);

// ── POST /reset-password ───────────────────────────────────────────────────
router.post(
  '/reset-password',
  otpLimiter,
  [
    body('email', 'Please provide a valid email')
      .isEmail()
      .normalizeEmail(),
    body('password', 'Password must be between 8 and 128 characters')
      .isLength({ min: 8, max: 128 }),
    body('otp', 'OTP must be exactly 4 digits')
      .isLength({ min: 4, max: 4 })
      .matches(/^[0-9]{4}$/).withMessage('OTP must contain only digits'),
  ],
  validate,
  resetPassword
);

// ── GET /me ────────────────────────────────────────────────────────────────
router.get('/me', protect, getMe);

// ── PUT /profile ───────────────────────────────────────────────────────────
router.put(
  '/profile',
  protect,
  [
    body('name', 'Name must not exceed 100 characters')
      .optional()
      .isString()
      .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters')
      .trim(),
    body('mobile', 'Mobile must be exactly 10 digits')
      .optional()
      .matches(/^[0-9]{10}$/),
    body('gender', 'Invalid gender value')
      .optional()
      .isIn(['Male', 'Female', 'Other']),
    body('dob', 'Date of birth must be a valid ISO 8601 date (YYYY-MM-DD)')
      .optional()
      .isISO8601().withMessage('Date of birth must be in YYYY-MM-DD format')
      .toDate(),
    body('address', 'Address must not exceed 300 characters')
      .optional()
      .isLength({ max: 300 })
      .trim(),
    body('city', 'City must not exceed 100 characters')
      .optional()
      .isLength({ max: 100 })
      .trim(),
    body('bloodGroup', 'Invalid blood group')
      .optional()
      .isIn(BLOOD_GROUPS),
    body('isDonor', 'isDonor must be a boolean')
      .optional()
      .isBoolean(),
    body('donorAvailable', 'donorAvailable must be a boolean')
      .optional()
      .isBoolean(),
    // photo must be a valid URL (not a javascript: URI or data: URI)
    body('photo', 'Photo must be a valid HTTPS URL not exceeding 2048 characters')
      .optional()
      .isURL({ protocols: ['https'], require_protocol: true })
      .isLength({ max: 2048 }).withMessage('Photo URL too long'),
  ],
  validate,
  updateProfile
);

module.exports = router;
