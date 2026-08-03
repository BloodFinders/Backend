const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Reward = require('../models/Reward');

// Generate JWT Access Token (Short-lived: 15 minutes)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretlifelinkkey123', {
    expiresIn: '15m',
  });
};

// Generate JWT Refresh Token (Long-lived: 7 days)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'supersecretlifelinkrefreshkey98765', {
    expiresIn: '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, city, bloodGroup } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name: fullName,
      email,
      phone,
      password,
      city,
      bloodGroup,
      role: 'user', // Default role
    });

    // Initialize Rewards schema for this user
    await Reward.create({
      userId: user._id,
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

    res.status(201).json({
      success: true,
      message: 'Registration successful. OTP sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    // For demo/development purposes, any OTP code '1234' is accepted.
    if (otp !== '1234') {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please use 1234.' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Your account is deactivated' });
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.phone,
        gender: user.gender,
        dob: user.dob,
        address: user.address,
        city: user.city,
        bloodGroup: user.bloodGroup,
        role: user.role,
        photo: user.photo,
        isDonor: user.isDonor,
        donorAvailable: user.donorAvailable,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your registered email (Use code: 1234).',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;

    if (otp !== '1234') {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please use 1234.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash & Update Password
    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. Please login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.phone,
        gender: user.gender,
        dob: user.dob,
        address: user.address,
        city: user.city,
        bloodGroup: user.bloodGroup,
        role: user.role,
        photo: user.photo,
        isDonor: user.isDonor,
        donorAvailable: user.donorAvailable,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.mobile,
      gender: req.body.gender,
      dob: req.body.dob,
      address: req.body.address,
      city: req.body.city,
      bloodGroup: req.body.bloodGroup,
      isDonor: req.body.isDonor,
      donorAvailable: req.body.donorAvailable,
      photo: req.body.photo,
    };

    // Clean undefined fields
    Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.phone,
        gender: user.gender,
        dob: user.dob,
        address: user.address,
        city: user.city,
        bloodGroup: user.bloodGroup,
        role: user.role,
        photo: user.photo,
        isDonor: user.isDonor,
        donorAvailable: user.donorAvailable,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'supersecretlifelinkrefreshkey98765');
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Check if the refresh token matches the one in DB
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // Generate new access & refresh tokens (rotation)
    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Save new refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

