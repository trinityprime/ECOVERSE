const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure environment variables are loaded

const otpStore = {};

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

async function sendOtpEmail(email, otp) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    const mailOptions = {
      from: `"Your Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send OTP email:', error);  // This line should output the error to the console
      throw new Error('Failed to send OTP email');
    }
  }
  
  

module.exports = { generateOtp, sendOtpEmail, otpStore };
