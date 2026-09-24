const Beneficiary = require('../models/Beneficiary');

// @desc    Get user's beneficiaries
// @route   GET /api/beneficiaries
// @access  Private
exports.getBeneficiaries = async (req, res, next) => {
  try {
    const list = await Beneficiary.find({ userId: req.user.id });
    const formatted = list.map(b => ({
      id: b._id,
      name: b.name,
      relationship: b.relationship,
      bloodGroup: b.bloodGroup,
      mobile: b.mobile,
    }));

    res.status(200).json({
      success: true,
      beneficiaries: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a beneficiary
// @route   POST /api/beneficiaries
// @access  Private
exports.createBeneficiary = async (req, res, next) => {
  try {
    const { name, relationship, bloodGroup, mobile } = req.body;

    const beneficiary = await Beneficiary.create({
      userId: req.user.id,
      name,
      relationship,
      bloodGroup,
      mobile,
    });

    res.status(201).json({
      success: true,
      beneficiary: {
        id: beneficiary._id,
        name: beneficiary.name,
        relationship: beneficiary.relationship,
        bloodGroup: beneficiary.bloodGroup,
        mobile: beneficiary.mobile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a beneficiary
// @route   PUT /api/beneficiaries/:id
// @access  Private
exports.updateBeneficiary = async (req, res, next) => {
  try {
    let beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) {
      return res.status(404).json({ success: false, message: 'Beneficiary not found' });
    }

    // Verify ownership
    if (beneficiary.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to modify this beneficiary' });
    }

    const { name, relationship, bloodGroup, mobile } = req.body;
    beneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      { name, relationship, bloodGroup, mobile },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      beneficiary: {
        id: beneficiary._id,
        name: beneficiary.name,
        relationship: beneficiary.relationship,
        bloodGroup: beneficiary.bloodGroup,
        mobile: beneficiary.mobile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a beneficiary
// @route   DELETE /api/beneficiaries/:id
// @access  Private
exports.deleteBeneficiary = async (req, res, next) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) {
      return res.status(404).json({ success: false, message: 'Beneficiary not found' });
    }

    // Verify ownership
    if (beneficiary.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this beneficiary' });
    }

    await beneficiary.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Beneficiary deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
