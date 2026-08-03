const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get current user's notifications
router.get('/', protect, async (req, res, next) => {
  try {
    const list = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const formatted = list.map(n => ({
      id: n._id,
      type: n.type,
      message: n.message,
      time: n.time,
      read: n.read,
    }));
    
    res.status(200).json({
      success: true,
      notifications: formatted,
    });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to modify this notification' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
