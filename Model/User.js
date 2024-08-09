// const {type} = require('@testing-library/user-event/dist/type');
const { required } = require("joi");
const mongoose = require("mongoose");

const  userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
    },
    accountType : {
        type : String,
        enum : ['Student', 'Admin'],
        default : 'Student',
        required:true,
    },
    image : {
        type : String,
        required : true,
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "Profile",
    },
    token : {
        type : String,
    },

    progress : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Progress",
    }],
    
},
{timestamps : true });

module.exports = mongoose.model('User', userSchema);