const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OTP } = require('../models');
const OtpService = require('../otpService');
const { User } = require('../models'); 


// Request OTP
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = OtpService.generateOtp();

  try {
    // Store OTP in the database
    await OtpService.storeOtp(email, otp);

    // Send OTP to the user via email
    await OtpService.sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const otpRecord = await OTP.findOne({ where: { email, otp } });

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Delete OTP record after successful verification
    await OTP.destroy({ where: { email, otp } });

    // Create JWT token for the user (assuming user exists in database)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
});

module.exports = router;
