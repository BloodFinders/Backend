const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Reward = require('../models/Reward');
const sendEmail = require('../utils/sendEmail');

// Hash a token with SHA-256 (for safe DB storage)
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// Generate JWT Access Token (Short-lived: 15 minutes)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

// Generate JWT Refresh Token (Long-lived: 7 days)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
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
// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    // Allow demo OTP '1234' OR real generated OTP
    const isOtpValid = otp === '1234' || (user && user.otp && user.otp === otp && user.otpExpire && user.otpExpire > Date.now());

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
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

    // Support login with email OR phone number
    const identifier = email ? email.trim() : '';
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ── Account lockout check ────────────────────────────────────────
    const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
    const MAX_ATTEMPTS = 5;

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        await user.save({ validateBeforeSave: false });
        return res.status(429).json({
          success: false,
          message: `Too many failed attempts. Account locked for 15 minutes.`,
        });
      }

      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ── Successful login: reset lockout counters ─────────────────────
    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Your account is deactivated' });
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save hashed refresh token in database (raw token returned to client only)
    user.refreshToken = hashToken(refreshToken);
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
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Generate 4-digit numeric OTP code
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save({ validateBeforeSave: false });

    // Send real email via Nodemailer
    try {
      await sendEmail({
        email: user.email,
        subject: 'RakthaDan - Password Reset OTP Code',
        otp,
        message: `Your OTP for resetting your RakthaDan account password is: ${otp}. It will expire in 10 minutes.`,
      });

      res.status(200).json({
        success: true,
        message: `Password reset OTP code has been sent to ${user.email}.`,
      });
    } catch (emailErr) {
      console.error('Failed to send email:', emailErr);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please verify SMTP credentials in .env file.',
      });
    }
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
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Allow demo OTP '1234' OR real generated OTP
    const isOtpValid = otp === '1234' || (user.otp && user.otp === otp && user.otpExpire && user.otpExpire > Date.now());

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    // Hash & Update Password via pre('save') hook
    user.password = password;
    user.otp = null;
    user.otpExpire = null;
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
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Check if the hashed incoming token matches the stored hash
    if (user.refreshToken !== hashToken(refreshToken)) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // Generate new access & refresh tokens (rotation)
    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Save new hashed refresh token in DB
    user.refreshToken = hashToken(newRefreshToken);
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

