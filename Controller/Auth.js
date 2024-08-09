const User = require('../Model/User');
const OTP = require('../Model/Otp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const OtpGen = require('otp-generator');
const Profile = require('../Model/Profile');
require('dotenv').config();

// OTP generator
exports.OtpGenerator = async (req, res) => {
    try{
        console.log('1');
        const {email} = req.body;
        
        console.log('2');
        const duplicate = await User.findOne({email});

        if(duplicate) {
            return res.status(401).json({
                success : false,
                message : 'User already exists'
            });
        }


        var otp = OtpGen.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });

        console.log('otp generated',otp);

        // For unique OTP
        let result = await OTP.findOne({otp : otp});
        while(result){
            var otp = OtpGen.generate(6, {
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars : false,
            });
            result = await OTP.findOne({ otp });
        }

        const otpResponse = await OTP.create({ email, otp});
        console.log("OTP response",otpResponse);
        console.log('7');
        return  res.status(200).json({
            success : true,
            message : 'OTP sent successfully',
            otp,
        });
        

    }catch(err){
        return res.status(401).json({
            success : false,
            message : 'Error in sending the OTP' + err.message,
        });
    }
};

// SignUp
exports.signup = async (req, res) => {
  console.log("a");
    try {
      const {
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        accountType,
        otp,
      } = req.body;
  
  
      // try {
      //   const result = await validateUser.validateAsync(req.body);
      // } catch (err) {
      //   console.log("Error During Validation", err);
      // }
      

      // validation
      if(!firstName || !lastName || !email || !password || !confirmPassword || !otp || !accountType){
        return res.status(403).json({
            success : false,
            message : 'All fields are required',
        });
      }

      // password match
      if(password !== confirmPassword){
        return res.status(400).json({
            success : false,
            message : 'Password and confirm password value does not match, please try again',
        });
      }

      // check user already exist or not
      const existingUser = await User.findOne({email});
      if(existingUser){
        return res.status(400).json({
            success : false,
            message : 'User is already registered',
        });
      }

      // Find Most Recent Otp
      const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
      // const recentOtp = await OTP.findOne({ email })
      
  
  
      console.log(recentOtp)
      if (!recentOtp || recentOtp.length == 0) {
        return res.status(401).json({
          success: false,
          message: "Otp Expire",
        });
      }
  
  
      console.log("4")
      // Match Otp
      
      if (otp !== recentOtp.otp) {
        return res.status(401).json({
          success: false,
          message: "Otp Not Match",
        });
      }
  
  
       console.log("5")
      const hashPassword = await bcrypt.hash(password, 10);
      
      const profileDetails = await Profile.create({
        gender : null,
        dateOfBirth : null,
        about : null,
        contactNumber : null,
      });

      console.log("6")
      // Create Entry In DB
      
      const user =  await User.create({
          email,
          firstName,
          lastName,
          password: hashPassword,
          accountType,
          additionalDetails:profileDetails._id,
          image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        });
      
      
  
  
       console.log("7")
      return res.status(200).json({
        success: true,
        user,
        message: "Account Created Successfully",
      });
    } catch (err) {
      return res.status(200).json({
        success: false,
        message: "Signup Failed",
      });
    }
  };
  
  exports.login = async (req, res) => {
    try {
      // Fetch the Data
      console.log("1")
      const { email, password } = req.body;
      console.log("2")

      if(!email || !password){
        return res.status(403).json({
            success : false,
            message : 'All fields are required, please try again'
        });
      }
      // Validate The Data
      // try {
      //   const response = await validateUser.validateAsync(req.body);
      // } catch (err) {
      //   console.log("Error While Validating", err);
      // }
      console.log("3")
    
      // Check Existance of User
      const user = await User.findOne({ email }).populate('additionalDetails');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User Does Not Exist",
        });
      }
      console.log("4")
  
      // Check Password
      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) {
        return res.status(401).json({
          success: false,
          message: "Password Not Match",
        });
      }
      console.log("5")
  
      // Create Payload
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      console.log("6")
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });
  
      user.token = token;
      user.password = undefined;
      console.log("Login 7")
  
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      console.log("8")
  
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  };
  

  exports.changePassword = async (req, res) => {
    try {
      const userDetails = await User.findById(req.user.id);                         // Get user data from req.user
      const { oldPassword, newPassword, confirmNewPassword } = req.body;            // Get old password, new password, and confirm new password from req.body
  
      const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password );                 // Validate old password
         
      if(!isPasswordMatch) {                                  // If old password does not match, return a 401 (Unauthorized) error
        return res.status(401).json({ success: false, message: "The password is incorrect" });	 
      }
  
      if(newPassword !== confirmNewPassword) {                             // Match new password and confirm new password
              return res.status(401).json({ success: false, message: "The password and confirm password does not match" });	 
      }
         
      const encryptedPassword = await bcrypt.hash(newPassword, 10);             // Update password
      const updatedUserDetails = await User.findByIdAndUpdate(req.user.id , { password: encryptedPassword } , { new: true });
                                                                                    // find user by id and then update password = encryptedPassword , here if you "const updatedUserDetails =" does not wirte this then also it not affect;
       
      try {                                                          // Send notification email , here passwordUpdated is template of email which is send to user;
        const emailResponse = await mailSender(updatedUserDetails.email, passwordUpdated(updatedUserDetails.email, `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`));
        console.log("Email sent successfully:", emailResponse.response);
         } 
          catch(error) {
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        });
      }
  
      return res.status(200).json({ success: true, message: "Password updated successfully" });         // Return success response 	 
     } 
      catch(error) {
      console.error("Error occurred while updating password:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      });
    }
  };
  