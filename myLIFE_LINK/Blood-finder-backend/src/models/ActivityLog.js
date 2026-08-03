const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  actor: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: () => new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }), // e.g. "12 Aug 2024 10:30 AM"
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
