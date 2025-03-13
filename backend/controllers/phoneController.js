const PhoneModel = require('../models/phoneModel');
const OtpService = require('../services/otpService');
const Logger = require('../utils/logger');

class PhoneController {
  static async submitPhone(req, res) {
    const { phoneNumber } = req.body;

    try {
      Logger.info('Received request with phone:', phoneNumber);

      if (!phoneNumber || phoneNumber.length < 11) {
        Logger.error('Invalid phone number length:', phoneNumber?.length);
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid phone number' 
        });
      }

      // Request OTP
      Logger.info('Requesting OTP for phone:', phoneNumber);
      const otpResponse = await OtpService.requestOTP(phoneNumber);
      Logger.info('Raw OTP Response:', JSON.stringify(otpResponse, null, 2));
      
      if (otpResponse && otpResponse.statusCode === 'S1000') {
        // Save phone number to database
        await PhoneModel.create(phoneNumber);

        Logger.info('OTP sent successfully:', {
          referenceNo: otpResponse.referenceNo,
          statusCode: otpResponse.statusCode
        });

        return res.json({
          success: true,
          referenceNo: otpResponse.referenceNo,
          message: 'OTP sent successfully',
          statusDetail: otpResponse.statusDetail
        });
      } else {
        Logger.error('OTP request failed:', {
          statusCode: otpResponse?.statusCode,
          statusDetail: otpResponse?.statusDetail,
          response: otpResponse
        });

        return res.status(400).json({
          success: false,
          error: otpResponse?.statusDetail || 'Failed to send OTP',
          statusCode: otpResponse?.statusCode
        });
      }
    } catch (error) {
      Logger.error('Error processing request:', {
        error: error.message,
        stack: error.stack,
        response: error.response?.data
      });

      return res.status(500).json({ 
        success: false, 
        error: error.response?.data?.statusDetail || error.message || 'Server error while processing request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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