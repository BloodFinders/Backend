const DonationHistory = require('../models/DonationHistory');
const Certificate = require('../models/Certificate');
const Reward = require('../models/Reward');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get user's donation history
// @route   GET /api/donations
// @access  Private
exports.getDonationHistory = async (req, res, next) => {
  try {
    const list = await DonationHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const formatted = list.map(d => ({
      id: d._id,
      bloodBank: d.bloodBank,
      date: d.date,
      status: d.status,
    }));

    res.status(200).json({
      success: true,
      donationHistory: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's certificates
// @route   GET /api/donations/certificates
// @access  Private
exports.getCertificates = async (req, res, next) => {
  try {
    const list = await Certificate.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const formatted = list.map(c => ({
      id: c._id,
      title: c.title,
      date: c.date,
      bank: c.bank,
    }));

    res.status(200).json({
      success: true,
      certificates: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's rewards status
// @route   GET /api/donations/rewards
// @access  Private
exports.getRewards = async (req, res, next) => {
  try {
    let reward = await Reward.findOne({ userId: req.user.id });
    if (!reward) {
      // Create if it doesn't exist yet
      reward = await Reward.create({
        userId: req.user.id,
        badges: [
          { badgeId: 'r1', title: 'First Donation', earned: false },
          { badgeId: 'r2', title: '5 Donations', earned: false },
          { badgeId: 'r3', title: '10 Donations', earned: false },
          { badgeId: 'r4', title: '25 Donations', earned: false },
          { badgeId: 'r5', title: '50 Donations', earned: false },
          { badgeId: 'r6', title: 'Life Saver', earned: false },
          { badgeId: 'r7', title: 'Hero Donor', earned: false },
          { badgeId: 'r8', title: 'Platinum Donor', earned: false },
        ],
        timeline: [],
      });
    }

    res.status(200).json({
      success: true,
      rewards: {
        badges: reward.badges,
        timeline: reward.timeline,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a donation for verification
// @route   POST /api/donations/verify
// @access  Private
exports.logDonationForVerification = async (req, res, next) => {
  try {
    const { bloodBank, date } = req.body;

    const donation = await DonationHistory.create({
      userId: req.user.id,
      bloodBank,
      date: date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending',
    });

    // Write audit log
    await ActivityLog.create({
      actor: req.user.name,
      action: `Submitted donation verification request for ${bloodBank}`,
    });

    res.status(201).json({
      success: true,
      message: 'Donation log submitted successfully for verification.',
      donation: {
        id: donation._id,
        bloodBank: donation.bloodBank,
        date: donation.date,
        status: donation.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
