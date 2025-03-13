const PhoneModel = require('../models/phoneModel');
const OtpService = require('../services/otpService');
const Logger = require('../utils/logger');

class PhoneController {
  static async submitPhone(req, res) {
    const { phoneNumber } = req.body;

    try {
      if (!phoneNumber || phoneNumber.length < 11) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid phone number' 
        });
      }

      Logger.info(`Processing phone number: ${phoneNumber}`);

      // Request OTP
      const otpResponse = await OtpService.requestOTP(phoneNumber);
      
      if (otpResponse.statusCode === 'S1000') {
        // Save phone number to database (save without country code)
        const localNumber = phoneNumber.replace(/^88/, '');
        const result = await PhoneModel.create(localNumber);

        return res.json({
          success: true,
          referenceNo: otpResponse.referenceNo,
          message: 'OTP sent successfully'
        });
      } else {
        Logger.error('OTP request failed:', otpResponse);
        return res.status(400).json({
          success: false,
          error: otpResponse.statusDetail || 'Failed to send OTP'
        });
      }
    } catch (error) {
      Logger.error('Error processing request:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Server error while processing request' 
      });
    }
  }

  static async verifyOTP(req, res) {
    const { phoneNumber, otp, referenceNo } = req.body;

    try {
      const response = await OtpService.verifyOTP(phoneNumber, otp, referenceNo);
      
      if (response.statusCode === 'S1000') {
        return res.json({
          success: true,
          message: 'OTP verified successfully'
        });
      } else {
        return res.status(400).json({
          success: false,
          error: response.statusDetail || 'Failed to verify OTP'
        });
      }
    } catch (error) {
      Logger.error('Error verifying OTP:', error);
      return res.status(500).json({
        success: false,
        error: 'Server error while verifying OTP'
      });
    }
  }

  static async healthCheck(req, res) {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
  }
}

module.exports = PhoneController; 