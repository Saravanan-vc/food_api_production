const monogoose = require('mongoose');

const monogoosedb = monogoose.Schema({
    image:{
        data:Buffer,
        contentType:String
    }
});

module.exports = monogoose.model('image',monogoosedb);