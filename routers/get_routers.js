const express = require('express');
const http = express.Router();
const connectDB = require('../database/DBconnection_database');
const cardDB = require("../database/cartfunction_database");
const imagepop = require('../database/imagefetching_database');
const favroutdata = require('../database/favrout_database');
const carsoullist = require('../database/carsoulimage_database');
const forget = require('../database/forget_database');
const mongoose = require('mongoose');
const image = require('../database/image_database');
const isCurrent = require('../helper/timerchecker');
const webrs = require('../database/restarunt_database');

http.get("/api/v1/restarunt", async (req, res) => {
    const gernerat = await webrs.find().select('-password -mail -firstname -lastname -phonenumber');
    // const spareat = await connectDB.find({ menu: { $elemMatch: { subcategry: { $exists: true } } } });
    // const alter = spareat.map((w) => w.menu.map((e) => e.subcategry));
    // const alterw = alter.map((t) => t.filter((e) => e != null));
    // const onemore = alterw.map((e) => [...new Set(e)]);
    const now = new Date();
    const datetime = {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
    };
    const adjestdata = gernerat.map((value) => {
        value.open = isCurrent(value.startTime, value.endTime, now.toLocaleString('en-IN', datetime));
        return value;
    }

    )
    res.status(201).json({
        'sucess': true,
        gernerat,
    });
})

http.get("/api/v1/cart", async (req, res) => {
    const cart = await cardDB.find({});
    res.status(201).json({
        'sucess': true,
        'cart': cart
    })
});

//fetching image for front pop
http.get('/api/v1/imagepop', async (req, res) => {
    const image = await imagepop.find({});
    res.status(201).json({
        "image": image,
    })
});

http.get('/api/v1/favrouit/all', async (req, res) => {
    const favroutall = await favroutdata.find({});
    res.status(201).json({
        favroutall
    })
});

http.get("/api/v1/carsoulimage", async (req, res) => {
    try {
        const listofimages = await carsoullist.find({});
        res.status(201).json({
            'sucess': true,
            listofimages
        })
    } catch (error) {
        res.status(400).json({
            'sucess': false,
        })
    }
});
http.get('/api/v1/checkcode/:code/:email', async (req, res) => {
    const code = req.params.code;
    const email = req.params.email;
    try {
        const exitst = await forget.findOne({ code: code });
        if (!exitst) {
            res.status(300).json({
                'sucess': false,
                "msg": "the code does not match"
            });
        } else {
            await forget.findOneAndDelete({ code: code });
            res.status(201).json({
                'sucess': true,
                'msg': 'code match crendital',
                'email': email
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            'sucess': false,
            'msg': 'something went wrong in node'
        })
    }
});

http.get("/api/v1/getimage", async (req, res) => {
    const total = await image.find({});
    total ? res.status(201).json({ 'sucess': true, total })
        : res.status(300).json({ 'sucess': false });
});


http.get("/api/v1/similarproduct/:subcategory/:id", async (req, res) => {
    const subcategory = req.params.subcategory;
    const id = req.params.id;
    const objectId = new mongoose.Types.ObjectId(id);
    try {
        const getSubcategory = await webrs.aggregate([
            {
                $match: { "menu.subcategory": subcategory }
            },
            {
                $project: {
                    restaruntname: 1,
                    restaruntaddress: 1,
                    logoimage: 1,
                    coverimage: 1,
                    restraunttax: 1,
                    category: 1,
                    open: 1,
                    menu: {
                        $filter: {
                            input: "$menu",
                            as: "item",
                            cond: {
                                $and: [
                                    { $eq: ["$$item.subcategory", subcategory] },
                                    { $ne: ["$$item._id", objectId] }
                                ]
                            }
                        }
                    }
                    
                }
            },
            {
                $match: { 
                    "menu": { $ne: [] } 
                }
            }
        ]);
        res.status(201).json({ 'sucess': true, getSubcategory })
    } catch (error) {
        res.status(400).json({ 'sucess': false });
    }
});
module.exports = http;