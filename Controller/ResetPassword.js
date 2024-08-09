const User = require('../Model/User');
const mailSender = require('../Utils/MailSender');
const bcrypt = require('bcrypt');


// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try{
            // get email from req body
    const email = req.body.email;

    // check user for this email, email validation
    const user = await User.findOne({ email : email });
    if(!user) {
        return res.json({
            success : false,
            message : 'Your email is not registered with us',
        });
    }

    //generate token
    const token = crypto.randomUUID();
    // update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
                                    {email : email}, 
                                    {token : token,
                                     resetPasswordExpires : Date.now() + 5 * 60 *1000,
                                    },
                                    {new : true},
                                );

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containing url
    await mailSender(email, 
                        "Password Reset Link",
                        `Password Reset Link : ${url}`
                    );
    return res.json({
        success: true,
        message : 'Email sent successfully, please check email and change password',
    });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'something went wrongn while sending mail for reset password',
        });
    }
    
}


//resetPassword
exports.resetPassword = async (req, res) =>{
    // data fetch
    // validation
    // get userdetails from db using token
    // if no entry - invalid token
    //token time check
    // hash pass
    // update pass
    // return response
    try{
        const {password, confirmPassword, token} = req.body;
        if(password !== confirmPassword){
            return res.json({
                success : false,
                message : 'Password not matching',
            });
        }
        const userdetails = await User.findOne({token : token});
        if(!userdetails){
            return res.json({
                success : false,
                message : 'Token is invalid',
            });
        }

        if(userdetails.resetPasswordExpires < Date.now()){
            return res.json({
                success : false,
                message : 'Token expired',
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({token : token}, {password : hashedPass}, {new : true},);

        return res.status(200).json({
            success : true,
            message : 'Password reset successfully',
        });
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'something went wrongn while reset password',
        });

    }

}