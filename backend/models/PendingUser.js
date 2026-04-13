const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    department: String,
    skills: [String],
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('PendingUser', pendingUserSchema);