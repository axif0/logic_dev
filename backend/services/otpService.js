const axios = require('axios');
const Logger = require('../utils/logger');

class OtpService {
  static async requestOTP(phoneNumber) {
    try {
      // Format the phone number with country code
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      Logger.info(`Requesting OTP for: tel:${formattedNumber}`);

      const payload = {
        applicationId: process.env.APPLICATION_ID,
        password: process.env.PASSWORD,
        subscriberId: `tel:${formattedNumber}`,
        action: "1"
      };

      Logger.info('OTP Request payload:', payload);

      const response = await axios.post('https://api.applink.com.bd/otp/request', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      Logger.info('OTP Response:', response.data);
      return response.data;
    } catch (error) {
      Logger.error('OTP request failed:', error.response?.data || error.message);
      throw error;
    }
  }

  static formatPhoneNumber(number) {
    // Remove any non-digit characters
    let cleaned = number.replace(/\D/g, '');
    
    // Remove leading '88' if present
    if (cleaned.startsWith('88')) {
      cleaned = cleaned.slice(2);
    }
    
    // Always return with '88' prefix
    return `88${cleaned}`;
  }

  static async verifyOTP(phoneNumber, otp, referenceNo) {
    try {
      const response = await axios.post('https://api.applink.com.bd/otp/verify', {
        applicationId: process.env.APPLICATION_ID,
        password: process.env.PASSWORD,
        referenceNo: referenceNo,
        otp: otp
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      Logger.error('OTP verification failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.statusDetail || 'Failed to verify OTP');
    }
  }
}

module.exports = OtpService; 