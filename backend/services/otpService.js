const axios = require('axios');
const Logger = require('../utils/logger');

class OtpService {
  static async requestOTP(phoneNumber) {
    try {
      const response = await axios.post('https://api.applink.com.bd/otp/request', {
        applicationId: process.env.APPLICATION_ID,
        password: process.env.PASSWORD,
        subscriberId: `tel:88${phoneNumber}`,
        action: "1"
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      Logger.error('OTP request failed:', error);
      throw new Error(error.response?.data?.statusDetail || 'Failed to request OTP');
    }
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
      Logger.error('OTP verification failed:', error);
      throw new Error(error.response?.data?.statusDetail || 'Failed to verify OTP');
    }
  }
}

module.exports = OtpService; 