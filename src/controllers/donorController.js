const User = require('../models/User');

// @desc    Get all active donors with filters
// @route   GET /api/donors
// @access  Private
exports.getDonors = async (req, res, next) => {
  try {
    const { group, query, availableOnly } = req.query;

    const filter = {
      isDonor: true,
      _id: { $ne: req.user.id }, // Exclude current user from search
    };

    // Filter by blood group
    if (group && group !== 'All') {
      filter.bloodGroup = group;
    }

    // Filter by availability
    if (availableOnly === 'true') {
      filter.donorAvailable = true;
    }

    // Filter by name or city search query
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
      ];
    }

    const donorsList = await User.find(filter);

    // Format list to match front-end UI mock data properties
    const formattedDonors = donorsList.map((donor, idx) => {
      // Mocking distances and last donation dates to match UI expectations
      const distances = ['1.2 km', '2.5 km', '3.8 km', '4.2 km', '5.0 km', '6.8 km'];
      const lastDonations = ['12 May 2026', '20 Jun 2026', '05 Jul 2026', '18 Jul 2026', 'Never'];
      
      return {
        id: donor._id,
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        city: donor.city || 'Unknown Location',
        available: donor.donorAvailable,
        distance: distances[idx % distances.length],
        lastDonation: lastDonations[idx % lastDonations.length],
        photo: donor.photo,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedDonors.length,
      donors: formattedDonors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle donor availability status
// @route   PUT /api/donors/availability
// @access  Private
exports.toggleAvailability = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.donorAvailable = !user.donorAvailable;
    await user.save();

    res.status(200).json({
      success: true,
      donorAvailable: user.donorAvailable,
      message: `Donor availability turned ${user.donorAvailable ? 'ON' : 'OFF'}`,
    });
  } catch (error) {
    next(error);
  }
};
