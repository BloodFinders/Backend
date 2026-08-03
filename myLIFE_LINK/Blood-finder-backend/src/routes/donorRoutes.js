const express = require('express');
const { getDonors, toggleAvailability } = require('../controllers/donorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getDonors);

router.route('/availability')
  .put(protect, toggleAvailability);

module.exports = router;
