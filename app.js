const express = require('express');
const routers = require('./routers/get_routers');
const database = require('./database/connect_database');
const bodyParser = require('body-parser');
const post = require('./routers/post_routers');
const cors = require('cors');
const path = require("path");

const http = express();
http.use(cors());
http.use(bodyParser.json());
http.use(post);
http.use(routers);
http.use("/uploads",express.static(path.join(__dirname,'uploads')));


http.listen(3005,()=>{
    console.log('created server http://localhost:3005/api/v1/restarunt')
});
