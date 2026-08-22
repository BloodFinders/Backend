const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();

const User = require('../models/User');
const Reward = require('../models/Reward');
const authController = require('../controllers/authController');

const hashToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

// Helper to mock express req, res
const mockReqRes = (body = {}, user = null) => {
  const req = { body, user };
  let statusCode = 200;
  let responseData = null;

  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
  };

  const next = (err) => {
    if (err) throw err;
  };

  return { req, res, getResult: () => ({ status: statusCode, data: responseData }) };
};

async function runE2ETest() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lifelink');
    console.log('Database connected.');

    const testEmail = 'otp_tester_' + Date.now() + '@gmail.com';
    const testPhone = '98765' + Math.floor(10000 + Math.random() * 90000);
    const testPassword = 'Password123!';

    console.log(`\n--- 1. Registering user with phone ${testPhone} ---`);
    const reg = mockReqRes({
      fullName: 'OTP Test User',
      email: testEmail,
      phone: testPhone,
      password: testPassword,
      city: 'Hyderabad',
      bloodGroup: 'O+',
    });
    await authController.register(reg.req, reg.res, (err) => { throw err; });
    const regResult = reg.getResult();
    console.log('Register Response Status:', regResult.status);
    console.log('Register Response Data:', regResult.data);

    // Retrieve user from DB to check stored fields
    const userInDb = await User.findOne({ email: testEmail });
    console.log('User created in DB? ID:', userInDb._id.toString());
    console.log('isVerified:', userInDb.isVerified);
    console.log('Stored Hashed OTP:', userInDb.otp);
    console.log('OTP Expire:', userInDb.otpExpire);

    if (userInDb.isVerified !== false) {
      throw new Error('User should NOT be verified immediately upon registration!');
    }

    console.log('\n--- 2. Attempting login before OTP verification ---');
    const preLogin = mockReqRes({
      email: testEmail,
      password: testPassword,
    });
    await authController.login(preLogin.req, preLogin.res, (err) => { throw err; });
    const preLoginResult = preLogin.getResult();
    console.log('Pre-verification Login Status:', preLoginResult.status);
    console.log('Pre-verification Login Message:', preLoginResult.data.message);
    console.log('isUnverified flag:', preLoginResult.data.isUnverified);

    if (preLoginResult.status !== 403 || !preLoginResult.data.isUnverified) {
      throw new Error('Unverified user should be blocked from logging in!');
    }

    console.log('\n--- 3. Testing incorrect OTP attempt ---');
    const wrongOtpRes = mockReqRes({
      phone: testPhone,
      otp: '000000',
    });
    await authController.verifyOtp(wrongOtpRes.req, wrongOtpRes.res, (err) => { throw err; });
    const wrongResult = wrongOtpRes.getResult();
    console.log('Wrong OTP Status:', wrongResult.status);
    console.log('Wrong OTP Message:', wrongResult.data.message);

    const userAfterWrong = await User.findById(userInDb._id);
    console.log('OTP Attempts counter:', userAfterWrong.otpAttempts);

    console.log('\n--- 4. Testing Resend OTP Cooldown ---');
    const resendCooldown = mockReqRes({ phone: testPhone });
    await authController.resendOtp(resendCooldown.req, resendCooldown.res, (err) => { throw err; });
    const resendCooldownResult = resendCooldown.getResult();
    console.log('Resend Cooldown Status:', resendCooldownResult.status);
    console.log('Resend Cooldown Message:', resendCooldownResult.data.message);

    if (resendCooldownResult.status !== 429) {
      throw new Error('Resending OTP immediately should trigger 429 cooldown rate limit!');
    }

    console.log('\n--- 5. Verifying with correct OTP ---');
    // For test, set a known OTP
    const knownOtp = '765432';
    userAfterWrong.otp = hashToken(knownOtp);
    await userAfterWrong.save();

    const correctOtpRes = mockReqRes({
      phone: testPhone,
      otp: knownOtp,
    });
    await authController.verifyOtp(correctOtpRes.req, correctOtpRes.res, (err) => { throw err; });
    const correctResult = correctOtpRes.getResult();
    console.log('Correct OTP Status:', correctResult.status);
    console.log('Correct OTP Message:', correctResult.data.message);
    console.log('Returned Token:', correctResult.data.token ? 'JWT token generated' : 'NO TOKEN');

    const userAfterVerify = await User.findById(userInDb._id);
    console.log('isVerified after verification:', userAfterVerify.isVerified);
    console.log('OTP cleared from DB:', userAfterVerify.otp === null);

    if (userAfterVerify.isVerified !== true) {
      throw new Error('User should be verified after valid OTP submission!');
    }

    console.log('\n--- 6. Attempting login AFTER OTP verification ---');
    const postLogin = mockReqRes({
      email: testEmail,
      password: testPassword,
    });
    await authController.login(postLogin.req, postLogin.res, (err) => { throw err; });
    const postLoginResult = postLogin.getResult();
    console.log('Post-verification Login Status:', postLoginResult.status);
    console.log('Post-verification User Name:', postLoginResult.data.user.name);
    console.log('Post-verification Token generated:', !!postLoginResult.data.token);

    if (postLoginResult.status !== 200 || !postLoginResult.data.token) {
      throw new Error('User should be able to log in successfully after OTP verification!');
    }

    // Clean up test user & reward
    await User.findByIdAndDelete(userInDb._id);
    await Reward.deleteMany({ userId: userInDb._id });
    console.log('\nCleaned up test data.');

    console.log('\n=============================================================');
    console.log('🎉 ALL OTP E2E FLOW TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('=============================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ E2E Test Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runE2ETest();
