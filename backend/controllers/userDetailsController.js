const UserDetailsModel = require('../models/userDetailsModel');
const Logger = require('../utils/logger');

class UserDetailsController {
  static async saveUserDetails(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({
          success: false,
          error: 'No data provided'
        });
      }

      if (!req.body.response) {
        return res.status(400).json({
          success: false,
          error: 'Missing response object in request body'
        });
      }

      const result = await UserDetailsModel.create(req.body);
      
      return res.json({
        success: true,
        message: 'User details saved successfully',
        data: result
      });
    } catch (error) {
      Logger.error('Error saving user details:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to save user details',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getUserDetails(req, res) {
    try {
      const { id } = req.params;
      const userDetails = await UserDetailsModel.getById(id);
      
      if (!userDetails) {
        return res.status(404).json({
          success: false,
          error: 'User details not found'
        });
      }

      return res.json({
        success: true,
        data: userDetails
      });
    } catch (error) {
      Logger.error('Error fetching user details:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user details'
      });
    }
  }
}

module.exports = UserDetailsController; 