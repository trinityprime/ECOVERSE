const express = require('express');
const router = express.Router();
const { generateOtp, sendOtpEmail, otpStore } = require('../otpService'); 

// Request OTP
router.post('/request-otp', async (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).send('Invalid email');
    }

    const otp = generateOtp();
    otpStore[email] = { otp, expires: Date.now() + 15 * 60 * 1000 };

    try {
        await sendOtpEmail(email, otp);
        res.send('OTP sent');
    } catch (error) {
        res.status(500).send('Failed to send OTP');
    }
});
3
// Verify OTP
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const stored = otpStore[email];

    if (stored && stored.otp === otp && Date.now() < stored.expires) {
        res.send('OTP valid');
    } else {
        res.status(400).send('Invalid or expired OTP');
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword || newPassword.length < 6) {
        return res.status(400).send('Invalid input');
    }

    const stored = otpStore[email];
    if (!stored) {
        return res.status(400).send('OTP has not been requested or has expired');
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.password = newPassword;
        await user.save();

        // Remove OTP after successful password reset
        delete otpStore[email];

        res.send('Password updated');
    } catch (error) {
        res.status(500).send('Failed to update password');
    }
});

module.exports = router;
