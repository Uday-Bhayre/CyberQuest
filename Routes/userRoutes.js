const express = require('express');
const router = express.Router();

const { login, signup, OtpGenerator, changePassword, verifyOTP } = require('../Controller/Auth');

const { resetPasswordToken, resetPassword} = require("../Controller/ResetPassword");

const { auth } = require('../MiddleWare/auth');

// routes for login, signup and authentication
//---------------------------------------------

// login route
router.post('/login', login);

// signup route
router.post('/signup', signup)

// route for sending otp to the user's email
router.post('/sendotp',OtpGenerator);

router.post('/verifyotp',verifyOTP);

//reset pass route
router.post('/changepassword', auth, changePassword);
//----------------------------------------------------

// reset password
//------------------

router.post('/reset-password-token', resetPasswordToken);
router.post('/reset-password', resetPassword);

module.exports = router;