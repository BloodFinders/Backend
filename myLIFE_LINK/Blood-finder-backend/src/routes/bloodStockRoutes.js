const express = require('express');
const { body, validationResult } = require('express-validator');
const BloodStock = require('../models/BloodStock');
const ActivityLog = require('../models/ActivityLog');
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

// Get blood stock levels
router.get('/', protect, async (req, res, next) => {
  try {
    const list = await BloodStock.find();
    const formatted = list.map(s => ({
      group: s.group,
      units: s.units,
    }));
    
    res.status(200).json({
      success: true,
      bloodStock: formatted,
    });
  } catch (error) {
    next(error);
  }
});

// Update blood stock levels
router.put(
  '/',
  protect,
  authorize('admin', 'superadmin'),
  [
    body('group', 'Invalid blood group')
      .notEmpty()
      .isIn(BLOOD_GROUPS).withMessage(`Group must be one of: ${BLOOD_GROUPS.join(', ')}`),
    body('units', 'Units must be a non-negative integer')
      .isInt({ min: 0 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { group, units } = req.body;

      const stock = await BloodStock.findOneAndUpdate(
        { group },
        { units: Number(units) },
        { new: true, upsert: true }
      );

      // Audit logs
      await ActivityLog.create({
        actor: req.user.name,
        action: `Updated blood stock for ${group} to ${units} units`,
      });

      res.status(200).json({
        success: true,
        message: `Stock for group ${group} updated to ${units} units`,
        stock,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
