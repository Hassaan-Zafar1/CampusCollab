const express = require('express');
   const router = express.Router();
   const {preRegister, login, verifyOtpAndCreateUser}= require('../controllers/authController');

   router.post('/register', preRegister);
   router.post('/login', login);
   router.post('/verifyOTP' , verifyOtpAndCreateUser);

   module.exports = router;
   
const { protect } = require('../middleware/authMiddleware');
   router.get('/profile', protect, (req, res) => {
     res.json(req.user);
   });