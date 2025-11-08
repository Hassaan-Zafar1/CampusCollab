const User = require('../models/User');
   const bcrypt = require('bcryptjs');
   const jwt = require('jsonwebtoken');

   // Generate JWT Token
   const generateToken = (id) => {
     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
   };

   // Register User
   exports.register = async (req, res) => {
     try {
       const { name, email, password, role, department, skills } = req.body;

       // Check if user exists
       const userExists = await User.findOne({ email });
       if (userExists) {
         return res.status(400).json({ message: 'User already exists' });
       }

       // Hash password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);

       // Create user
       const user = await User.create({
         name,
         email,
         password: hashedPassword,
         role,
         department,
         skills: skills || []
       });

       res.status(201).json({
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

// Send OTP
const sendEmail = require('../utils/sendEmail');
   exports.sendOTP = async (req, res) => {
     try {
       const { email } = req.body;
       const user = await User.findOne({ email });

       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }

       // Generate 6-digit OTP
       const otp = Math.floor(100000 + Math.random() * 900000).toString();
       
       user.otp = otp;
       user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
       await user.save();

       await sendEmail(email, 'Email Verification OTP', `Your OTP is: ${otp}`);

       res.json({ message: 'OTP sent to email' });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };

   // Verify OTP
   exports.verifyOTP = async (req, res) => {
     try {
       const { email, otp } = req.body;
       const user = await User.findOne({ email });

       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }

       if (user.otp !== otp || user.otpExpires < Date.now()) {
         return res.status(400).json({ message: 'Invalid or expired OTP' });
       }

       user.isVerified = true;
       user.otp = undefined;
       user.otpExpires = undefined;
       await user.save();

       res.json({ message: 'Email verified successfully' });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };
