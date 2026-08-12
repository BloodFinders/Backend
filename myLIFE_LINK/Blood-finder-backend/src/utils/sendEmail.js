const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const user = process.env.SMTP_EMAIL || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;
  const fromName = process.env.FROM_NAME || 'RakthaDan Blood Finder';
  const fromEmail = process.env.FROM_EMAIL || user || 'noreply@rakthadan.com';

  if (!user || !pass || user === 'your_smtp_email') {
    console.log('\n=============================================================');
    console.log(`[NODEMAILER MOCK EMAIL] (Add EMAIL_USER & EMAIL_PASS to .env for real emails)`);
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`OTP Code: ${options.otp}`);
    console.log(`Message:\n${options.message}`);
    console.log('=============================================================\n');
    return { success: true, mocked: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #d9534f; margin-top: 0;">🩸 RakthaDan Blood Finder</h2>
        <h3 style="color: #222;">Password Reset OTP Code</h3>
        <p>You requested a password reset for your RakthaDan account.</p>
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 16px; border-radius: 6px; margin: 20px 0;">
          ${options.otp}
        </div>
        <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
        <p style="color: #999; font-size: 12px; text-align: center;">RakthaDan Emergency Blood Finder System</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[NODEMAILER] Email sent successfully to ${options.email}. Message ID: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
