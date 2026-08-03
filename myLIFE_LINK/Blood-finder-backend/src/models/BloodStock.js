const mongoose = require('mongoose');

const BloodStockSchema = new mongoose.Schema({
  group: {
    type: String,
    required: true,
    unique: true,
  },
  units: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BloodStock', BloodStockSchema);
