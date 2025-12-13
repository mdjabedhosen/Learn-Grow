import twilio from 'twilio';
import config from '../config/config';

const client = twilio(config.sms_account_sid, config.sms_auth_token);

export const sendVerificationCode = async (phoneNumber: string) => {
  try {
    const verification = await client.verify.v2
      .services(config.twilio_service_sid || 'VA1d632e2511fcd01097352f95c0d8cb5a')
      .verifications.create({ to: phoneNumber, channel: 'sms' });
    return { success: true, serviceSid: verification.serviceSid };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: (error as any).message || 'Error sending verification code',
      code: (error as any).code,
      error: error,
    };
  }
};

// Function to verify the code entered by the user
export const verifyCode = async (
  phone: string,
  code: string,
  verifyServiceSid: string,
) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(config.twilio_service_sid || 'VA1d632e2511fcd01097352f95c0d8cb5a')
      .verificationChecks.create({ to: phone, code });

    //   console.log('Verification Status:', verificationCheck.status);

    if (verificationCheck.status === 'approved') {
      return { success: true, message: 'Phone number verified successfully.' };
    } else {
      return { success: false, message: 'Invalid verification code.' };
    }
  } catch (error) {
    return {
      success: false,
      message: (error as any).message || 'Invalid verification code.',
      code: (error as any).code,
      error: error,
    };
  }
};
