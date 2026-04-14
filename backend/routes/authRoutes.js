const express = require('express');
const router = express.Router();

const { 
    preRegister, 
    login, 
    verifyOtpAndCreateUser, 
    updateProfile // New function
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', preRegister);
router.post('/login', login);
router.post('/verifyOTP', verifyOtpAndCreateUser);

// Private Routes (Require Token)
router.put('/update-profile', protect, updateProfile);

// Existing profile GET route
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;