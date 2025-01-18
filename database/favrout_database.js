const mongoose = require('mongoose');

const favrout = mongoose.Schema({
    name : String,
    image : String,
    price : Number,
    quntaty :Number,
    favrout : Boolean
 });
 module.exports = mongoose.model('favrouit',favrout);