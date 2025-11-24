const User = require('../models/User');
const PendingUser = require('../models/pendingUser');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const sendEmail = require('../utils/sendEmail');

   // Generate JWT Token
   const generateToken = (id) => {
     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
   };

   // Login function
   exports.login = async (req, res) => {
     try {
       const { email, password } = req.body;

       // Check user exists
       const user = await User.findOne({ email });
       if (!user) {
         return res.status(400).json({ message: 'Invalid credentials' });
       }

       // Check password
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
         return res.status(400).json({ message: 'Invalid credentials' });
       }

       res.json({
         _id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
         token: generateToken(user._id)
       });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };

exports.preRegister = async (req, res) => {
  try {
    const { name, email, password, role, department, skills } = req.body;

    // Prevent duplicate account
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    // Delete previous OTP request for same email
    await PendingUser.deleteMany({ email });

    // Hash password before storing temporarily
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      skills,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000
    });

    await sendEmail(email, "Email Verification OTP", `Your OTP is: ${otp}`);

    res.json({ message: "OTP sent to email. Please verify." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyOtpAndCreateUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pending = await PendingUser.findOne({ email });
    if (!pending)
      return res.status(400).json({ message: "No registration request found" });

    if (pending.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (pending.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // OTP valid → create user
    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: pending.role,
      department: pending.department,
      skills: pending.skills,
      isVerified: true
    });

    // Remove temp data
    await PendingUser.deleteMany({ email });

    res.json({
      message: "Registration successful",
      user,
      token: generateToken(user._id)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

