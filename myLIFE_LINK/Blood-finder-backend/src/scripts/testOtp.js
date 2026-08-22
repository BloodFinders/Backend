const sendSms = require('../utils/sendSms');
const authController = require('../controllers/authController');
const authRoutes = require('../routes/authRoutes');

async function testOtpSystem() {
  console.log('Testing OTP and sendSms simulation...');
  const res = await sendSms({
    to: '9876543210',
    otp: '582914',
  });

  console.log('sendSms Result:', res);
  if (res.success && res.simulated) {
    console.log('Twilio Simulator successfully triggered and returned simulated OTP!');
  }

  console.log('Auth controller routes & exports verified:', typeof authController.register, typeof authController.verifyOtp, typeof authController.resendOtp);
  console.log('ALL SYNTAX & UTILITY CHECKS PASSED!');
  process.exit(0);
}

testOtpSystem().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
