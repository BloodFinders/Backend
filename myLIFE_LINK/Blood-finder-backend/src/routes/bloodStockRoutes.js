const express = require('express');
const BloodStock = require('../models/BloodStock');
const ActivityLog = require('../models/ActivityLog');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

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
router.put('/', protect, authorize('admin', 'superadmin'), async (req, res, next) => {
  try {
    const { group, units } = req.body;
    if (!group || units === undefined) {
      return res.status(400).json({ success: false, message: 'Group and units are required' });
    }

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
});

module.exports = router;
