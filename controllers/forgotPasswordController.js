const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// In-memory OTP store (for demo; use Redis or DB in prod)
const otpStore = {};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
  // Send OTP via email
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is: ${otp}`
    });
    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', err });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email & OTP required' });
  const entry = otpStore[email];
  if (!entry || entry.otp !== otp || entry.expires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  res.json({ message: 'OTP verified' });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) return res.status(400).json({ message: 'All fields required' });
  const entry = otpStore[email];
  if (!entry || entry.otp !== otp || entry.expires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.password = password;
  await user.save();
  delete otpStore[email];
  res.json({ message: 'Password reset successful' });
};
