const express = require('express');
const { query, validationResult } = require('express-validator');
const { getDonors, toggleAvailability } = require('../controllers/donorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

router.route('/')
  .get(
    protect,
    [
      // Validate blood group filter — must be a known group or "All"
      query('group', 'Invalid blood group filter')
        .optional()
        .isIn([...BLOOD_GROUPS, 'All']).withMessage(`Group must be one of: All, ${BLOOD_GROUPS.join(', ')}`),

      // Limit search query length to prevent ReDoS via unbounded regex input
      query('query', 'Search query must not exceed 100 characters')
        .optional()
        .isString()
        .isLength({ max: 100 }).withMessage('Search query must not exceed 100 characters')
        .trim(),

      // Validate availableOnly — must be a boolean string
      query('availableOnly', 'availableOnly must be "true" or "false"')
        .optional()
        .isIn(['true', 'false']).withMessage('availableOnly must be "true" or "false"'),
    ],
    validate,
    getDonors
  );

router.route('/availability')
  .put(protect, toggleAvailability);

module.exports = router;
