const express = require('express');
   const router = express.Router();
   const { register, login, sendOTP, verifyOTP } = require('../controllers/authController');

   router.post('/register', register);
   router.post('/login', login);
   router.post('/sendOTP', sendOTP);
   router.post('/verifyOTP', verifyOTP);

   module.exports = router;
   
const { protect } = require('../middleware/authMiddleware');
   router.get('/profile', protect, (req, res) => {
     res.json(req.user);
   });