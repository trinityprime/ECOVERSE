const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OTP } = require('./models');

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

const storeOtp = async (email, otp) => {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await OTP.create({ email, otp, expiresAt });
};

module.exports = { generateOtp, sendOtpEmail, storeOtp };
