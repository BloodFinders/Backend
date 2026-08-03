const express = require('express');
const { body, validationResult } = require('express-validator');
const { getRequests, createRequest, updateRequestStatus } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

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
      body('patientName', 'Patient name is required').notEmpty(),
      body('bloodGroup', 'Blood group is required').notEmpty(),
      body('units', 'Units count must be a number').isNumeric(),
      body('hospital', 'Hospital name is required').notEmpty(),
      body('city', 'City is required').notEmpty(),
      body('contact', 'Contact details are required').notEmpty(),
    ],
    validate,
    createRequest
  );

router.route('/:id/status')
  .put(protect, authorize('admin', 'superadmin'), updateRequestStatus);

module.exports = router;
