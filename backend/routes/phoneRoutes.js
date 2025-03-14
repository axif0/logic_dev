const express = require('express');
const PhoneController = require('../controllers/phoneController');
const UserDetailsController = require('../controllers/userDetailsController');

const router = express.Router();

router.post('/submit-phone', PhoneController.submitPhone);
router.post('/verify-otp', PhoneController.verifyOTP);
router.get('/health', PhoneController.healthCheck);

// New route for user details
router.post('/user-details', UserDetailsController.saveUserDetails);
router.get('/user-details/:id', UserDetailsController.getUserDetails);

module.exports = router; 