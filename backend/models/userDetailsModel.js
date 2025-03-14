const { pool } = require('../config/database');
const Logger = require('../utils/logger');

class UserDetailsModel {
  static async create(userDetails) {
    try {
      const timestamp = userDetails.timestamp || new Date().toISOString();
      const response = userDetails.response || {};
      
      const valuesToInsert = [
        timestamp,
        response.subscriberId || null,
        response.subscriberRequestId || null,
        response.applicationId || null,
        response.version || null,
        response.frequency || null,
        response.status || null,
        response.timeStamp || null
      ];
      
      const [result] = await pool.execute(
        `INSERT INTO user_details (
          timestamp,
          subscriber_id,
          subscriber_request_id,
          application_id,
          version,
          frequency,
          status,
          time_stamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        valuesToInsert
      );

      if (result.insertId) {
        const [rows] = await pool.execute(
          'SELECT * FROM user_details WHERE id = ?',
          [result.insertId]
        );
        return rows[0];
      }
      
      return result;
    } catch (error) {
      Logger.error('Error in user details model:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM user_details WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      Logger.error('Error fetching user details:', error);
      throw error;
    }
  }
}

module.exports = UserDetailsModel; 