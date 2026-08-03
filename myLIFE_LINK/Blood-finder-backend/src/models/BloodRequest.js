const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
  },
  units: {
    type: Number,
    required: [true, 'Units quantity is required'],
    min: [1, 'Must request at least 1 unit'],
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  contact: {
    type: String,
    required: [true, 'Contact phone number is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected'],
    default: 'Pending',
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), // e.g. "12 Aug 2024"
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
