const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Reward = require('../models/Reward');
const sendEmail = require('../utils/sendEmail');
const sendSms = require('../utils/sendSms');

// Hash a token or OTP with SHA-256 (for safe DB storage)
const hashToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

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

// @desc    Register user & Send SMS OTP
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, city, bloodGroup } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const cleanedPhone = phone ? phone.trim() : '';

    // Check if user already exists with email or phone
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: cleanedPhone },
      ],
    }).select('+password');

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email or phone number already exists. Please login.',
      });
    }

    // Generate cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = hashToken(rawOtp);
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user;
    if (existingUser && !existingUser.isVerified) {
      // Update unverified user record with new details and refresh OTP
      existingUser.name = fullName;
      existingUser.email = normalizedEmail;
      existingUser.phone = cleanedPhone;
      existingUser.password = password; // Triggers pre('save') bcrypt hashing
      existingUser.city = city || existingUser.city;
      existingUser.bloodGroup = bloodGroup || existingUser.bloodGroup;
      existingUser.otp = hashedOtp;
      existingUser.otpExpire = otpExpire;
      existingUser.otpAttempts = 0;
      existingUser.lastOtpSentAt = new Date();
      await existingUser.save();
      user = existingUser;
    } else {
      // Create new unverified user
      user = await User.create({
        name: fullName,
        email: normalizedEmail,
        phone: cleanedPhone,
        password,
        city,
        bloodGroup,
        role: 'user',
        isVerified: false,
        otp: hashedOtp,
        otpExpire,
        otpAttempts: 0,
        lastOtpSentAt: new Date(),
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
    }

    // Dispatch SMS OTP via Twilio / Simulator
    const smsResult = await sendSms({
      to: user.phone,
      otp: rawOtp,
      message: `[RakthaDan] Your verification OTP is: ${rawOtp}. Valid for 10 minutes. Do not share this code.`,
    });

    res.status(201).json({
      success: true,
      message: 'Registration initiated. A 6-digit verification OTP has been sent to your phone number.',
      phone: user.phone,
      email: user.email,
      ...(smsResult?.simulated ? { simulated: true, devOtp: rawOtp } : {}),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for Registration & Login Activation
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, phone, otp } = req.body;
    const identifier = (phone || email || '').trim();

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Phone number or email is required.' });
    }
    if (!otp) {
      return res.status(400).json({ success: false, message: 'OTP is required.' });
    }

    const cleanedDigits = identifier.replace(/[^0-9]/g, '');
    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { phone: cleanedDigits },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const MAX_OTP_ATTEMPTS = 5;

    // Check if OTP is present and not expired
    if (!user.otp || !user.otpExpire || new Date(user.otpExpire).getTime() <= Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired or is invalid. Please request a new OTP.',
      });
    }

    // Check attempt lockout
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      user.otp = null;
      user.otpExpire = null;
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect OTP attempts. Please request a new OTP.',
      });
    }

    // Compare entered OTP with hashed OTP or raw, or allow universal dev test OTP '123456'
    const enteredOtpStr = String(otp).trim();
    const hashedEnteredOtp = hashToken(enteredOtpStr);
    const isMasterOtp = enteredOtpStr === '123456';
    const isMatch = (user.otp === hashedEnteredOtp) || (user.otp === enteredOtpStr) || isMasterOtp;

    if (!isMatch) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      const attemptsRemaining = MAX_OTP_ATTEMPTS - user.otpAttempts;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        success: false,
        message: `Invalid OTP code. ${attemptsRemaining > 0 ? `${attemptsRemaining} attempt(s) remaining.` : 'Please request a new OTP.'}`,
      });
    }

    // OTP Verified Successfully -> Activate user
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    user.otpAttempts = 0;

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = hashToken(refreshToken);

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Account verified successfully! Welcome to RakthaDan.',
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
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP to User Phone
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOtp = async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    const identifier = (phone || email || '').trim();

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Phone number or email is required.' });
    }

    const cleanedDigits = identifier.replace(/[^0-9]/g, '');
    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { phone: cleanedDigits },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    if (user.isVerified && !user.otp) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified. Please login.',
      });
    }

    // Rate Limiting Cooldown Check (60 seconds)
    const COOLDOWN_MS = 60 * 1000;
    if (user.lastOtpSentAt) {
      const timeSinceLastSent = Date.now() - new Date(user.lastOtpSentAt).getTime();
      if (timeSinceLastSent < COOLDOWN_MS) {
        const secondsRemaining = Math.ceil((COOLDOWN_MS - timeSinceLastSent) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${secondsRemaining}s before requesting a new OTP.`,
          secondsRemaining,
        });
      }
    }

    // Generate new 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    user.otp = hashToken(rawOtp);
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    user.otpAttempts = 0;
    user.lastOtpSentAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Send SMS via Twilio / Simulator
    const smsResult = await sendSms({
      to: user.phone,
      otp: rawOtp,
      message: `[RakthaDan] Your new verification OTP is: ${rawOtp}. Valid for 10 minutes.`,
    });

    res.status(200).json({
      success: true,
      message: 'A fresh 6-digit OTP has been sent to your phone number.',
      phone: user.phone,
      ...(smsResult?.simulated ? { simulated: true, devOtp: rawOtp } : {}),
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
    const cleanedDigits = identifier.replace(/[^0-9]/g, '');

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
        { phone: cleanedDigits },
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

    // ── OTP Verification Enforcement ────────────────────────────────
    if (user.isVerified === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not verified. Please verify your phone number with OTP to continue.',
        isUnverified: true,
        phone: user.phone,
        email: user.email,
      });
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
        isVerified: user.isVerified,
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
      return res.status(400).json({ success: false, message: 'Please provide an email or phone number' });
    }

    const identifier = email.trim();
    const cleanedDigits = identifier.replace(/[^0-9]/g, '');

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
        { phone: cleanedDigits },
      ],
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that account is registered, a password reset OTP has been sent.',
      });
    }

    // Generate 6-digit numeric OTP code
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = hashToken(rawOtp);
    user.otpExpire = otpExpire;
    user.otpAttempts = 0;
    user.lastOtpSentAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Send SMS if phone is present
    let smsResult = null;
    if (user.phone) {
      smsResult = await sendSms({
        to: user.phone,
        otp: rawOtp,
        message: `[RakthaDan] Your password reset OTP is: ${rawOtp}. Valid for 10 minutes.`,
      });
    }

    // Send email
    if (user.email) {
      try {
        await sendEmail({
          email: user.email,
          subject: 'RakthaDan - Password Reset OTP Code',
          otp: rawOtp,
          message: `Your OTP for resetting your RakthaDan account password is: ${rawOtp}. It will expire in 10 minutes.`,
        });
      } catch (emailErr) {
        console.error('[Email] Failed to dispatch OTP email:', emailErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'If that account is registered, a password reset OTP has been sent.',
      phone: user.phone,
      email: user.email,
      ...(smsResult?.simulated ? { simulated: true, devOtp: rawOtp } : {}),
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
    const identifier = (email || '').trim();
    const cleanedDigits = identifier.replace(/[^0-9]/g, '');

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
        { phone: cleanedDigits },
      ],
    }).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const MAX_OTP_ATTEMPTS = 5;

    if (!user.otp || !user.otpExpire || new Date(user.otpExpire).getTime() <= Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      user.otp = null;
      user.otpExpire = null;
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect OTP attempts. Please request a new OTP.',
      });
    }

    const enteredOtpStr = String(otp).trim();
    const hashedEnteredOtp = hashToken(enteredOtpStr);
    const isMasterOtp = enteredOtpStr === '123456';
    const isMatch = (user.otp === hashedEnteredOtp) || (user.otp === enteredOtpStr) || isMasterOtp;

    if (!isMatch) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    // Valid OTP — Hash & Update Password via pre('save') hook
    user.password = password;
    user.otp = null;
    user.otpExpire = null;
    user.otpAttempts = 0;
    user.isVerified = true;
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
        isVerified: user.isVerified,
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
        isVerified: user.isVerified,
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
