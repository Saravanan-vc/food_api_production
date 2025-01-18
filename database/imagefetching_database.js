const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AutoInc = require('mongoose-sequence')(mongoose);

const imagefetch = mongoose.Schema({
    image: String
});

module.exports = mongoose.model('images',imagefetch);
