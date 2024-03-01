const express = require('express')
const router = express.Router()
const dotenv = require('dotenv').config()
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const authenticateToken = require("../middlewares/authenticateToken");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

//Route 1 Signin using POST (login not required )
router.post('/api/signin', [
    body('name', "Name should be at least 5 chars").isLength({ min: 5 }),
    body('email', "Enter ").isEmail(),
    body('password', "Password should be at least 5 chars").isLength({ min: 5 }),
    body('phone_no', "phoneno should have 10 digits").isLength({ min: 10, max: 10 }),
],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: "Enter valid Email" });
            }
            const chk_dup = await User.findOne({ email: req.body.email });
            if (chk_dup) {
                return res.status(400).send({ errors: "User already exists" });
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
            const user = await User.create(
                {
                    name: req.body.name,
                    password: hash,
                    email: req.body.email,
                    phone_no: req.body.phone_no,
                    address: req.body.address
                }
            );
            var token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
            res.json({ token: token })
        }
        catch (er) {
            res.status(500).send({ errors: er.message })
        }
    })


// Route 2 Endpoint for login using POST(login not required)

router.post('/api/login', [
    body('email', "Enter ").isEmail(),
    body('password', "Name should be at least 5 chars").isLength({ min: 5 }),
],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: "Check your login credentials" });
            }
            const chk_user = await User.findOne({ email: req.body.email });
            if (!chk_user) {
                return res.status(400).send({ errors: "Check your login credentials" });
            }
            const valid_pass = await bcrypt.compare(req.body.password, chk_user.password);
            if (!valid_pass) {
                return res.status(400).send({ errors: "Check your login credentials" });
            }
            var token = jwt.sign({ id: chk_user._id }, process.env.JWT_KEY);
            res.json({ token: token })
        }
        catch (er) {
            res.status(500).send({ errors: "Internal server error" })
        }

    })

// Route 3 Endpoint for updateUser using PUT(login required)

router.put('/api/edituser', authenticateToken, async (req, res) => {
    try {
        const user_id = req.data.id;

        var cur_user = await User.findOne({ _id: user_id });
        if (!cur_user) {
            return res.status(404).send("user not found");
        }
        var new_user = {};
        if (req.body.address) {
            new_user.address = req.body.address
        }
        if (req.body.phone_no) {
            new_user.phone_no = req.body.phone_no
        }
        cur_user = await User.findByIdAndUpdate(user_id, { $set: new_user }, { new: true })
        res.json({ cur_user });

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send("Internal server error")
    }
})

// Route 4 Endpoint for fetching user data POST(Login required)

router.post('/api/fetchdata', authenticateToken, async (req, res) => {
    try {
        const user_id = req.data.id;
        const user = await User.findOne({ _id: user_id }).select("-password");
        res.send(user)
    } catch (error) {

        res.status(500).send({ errors: "Internal Server Error" });
    }
})


module.exports = router