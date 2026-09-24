const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  relationship: {
    type: String,
    required: [true, 'Relationship is required'],
    enum: ['Self', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Spouse', 'Friend'],
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Beneficiary', BeneficiarySchema);
