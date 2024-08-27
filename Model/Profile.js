// const {type} = require('@testing-library/user-event/dist/type');
const mongoose = require("mongoose");

const  profileSchema = new mongoose.Schema({
    gender : {
        type : String,
    },
    dateOfBirth : {
        type : String,
    },
    about : {
        type : String,
        trim : true,
    },
    contactNumber : {
        type : Number,
        trim : true,
    },
    linkedInUrl:{
        type : String,
        trim : true
    },
    githubUrl : {
        type : String,
        trim : true
    }
    
});

module.exports = mongoose.model('Profile', profileSchema);