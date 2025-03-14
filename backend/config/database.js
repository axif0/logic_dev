const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS phone_numbers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone_number VARCHAR(15) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp VARCHAR(50),
        subscriber_id VARCHAR(255),
        subscriber_request_id VARCHAR(100),
        application_id VARCHAR(50),
        version VARCHAR(10),
        frequency VARCHAR(20),
        status VARCHAR(20),
        time_stamp VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Tables checked/created successfully');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = { pool, initializeDatabase }; 