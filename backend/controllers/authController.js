const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Keep one consistent user payload everywhere
const buildUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  department: user.department || '',
  role: user.role,
  github: user.github || '',
  linkedin: user.linkedin || '',
  portfolio: user.portfolio || '',
  profilePicture: user.profilePicture || '',
  skills: Array.isArray(user.skills) ? user.skills : [],
  isVerified: Boolean(user.isVerified),
});

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      ...buildUserPayload(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.preRegister = async (req, res) => {
  try {
    const { name, email, password, role, department, skills } = req.body;

    // Prevent duplicate account
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    await PendingUser.deleteMany({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const normalizedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      skills: normalizedSkills,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    // Create attractive HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - NED Collab</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          }
          .header {
            background: linear-gradient(135deg, #800000 0%, #b30000 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
            line-height: 1.6;
          }
          .greeting strong {
            color: #800000;
          }
          .otp-section {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
            border: 2px solid #800000;
          }
          .otp-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          .otp-code {
            font-size: 42px;
            font-weight: 800;
            color: #800000;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
          }
          .otp-timer {
            font-size: 13px;
            color: #d9534f;
            margin-top: 10px;
          }
          .instructions {
            background: #f0f8ff;
            padding: 20px;
            border-left: 4px solid #800000;
            border-radius: 4px;
            margin: 25px 0;
          }
          .instructions h3 {
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
          }
          .instructions ol {
            padding-left: 20px;
            font-size: 13px;
            color: #555;
            line-height: 1.8;
          }
          .instructions li {
            margin-bottom: 8px;
          }
          .security-note {
            background: #fff3cd;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
            font-size: 12px;
            color: #856404;
            line-height: 1.6;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
          }
          .footer a {
            color: #800000;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #800000;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: background 0.3s ease;
          }
          .button:hover {
            background: #b30000;
          }
          .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #800000, transparent);
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Email Verification</h1>
            <p>Welcome to NED Collab - Campus Research Platform</p>
          </div>

          <div class="content">
            <div class="greeting">
              Hello <strong>${name}</strong>,
              <br><br>
              Thank you for registering with NED Collab! We're excited to have you on our research collaboration platform. To complete your registration, please verify your email address using the One-Time Password (OTP) below.
            </div>

            <div class="otp-section">
              <div class="otp-label">Your One-Time Password</div>
              <div class="otp-code">${otp}</div>
              <div class="otp-timer">⏱️ Valid for 10 minutes</div>
            </div>

            <div class="instructions">
              <h3>How to proceed:</h3>
              <ol>
                <li>Copy the OTP code above</li>
                <li>Return to the NED Collab registration page</li>
                <li>Paste the OTP code in the verification field</li>
                <li>Click "Verify OTP" to complete registration</li>
              </ol>
            </div>

            <div class="security-note">
              <strong>🔒 Security Alert:</strong> We will never ask you to share this OTP via email, phone, or any other communication channel. If you didn't initiate this registration, please ignore this email or contact our support team immediately.
            </div>

            <p style="font-size: 14px; color: #555; line-height: 1.8;">
              <strong>Registration Details:</strong><br>
              📧 Email: ${email}<br>
              👤 Role: ${role.charAt(0).toUpperCase() + role.slice(1)}<br>
              🏢 Department: ${department}
            </p>

            <div class="divider"></div>

            <p style="font-size: 13px; color: #666; line-height: 1.6;">
              If you have any questions or need assistance, please don't hesitate to reach out to our support team at 
              <a href="mailto:support@nedcollab.edu.pk" style="color: #800000;">support@nedcollab.edu.pk</a>
            </p>
          </div>

          <div class="footer">
            <p>
              © 2026 NED Collab. All rights reserved.<br>
              <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a>
            </p>
            <p style="margin-top: 10px; font-size: 11px; opacity: 0.8;">
              National University of Sciences and Technology (NUST) - Karachi
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(
      email,
      "🔐 Email Verification - NED Collab Registration",
      `Your OTP is: ${otp}`,
      htmlContent
    );

    return res.json({ message: "OTP sent to email. Please verify." });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.verifyOtpAndCreateUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pending = await PendingUser.findOne({ email });
    if (!pending) {
      return res.status(400).json({ message: 'No registration request found' });
    }

    if (pending.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (pending.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: pending.role,
      department: pending.department,
      skills: pending.skills,
      isVerified: true,
    });

    await PendingUser.deleteMany({ email });

    return res.json({
      message: 'Registration successful',
      ...buildUserPayload(user),
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update User Profile logic
exports.updateProfile = async (req, res) => {
  try {
    const { name, github, linkedin, portfolio, department, skills, profilePicture } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (github !== undefined) updateData.github = github;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (department !== undefined) updateData.department = department;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(buildUserPayload(updatedUser));
  } catch (error) {
    return res.status(500).json({ message: 'Server Error: Could not update profile' });
  }
};