const mongoose = require('mongoose');

const restaruntSchema = mongoose.Schema({
    "restaruntname":{
        type:String,
        required:true
    },
    "restaruntaddress":{
        type:String,
        require:true
    },
    "bio":{
        type:String,
        require:true
    },
    "logoimage":{
       type:String
    },
    "coverimage":{
       type:String
    },
    "restraunttax":{
        type:String,
        require:true
    },
    "category":{
        type:String,
        require:true
    },
    'firstname':{
        type:String,
        require:true
    },
    'lastname':{
        type:String,
        require:true
    },
    'phonenumber':{
        type:String,
        require:true
    },
    "mail":{
        type:String,
        require:true
    },
    "password":{
        type:String,
        require:true
    },
    "startTime":{
        type:String,
        require:true
    },
    "endTime":{
        type:String,
        require:true
    },
    "open":{
        type:Boolean,
        require:false
    },
    "menu":{
        type:[
            {
                name: String,
                image: String,
                price: Number,
                avlabel: { type: Boolean, default: false },
                startTime: String,
                endTime: String,
                rating:{type: Number , default : 0},
                subcategory: String,
                totalproduct:Number,
                description:String
            }
        ],
        default:[]
    }
});

module.exports = mongoose.model('Restarunts',restaruntSchema);