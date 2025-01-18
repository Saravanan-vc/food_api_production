const mongoose = require('mongoose');
const AutoInc = require('mongoose-sequence')(mongoose);
const cart = mongoose.Schema({
    id : Number,
    name: String,
    image :String,
    price : Number,
    subcategory : String,
    quntaty:Number
});
cart.plugin(AutoInc,{inc_field : 'id'});
module.exports = mongoose.model('cart',cart);