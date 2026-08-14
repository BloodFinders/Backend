const User = require('../models/User');
const DonationHistory = require('../models/DonationHistory');
const BloodStock = require('../models/BloodStock');
const Certificate = require('../models/Certificate');
const Reward = require('../models/Reward');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const Beneficiary = require('../models/Beneficiary');
const BloodRequest = require('../models/BloodRequest');

// @desc    Get all users for Admin
// @route   GET /api/admin/users
// @access  Private (Admin/SuperAdmin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'superadmin' } }).sort({ createdAt: -1 });
    const formatted = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
      status: u.status,
    }));

    res.status(200).json({
      success: true,
      users: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enable/Disable a user
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin/SuperAdmin)
exports.setUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = status;
    await user.save();

    await ActivityLog.create({
      actor: req.user.name,
      action: `Set status of user ${user.name} to ${status}`,
    });

    res.status(200).json({
      success: true,
      message: `User status set to ${status}`,
      user: { id: user._id, status: user.status },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donation verifications
// @route   GET /api/admin/verifications
// @access  Private (Admin/SuperAdmin)
exports.getVerifications = async (req, res, next) => {
  try {
    const list = await DonationHistory.find()
      .populate('userId', 'name bloodGroup')
      .sort({ createdAt: -1 });

    const formatted = list.map(d => ({
      id: d._id,
      name: d.userId ? d.userId.name : 'Unknown Donor',
      bloodGroup: d.userId ? d.userId.bloodGroup : 'O+',
      date: d.date,
      status: d.status,
      bloodBank: d.bloodBank,
    }));

    res.status(200).json({
      success: true,
      verifications: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a donation
// @route   PUT /api/admin/verifications/:id
// @access  Private (Admin/SuperAdmin)
exports.verifyDonation = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Verified'
    if (status !== 'Verified') {
      return res.status(400).json({ success: false, message: 'Invalid status validation' });
    }

    const donation = await DonationHistory.findById(req.params.id).populate('userId');
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }

    if (donation.status === 'Verified') {
      return res.status(400).json({ success: false, message: 'Donation is already verified' });
    }

    donation.status = 'Verified';
    await donation.save();

    const donorUser = donation.userId;
    if (!donorUser) {
      return res.status(400).json({ success: false, message: 'Associated donor account was not found' });
    }

    // 1. Update Blood Stock for this group
    const bg = donorUser.bloodGroup || 'O+';
    await BloodStock.findOneAndUpdate(
      { group: bg },
      { $inc: { units: donation.units } },
      { new: true, upsert: true }
    );

    // 2. Create Certificate
    const certCount = await Certificate.countDocuments({ userId: donorUser._id });
    const certificate = await Certificate.create({
      userId: donorUser._id,
      donationId: donation._id,
      title: `Donation Certificate #${certCount + 1}`,
      date: donation.date,
      bank: donation.bloodBank,
    });

    // 3. Update Rewards & Badges
    const totalVerified = await DonationHistory.countDocuments({ userId: donorUser._id, status: 'Verified' });
    let rewards = await Reward.findOne({ userId: donorUser._id });
    if (!rewards) {
      rewards = new Reward({ userId: donorUser._id, badges: [], timeline: [] });
    }

    const initialBadges = [
      { badgeId: 'r1', title: 'First Donation', earned: false },
      { badgeId: 'r2', title: '5 Donations', earned: false },
      { badgeId: 'r3', title: '10 Donations', earned: false },
      { badgeId: 'r4', title: '25 Donations', earned: false },
      { badgeId: 'r5', title: '50 Donations', earned: false },
      { badgeId: 'r6', title: 'Life Saver', earned: false },
      { badgeId: 'r7', title: 'Hero Donor', earned: false },
      { badgeId: 'r8', title: 'Platinum Donor', earned: false },
    ];

    if (!rewards.badges || rewards.badges.length === 0) {
      rewards.badges = initialBadges;
    }

    // Award logic
    const earnBadge = (badgeId, title) => {
      const bIndex = rewards.badges.findIndex(b => b.badgeId === badgeId);
      if (bIndex !== -1 && !rewards.badges[bIndex].earned) {
        rewards.badges[bIndex].earned = true;
        rewards.timeline.push({
          title: `Earned "${title}"`,
          date: donation.date,
        });
      }
    };

    if (totalVerified >= 1) earnBadge('r1', 'First Donation');
    if (totalVerified >= 5) earnBadge('r2', '5 Donations');
    if (totalVerified >= 10) earnBadge('r3', '10 Donations');
    if (totalVerified >= 25) earnBadge('r4', '25 Donations');
    if (totalVerified >= 50) earnBadge('r5', '50 Donations');
    // "Life Saver" badge for 3 donations
    if (totalVerified >= 3) earnBadge('r6', 'Life Saver');
    // "Hero Donor" for 15 donations
    if (totalVerified >= 15) earnBadge('r7', 'Hero Donor');

    await rewards.save();

    // 4. Create Notification for user
    await Notification.create({
      userId: donorUser._id,
      type: 'Certificate Available',
      message: `Your donation at ${donation.bloodBank} has been verified! Certificate #${certCount + 1} is now available.`,
      time: 'Just now',
    });

    // 5. Write Activity Audit Log
    await ActivityLog.create({
      actor: req.user.name,
      action: `Verified donation of ${donorUser.name} (${bg}) at ${donation.bloodBank}`,
    });

    res.status(200).json({
      success: true,
      message: 'Donation verified, inventory updated, certificates/rewards awarded.',
      donation,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admins (SuperAdmin only)
// @route   GET /api/admin/admins
// @access  Private (SuperAdmin)
exports.getAdmins = async (req, res, next) => {
  try {
    const list = await User.find({ role: 'admin' }).sort({ createdAt: -1 });
    const formatted = list.map(a => ({
      id: a._id,
      name: a.name,
      email: a.email,
      status: a.status,
    }));

    res.status(200).json({
      success: true,
      admins: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add an admin (SuperAdmin only)
// @route   POST /api/admin/admins
// @access  Private (SuperAdmin)
exports.addAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin/User with this email already exists' });
    }

    const admin = await User.create({
      name,
      email,
      password,          // Required — validated by route middleware (min 8 chars)
      phone: '0000000000',
      role: 'admin',
    });

    await ActivityLog.create({
      actor: req.user.name,
      action: `Added new Administrator: ${name} (${email})`,
    });

    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        status: admin.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Remove an admin (SuperAdmin only)
// @route   DELETE /api/admin/admins/:id
// @access  Private (SuperAdmin)
exports.removeAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (admin.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'User is not an admin' });
    }

    await admin.deleteOne();

    await ActivityLog.create({
      actor: req.user.name,
      action: `Deleted administrator account: ${admin.name}`,
    });

    res.status(200).json({
      success: true,
      message: 'Admin account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system Activity Logs
// @route   GET /api/admin/logs
// @access  Private (SuperAdmin)
exports.getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    const formatted = logs.map(l => ({
      id: l._id,
      time: l.time,
      actor: l.actor,
      action: l.action,
    }));

    res.status(200).json({
      success: true,
      logs: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin/SuperAdmin)
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDonors = await User.countDocuments({ isDonor: true });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeRequests = await BloodRequest.countDocuments({ status: { $in: ['Pending', 'Approved'] } });
    
    // low stock count: blood groups with units < 10
    const lowStock = await BloodStock.countDocuments({ units: { $lt: 10 } });
    const totalDonations = await DonationHistory.countDocuments({ status: 'Verified' });
    const activeBeneficiaries = await Beneficiary.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalAdmins,
        activeRequests,
        bloodStockLow: lowStock,
        totalDonations,
        activeBeneficiaries,
      },
    });
  } catch (error) {
    next(error);
  }
};
