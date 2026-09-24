const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getBeneficiaries, createBeneficiary, updateBeneficiary, deleteBeneficiary,
} = require('../controllers/beneficiaryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const RELATIONSHIPS = ['Mother', 'Father', 'Sibling', 'Spouse', 'Child', 'Relative', 'Friend', 'Other'];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

// Shared beneficiary body validation rules
const beneficiaryRules = [
  body('name', 'Beneficiary name is required')
    .notEmpty()
    .isString()
    .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters')
    .trim(),
  body('relationship', 'Invalid relationship value')
    .notEmpty()
    .isIn(RELATIONSHIPS).withMessage(`Relationship must be one of: ${RELATIONSHIPS.join(', ')}`),
  body('bloodGroup', 'Invalid blood group')
    .notEmpty()
    .isIn(BLOOD_GROUPS).withMessage(`Blood group must be one of: ${BLOOD_GROUPS.join(', ')}`),
  body('mobile', 'Mobile must be exactly 10 digits')
    .matches(/^[0-9]{10}$/),
];

router.route('/')
  .get(protect, getBeneficiaries)
  .post(protect, beneficiaryRules, validate, createBeneficiary);

router.route('/:id')
  .put(protect, beneficiaryRules, validate, updateBeneficiary)
  .delete(protect, deleteBeneficiary);

module.exports = router;
