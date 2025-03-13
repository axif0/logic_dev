const PhoneModel = require('../models/phoneModel');

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

      const result = await PhoneModel.create(phoneNumber);

      return res.json({
        success: true,
        id: result.insertId,
        message: 'Phone number submitted successfully'
      });

    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Server error while processing request' 
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