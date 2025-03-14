const axios = require('axios');
const Logger = require('../utils/logger');

class OtpService {
  static async requestOTP(phoneNumber) {
    // Comment this section temporarily for testing UI
    ///*
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      Logger.info('Formatted phone number:', formattedNumber);

      const payload = {
        applicationId: process.env.APPLICATION_ID,
        password: process.env.PASSWORD,
        subscriberId: `tel:${formattedNumber}`,
        action: "1"
      };

      Logger.info('OTP Request payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post('https://api.applink.com.bd/otp/request', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      Logger.info('OTP API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      if (!response.data) {
        throw new Error('Empty response from OTP service');
      }

      return response.data;
    } catch (error) {
      Logger.error('OTP request failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
   // */

    // Mock successful response for testing
    // return {
    //   statusCode: 'S1000',
    //   statusDetail: 'Success',
    //   referenceNo: '1234567890',
    //   version: '1.0'
    // };
  }

  static formatPhoneNumber(number) {
    // Remove any non-digit characters
    let cleaned = number.replace(/\D/g, '');
    
    // Remove leading '88' if present
    if (cleaned.startsWith('88')) {
      cleaned = cleaned.slice(2);
    }
    
    // Always return with '88' prefix
    const formatted = `88${cleaned}`;
    Logger.info('Phone number formatting:', {
      input: number,
      cleaned: cleaned,
      formatted: formatted
    });
    return formatted;
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