const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDonationHistory, getCertificates, getRewards, logDonationForVerification } = require('../controllers/donationController');
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
  .get(protect, getDonationHistory);

router.route('/certificates')
  .get(protect, getCertificates);

router.route('/rewards')
  .get(protect, getRewards);

router.route('/verify')
  .post(
    protect,
    [
      body('bloodBank', 'Blood bank name is required').notEmpty(),
    ],
    validate,
    logDonationForVerification
  );

module.exports = router;
