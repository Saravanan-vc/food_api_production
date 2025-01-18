const express = require('express');
require('dotenv').config();
const cartAd = require('../database/cartfunction_database');
const auth = require("../database/authfunction_database");
const liked = require('../database/favrout_database')
const httpPost = express.Router();
const restarunt = require('../database/demo_check');
const authlogin = require('../database/authfunction_database');
const bcrypt = require('bcrypt');
const forget = require('../database/forget_database');
const nodemailer = require("nodemailer");
const mailoptions = require("../mail/send_details");
const image = require("../database/image_database");
const webrestarunt = require('../database/restarunt_database');
const path = require('path');

//multer used in [binary way]
const multer = require('multer');
const storage = multer.memoryStorage();
const uploade = multer({ storage: storage });

//multer used in [path way]
const storagepath = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, 'uploads/');
    },
    filename: function (req, file, cd) {
        cd(null, Date.now() + path.extname(file.originalname));
    }
});
const uploadepath = multer({ storage: storagepath });



httpPost.post('/api/v1/add/cart', async (req, res) => {
    try {

        const { name, image, price, quntaty } = req.body;

        const added = cartAd({
            name,
            image,
            price,
            quntaty
        });

        const save = added.save();
        res.status(201).json({
            "sucess": true,

        })
    } catch {
        req.status(400).json({
            "sucess": false,
            "isuue": 400
        })
    }
});

//authentication to send password,mail

httpPost.post("/api/v1/sign", async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    const extest = await auth.findOne({ email: email });
    if (extest) {
        res.status(300).json({
            'sucess': false,
            'message': 'already have account'
        })
    } else {

        try {

            const newauth = new auth({
                name,
                email,
                password
            });
            const saved = await newauth.save();

            res.status(201).json({
                'sucess': true,
            });
        } catch (error) {
            res.status(400).json({
                'sucess': false,

            });
        }
    }

});

httpPost.post('/api/v1/cart/increment/:id', async (req, res) => {
    const ID = req.params.id; // Correctly access the path parameter
    try {
        const result = await cartAd.updateOne(
            { id: ID },
            { $inc: { quntaty: 1 } }
        );
        res.json({ "success": true });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            'success': false,
            'error': error.message // Return the error message if something goes wrong
        });
    }
});

httpPost.post('/api/v1/cart/decrement/:id', async (req, res) => {
    const ID = req.params.id;
    try {
        const result = await cartAd.updateOne(
            { id: ID },
            { $inc: { quntaty: -1 } }
        );
        res.status(200).json(
            {
                "sucess": true,
                "decrement": result
            }
        )
    } catch (error) {
        res.status(400).json({
            'sucess': false,
            'error': error
        })
    }
});

httpPost.post('/api/v1/favrouit', async (req, res) => {

    try {
        const { name, image, price, quntaty, favrout } = req.body;
        const newfavrout = liked({

            name,
            image,
            price,
            quntaty,
            favrout
        });
        const result = newfavrout.save();
        res.status(201).json({
            'sucess': true
        })
    } catch (error) {
        res.status(400).json({
            'sucess': false,
            "error": error
        })
    }
});

httpPost.post("/api/v1/admin/restarunt/add", async (req, res) => {
    const { name, addres } = req.body;
    try {
        const added = restarunt({
            name: name,
            addres: addres
        });
        const save = await added.save();
        res.status(201).json({
            "sucess": true,
        });
    } catch (error) {
        res.status(400).json({ "sucess": false });
    }
});

httpPost.post("/api/v1/login", async (req, res) => {
    const { email, password } = req.body;
    if (email.trim().length === 0 || password.trim().length === 0) {
        res.status(350).json({
            "success": false,
            "msg": "Email and password shoul not be empty"
        });
    }
    try {
        const user = await authlogin.findOne({ email: email });
        if (!user) {
            res.status(220).json({
                "success": false,
                "msg": "No user in this email"
            });
        } else {
            const checkp = await bcrypt.compare(password, user.password);
            if (!checkp) {
                res.status(320).json({
                    'success': false,
                    "msg": "Credentail failed"
                });
            } else {

                res.status(201).json({
                    'sucess': true,
                    "msg": "login sucessfuly",
                });
            }
        }
    } catch (error) {
        res.status(390).json({
            'sucess': false,
            "msg": "something went wrong"
        });
    }
});

