const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  badgeId: { type: String, required: true },
  title: { type: String, required: true },
  earned: { type: Boolean, default: false },
});

const TimelineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
});

const RewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  badges: [BadgeSchema],
  timeline: [TimelineSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reward', RewardSchema);
