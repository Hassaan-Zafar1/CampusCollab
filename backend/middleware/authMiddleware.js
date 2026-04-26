const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

// Check if user is a professor
exports.professorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'professor') {
    return next();
  }
  return res.status(403).json({
    message: 'Access denied. Only professors can perform this action.',
  });
};

// Check if user is a student
exports.studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  return res.status(403).json({
    message: 'Access denied. Only students can perform this action.',
  });
};

// Check if user is an admin
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    message: 'Access denied. Admin privileges required.',
  });
};