//send forget password
httpPost.post("/api/v1/forget", async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);
    const exitst = await auth.find({ email: email });
    if (!email || email.trim().length === 0) {
        res.status(320).json({
            'sucess': false,
            "msg": "email must have"
        });

    } else if (exitst) {
        await forget.findOneAndDelete({ email: email });
        try {
            const saved = await forget({
                email: email,
                code: code
            })
            await saved.save();
            const transporter = nodemailer.createTransport({
                host: process.env.TRANSPORT_HOST,
                port: 587,
                secure: false,
                auth: {
                    user: process.env.AUTH_USER,
                    pass: process.env.AUTH_PASS,
                },
            });
            const options = mailoptions(email, code)
            transporter.sendMail(options, (error, info) => {
                if (error) {
                    console.log(`error:${error}`);
                }
                console.log(`send mail :${info}`);

            });

            res.status(201).json({
                'sucess': true,
                "msg": 'resert pin send to email sucessfuly',
                'email': email
            })

        } catch (error) {
            console.log(error)
            res.status(320).json({
                'sucess': false,
                'msg': 'something went wrong'
            });
        }
    } else if (!exitst) {
        res.status(320).json({
            'sucess': false,
            "msg": "Not have mail"
        })
    }

    else {
        res.status(400).json({
            'sucess': false,
            "msg": "This email does not have account"
        })
    }

});


//update particular value this for password 

httpPost.post('/api/v1/updatepassword', async (req, res) => {
    const { email, password } = req.body;
    try {
        const bcryptpassword = await bcrypt.hash(password, 10);
        await auth.updateOne({ email: email }, { $set: { password: bcryptpassword } });
        res.status(201).json({
            'sucess': true,
            'msg': 'sucessfuly changed password'
        })
    } catch (error) {
        console.log(error);
        res.status(390).json({
            'sucess': false,
            'msg': 'something went wrong in node'
        })
    }
})

httpPost.post("/api/v1/image", uploade.single('Image'), (req, res) => {
    const uploadimage = image({
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
    });
    uploadimage.save()
        .then((saved) => res.status(201).json({ 'sucess': true, }))
        .catch((error) => res.status(300).json({ 'sucess': false }));
});

httpPost.post("/api/v1/web/res", uploadepath.fields([{ name: "logoimage" }, { name: "coverimage" }]), async (req, res) => {
    const { restaruntname, restaruntaddress,bio,
        restraunttax, category, firstname,
        lastname, phonenumber, mail, password, startTime, endTime } = req.body;
    const logoimage = "uploads/" + req.files['logoimage'][0].filename;
    const coverimage = "uploads/" + req.files['coverimage'][0].filename;
    const hashpassword = await bcrypt.hash(password, 10);
    try {
        const webrestaruntsave = await webrestarunt({
            restaruntname: restaruntname,
            restaruntaddress: restaruntaddress,
            restraunttax: restraunttax,
            bio:bio,
            category: category,
            firstname: firstname,
            lastname: lastname,
            phonenumber: phonenumber,
            mail: mail,
            password: hashpassword,
            logoimage: logoimage,
            coverimage: coverimage,
            startTime: startTime,
            endTime: endTime,
            open: false
        });
        const issaved = webrestaruntsave.save();
        if (!issaved) { res.status(300).json({ 'sucess': false }); }
        res.status(201).json({ 'sucess': true });
    } catch (error) {
        res.status(350).json({ "sucess": false, "failed": "something Went wrong" });
    }
});

httpPost.post("/api/v1/web/addmenu/:name", uploadepath.single('image'), async (req, res) => {
    const name = req.params.name;
    const { productname, price,discription,
         startTime, endTime,
        subcategory } = req.body;
    const image = "uploads/" + req.file.filename;
    console.log(image);

    try {
        await webrestarunt.updateOne(
            { restaruntname: name },
            {
                $push: {
                    menu: {
                        name: productname,
                        image: image,
                        price: price,
                        startTime: startTime,
                        endTime: endTime,
                        subcategory: subcategory,
                        totalproduct:0,
                        description:discription
                    }
                }
            }
        );
        res.status(200).json({ "sucess": true, "msg": "All good" })

    } catch (error) {
        res.status(300).json({ 'sucess': false, "msg": "something wentwrong catch" });
    }
});

module.exports = httpPost;
