const mongoose = require('mongoose');

const DonationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bloodBank: {
    type: String,
    required: [true, 'Blood bank name is required'],
    trim: true,
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified'],
    default: 'Pending',
  },
  units: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('DonationHistory', DonationHistorySchema);
