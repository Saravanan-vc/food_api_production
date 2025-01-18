const mongoose = require('mongoose');

const carsoul = mongoose.Schema({
    image : [String]
});

module.exports = mongoose.model('carsoulimage',carsoul);