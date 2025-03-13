const express = require('express');
const PhoneController = require('../controllers/phoneController');

const router = express.Router();

router.post('/submit-phone', PhoneController.submitPhone);
router.post('/verify-otp', PhoneController.verifyOTP);
router.get('/health', PhoneController.healthCheck);

module.exports = router; 