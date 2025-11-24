const jwt = require('jsonwebtoken');
   const User = require('../models/User');

   exports.protect = async (req, res, next) => {
     let token;

     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       try {
         token = req.headers.authorization.split(' ')[1];
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = await User.findById(decoded.id).select('-password');
         next();
       } catch (error) {
         res.status(401).json({ message: 'Not authorized' });
       }
     }

     if (!token) {
       res.status(401).json({ message: 'Not authorized, no token' });
     }
   };

// Check if user is a professor
exports.professorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'professor') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Only professors can perform this action.' 
    });
  }
};

// Check if user is a student
exports.studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Only students can perform this action.' 
    });
  }
};