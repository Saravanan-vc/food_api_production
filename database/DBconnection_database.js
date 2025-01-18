const connectDB = require('mongoose');

const restarunts = connectDB.Schema({

    name: String,
    coverimage: String,
    logoimage: String,
    category: String,
    rating: Number,
    address: String,

    open: { type: Boolean, default: false },
    menu: {
        type: [
            {
                name: String,
                image: String,
                price: Number,
                avlabel: { type: Boolean, default: true },
                subcategory: String,
            }
        ],
        default: []
    },
    bio: String,

});

module.exports = connectDB.model('restarunts', restarunts);