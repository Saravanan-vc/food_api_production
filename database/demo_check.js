const mongoose = require('mongoose');

const demo = mongoose.Schema({
    name : String,
    addres : String
});

module.exports = mongoose.model('Demo',demo);