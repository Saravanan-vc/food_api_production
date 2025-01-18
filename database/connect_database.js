const connectDB = require('mongoose');
require('dotenv').config();

connectDB.connect(process.env.MONOGO_DB).then(()=>{
    console.log('created database');
}).catch((e)=>{
    connectDB.connect(process.env.SECONDARY_MONOGODB).
    then((e)=>console.log('connected seconday database'))
});

module.exports = connectDB;