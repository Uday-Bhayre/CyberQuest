const mongoose = require('mongoose');
const mailSender = require('../Utils/MailSender');
const emailTemplate = require('../Mail/Template/emailVerificationTemplate');


const OTPSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    }, 
    otp : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 5 * 60 * 60 * 60,
    }
});

// a function to send mail

async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, 'Verification Email from CyberQuest', emailTemplate(otp));
        console.log('Email sent successfully', mailResponse);
    }catch(error){
        console.log('error occured while sending mails ', error);
        throw error;
    }
}

OTPSchema.pre('save', async function(next){
    // only send an email when a new document is created
    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

module.exports = mongoose.model('OTP', OTPSchema);