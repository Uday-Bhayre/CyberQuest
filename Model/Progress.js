const mongoose = require('mongoose');

const progress = new mongoose.Schema({
    conceptId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'Concept',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    questionSolved : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Question",
    }],
})

module.exports = mongoose.model("Progress", progress);