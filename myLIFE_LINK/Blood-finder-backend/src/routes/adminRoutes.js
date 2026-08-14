const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getUsers, setUserStatus, getVerifications, verifyDonation,
  getAdmins, addAdmin, removeAdmin, getActivityLogs, getStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

// General Admin Routes
router.route('/users')
  .get(protect, authorize('admin', 'superadmin'), getUsers);

router.route('/users/:id/status')
  .put(protect, authorize('admin', 'superadmin'), setUserStatus);

router.route('/verifications')
  .get(protect, authorize('admin', 'superadmin'), getVerifications);

router.route('/verifications/:id')
  .put(protect, authorize('admin', 'superadmin'), verifyDonation);

router.route('/stats')
  .get(protect, authorize('admin', 'superadmin'), getStats);

// Super Admin exclusive Routes
router.route('/admins')
  .get(protect, authorize('superadmin'), getAdmins)
  .post(
    protect,
    authorize('superadmin'),
    [
      body('name', 'Admin name is required')
        .notEmpty()
        .isString()
        .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters')
        .trim(),
      body('email', 'Provide a valid email address')
        .isEmail()
        .normalizeEmail()
        .isLength({ max: 254 }).withMessage('Email too long'),
      body('password', 'Password must be between 8 and 128 characters')
        .isLength({ min: 8, max: 128 }),
    ],
    validate,
    addAdmin
  );

router.route('/admins/:id')
  .delete(protect, authorize('superadmin'), removeAdmin);

router.route('/logs')
  .get(protect, authorize('superadmin'), getActivityLogs);

module.exports = router;
