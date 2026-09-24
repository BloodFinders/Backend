let twilioClient = null;

/**
 * Initialize Twilio client lazily if credentials are present
 */
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (
    accountSid &&
    authToken &&
    !accountSid.startsWith('your_') &&
    !authToken.startsWith('your_') &&
    accountSid.length > 10
  ) {
    try {
      if (!twilioClient) {
        const twilio = require('twilio');
        twilioClient = twilio(accountSid, authToken);
      }
      return twilioClient;
    } catch (err) {
      console.error('[Twilio Init Error]:', err.message);
      return null;
    }
  }
  return null;
};

/**
 * Formats a phone number to standard E.164 format (defaulting to +91 if missing international code)
 * @param {string} phone 
 * @returns {string}
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  // Standard 10-digit Indian mobile number
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  // 12-digit number starting with 91
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  return `+${cleaned}`;
};

/**
 * Send SMS via Twilio or Fallback to Developer Console Simulator
 * @param {Object} options
 * @param {string} options.to - Recipient phone number
 * @param {string} options.otp - The 6-digit OTP
 * @param {string} [options.message] - Custom message text
 * @returns {Promise<{success: boolean, simulated: boolean, messageId?: string}>}
 */
const sendSms = async ({ to, otp, message }) => {
  const formattedTo = formatPhoneNumber(to);
  const bodyText = message || `[RakthaDan] Your verification OTP is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  const client = getTwilioClient();

  if (client && (fromNumber || messagingServiceSid)) {
    try {
      const payload = {
        body: bodyText,
        to: formattedTo,
      };

      if (messagingServiceSid && !messagingServiceSid.startsWith('your_')) {
        payload.messagingServiceSid = messagingServiceSid;
      } else if (fromNumber && !fromNumber.startsWith('your_')) {
        payload.from = fromNumber;
      }

      const result = await client.messages.create(payload);
      console.log(`[Twilio SMS] Successfully dispatched SMS to ${formattedTo} (SID: ${result.sid})`);
      return { success: true, simulated: false, messageId: result.sid };
    } catch (error) {
      console.error(`[Twilio SMS Failed] Error sending to ${formattedTo}:`, error.message);
      // Fallback to dev console logging if Twilio fails during development
      console.log('---------------------------------------------------------');
      console.log(`[DEV FALLBACK] OTP for ${formattedTo}: ${otp}`);
      console.log('---------------------------------------------------------');
      return { success: true, simulated: true, error: error.message };
    }
  } else {
    // Simulator Mode (No Twilio keys configured in .env)
    console.log('\n=========================================================');
    console.log('📱 [TWILIO SMS SIMULATOR - DEV / TEST MODE]');
    console.log(`➡️  To:      ${formattedTo}`);
    console.log(`🔑 OTP Code: ${otp}`);
    console.log(`💬 Message:  ${bodyText}`);
    console.log('ℹ️  Tip: Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, & TWILIO_PHONE_NUMBER to .env for real SMS delivery.');
    console.log('=========================================================\n');

    return { success: true, simulated: true, otp };
  }
};

module.exports = sendSms;
