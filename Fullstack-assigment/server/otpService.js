const crypto = require('crypto');
const nodemailer = require('nodemailer');
const OTP = require('./models/OtpStore'); 

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

async function sendOtpEmail(email, otp) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Your Service" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `Your OTP code is <strong>${otp}</strong>. It will expire in 15 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}

async function saveOtp(email, otp) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await OTP.create({ email, otp, expiresAt });
}

async function verifyOtp(email, otp) {
  const record = await OTP.findOne({ where: { email, otp } });

  if (record && new Date() < record.expiresAt) {
    await record.destroy(); // Remove OTP after successful verification
    return true;
  }

  return false;
}

module.exports = { generateOtp, sendOtpEmail, saveOtp, verifyOtp };
