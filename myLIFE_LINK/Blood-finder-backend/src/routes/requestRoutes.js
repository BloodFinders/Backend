const express = require('express');
const { body, validationResult } = require('express-validator');
const { getRequests, createRequest, updateRequestStatus } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

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
  .get(protect, getRequests)
  .post(
    protect,
    [
      body('patientName', 'Patient name is required')
        .notEmpty()
        .isString()
        .isLength({ max: 100 }).withMessage('Patient name must not exceed 100 characters')
        .trim(),
      body('bloodGroup', 'Invalid blood group')
        .notEmpty()
        .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`),
      body('units', 'Units must be a whole number between 1 and 20')
        .isInt({ min: 1, max: 20 }),
      body('hospital', 'Hospital name is required')
        .notEmpty()
        .isString()
        .isLength({ max: 200 }).withMessage('Hospital name must not exceed 200 characters')
        .trim(),
      body('city', 'City is required')
        .notEmpty()
        .isString()
        .isLength({ max: 100 }).withMessage('City must not exceed 100 characters')
        .trim(),
      body('contact', 'Contact must be exactly 10 digits')
        .matches(/^[0-9]{10}$/),
      body('description', 'Description must not exceed 500 characters')
        .optional()
        .isLength({ max: 500 })
        .trim(),
    ],
    validate,
    createRequest
  );

router.route('/:id/status')
  .put(protect, authorize('admin', 'superadmin'), updateRequestStatus);

module.exports = router;
