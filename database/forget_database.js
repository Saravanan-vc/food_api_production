const mongoose = require('mongoose');

const forget = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trime: true
    }, code: {
        type: String,
        required: true,
        unique:true,
        trime:true
    }
});

module.exports = mongoose.model('forget', forget);