const express = require('express');
const { body, validationResult } = require('express-validator');
const { getBeneficiaries, createBeneficiary, updateBeneficiary, deleteBeneficiary } = require('../controllers/beneficiaryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

router.route('/')
  .get(protect, getBeneficiaries)
  .post(
    protect,
    [
      body('name', 'Beneficiary name is required').notEmpty(),
      body('relationship', 'Relationship category is required').notEmpty(),
      body('bloodGroup', 'Blood group is required').notEmpty(),
      body('mobile', 'Mobile contact number is required').notEmpty(),
    ],
    validate,
    createBeneficiary
  );

router.route('/:id')
  .put(
    protect,
    [
      body('name', 'Beneficiary name is required').notEmpty(),
      body('relationship', 'Relationship category is required').notEmpty(),
      body('bloodGroup', 'Blood group is required').notEmpty(),
      body('mobile', 'Mobile contact number is required').notEmpty(),
    ],
    validate,
    updateBeneficiary
  )
  .delete(protect, deleteBeneficiary);

module.exports = router;
