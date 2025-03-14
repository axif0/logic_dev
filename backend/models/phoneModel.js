const { getPool } = require('../config/database');

class PhoneModel {
  static async create(phoneNumber) {
    try {
      const [result] = await getPool().execute(
        'INSERT INTO phone_numbers (phone_number) VALUES (?)',
        [phoneNumber]
      );
      return result;
    } catch (error) {
      console.error('Error in phone model:', error);
      throw error;
    }
  }
}

module.exports = PhoneModel; 