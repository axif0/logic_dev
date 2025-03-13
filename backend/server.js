const express = require('express');
const corsMiddleware = require('./middleware/cors');
const { initializeDatabase } = require('./config/database');
const phoneRoutes = require('./routes/phoneRoutes');
const Logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/api', phoneRoutes);

// Initialize database and start server
initializeDatabase()
  .then(() => {
    const HOST = process.env.HOST || '0.0.0.0';
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, HOST, () => {
      Logger.info(`Server running on ${HOST}:${PORT}`);
      Logger.info(`Allowed origins: ${process.env.ALLOWED_ORIGINS}`);
    });
  })
  .catch(err => {
    Logger.error('Failed to initialize server:', err);
    process.exit(1);
  }); 