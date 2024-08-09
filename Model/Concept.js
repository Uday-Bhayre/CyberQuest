const { required } = require('joi');
const mongoose = require('mongoose');

const conceptSchema = new mongoose.Schema({
    conceptName : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    questionList : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required:true,
            ref : 'Question',
        }
    ],
});

module.exports = mongoose.model('Concept', conceptSchema);