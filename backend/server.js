const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promise-based MySQL
require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: function(origin, callback) {
    // During development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Create database pool
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

// Initialize database and table
async function initializeDatabase() {
  try {
    // Test connection
    const connection = await pool.getConnection();
    console.log('Database connected successfully');

    // Create table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS phone_numbers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone_number VARCHAR(15) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table checked/created successfully');

    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1); // Exit if database setup fails
  }
}

// API endpoint to submit phone number
app.post('/api/submit-phone', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 11) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid phone number' 
      });
    }

    // Insert phone number
    const [result] = await pool.execute(
      'INSERT INTO phone_numbers (phone_number) VALUES (?)',
      [phoneNumber]
    );

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
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
initializeDatabase().then(() => {
  const HOST = process.env.HOST || '0.0.0.0';
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
    console.log('Allowed origins:', allowedOrigins);
  });
}).catch(err => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
}); 