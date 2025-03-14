const mysql = require('mysql2/promise');
require('dotenv').config();

// First create a connection without database selection
const createDbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Main connection pool (will be initialized after database creation)
let pool;

async function initializeDatabase() {
  try {
    // First, try to create the database if it doesn't exist
    const connection = await createDbConnection.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    connection.release();
    
    // Now initialize the main connection pool with the database
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create tables
    const dbConnection = await pool.getConnection();
    console.log('Database connected successfully');

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS phone_numbers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone_number VARCHAR(15) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await dbConnection.query(`
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
    dbConnection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = { 
  initializeDatabase,
  getPool: () => pool // Export a function to get the pool after initialization
}; 