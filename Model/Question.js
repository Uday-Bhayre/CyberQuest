const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    url : {
        type : String,
        required : true,
    },
    answer : {
        type : String,
        required : true,
    },
    difficulty : {
        type : String,
        enum : ['easy', 'medium', 'hard'],
    },
});

module.exports = mongoose.model('Question', questionSchema);