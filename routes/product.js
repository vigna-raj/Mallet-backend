const express = require('express')
const multer = require('multer')
const router = express.Router()
const Product = require('../models/Product');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const authenticateToken = require("../middlewares/authenticateToken");

//Configure Filestorage
const storage = multer.diskStorage({
    destination: "./assets/images",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })


// Route 1 for adding new product using POST (Admin auth required)

router.post('/api/addproduct', authenticateToken, [
    body('name', "name must atlest have 3 characters").isLength({ min: 3 }),
    body('category', "category must atlest have 3 characters").isLength({ min: 3 }),
    body('stock', "Stock must be a number").isInt(),
    body('price', "price must be a number").isFloat(),
    body('description', "description must atlest have 3 characters").isLength({ min: 3 }),
    body('miscellaneous', "Specifications must be an object").isObject(),
    body('imageurls', "imageurls must be an object").isArray()


], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: "Error Not saved" });
        }
        const newproduct = await Product.create(
            {
                name: req.body.name,
                category: req.body.category,
                stock: req.body.stock,
                price: req.body.price,
                description: req.body.description,
                miscellaneous: req.body.miscellaneous,
                images: req.body.imageurls
            }
        )
        res.status(200).send("Product saved sucessfully!");
    }
    catch (err) {

        res.status(500).send("Internal server error")
    }
})

// Route 2 for updating product details using PUT (Auth required)

router.put('/api/updateproduct', authenticateToken, async (req, res) => {
    try {
        const user_id = req.data.id;
        const prod_id = req.body.id;
        var cur_user = await User.findOne({ _id: user_id });
        var prod = await Product.findOne({ _id: prod_id });
        if (!cur_user) {
            return res.status(404).send("user not found");
        }
        if (!prod) {
            return res.status(404).send("Product not found");
        }
        var new_prod = {};
        if (req.body.name) {
            new_prod.name = req.body.name
        }
        if (req.body.category) {
            new_prod.category = req.body.category
        }
        if (req.body.stock) {
            new_prod.stock = req.body.stock
        }
        if (req.body.price) {
            new_prod.price = req.body.price
        }
        if (req.body.description) {
            new_prod.description = req.body.description
        }
        if (req.body.miscellaneous) {
            new_prod.miscellaneous = req.body.miscellaneous
        }
        if (req.body.rating) {
            new_prod.rating = req.body.rating
        }
        var new_rev = {}
        if (req.body.ratings) {
            new_rev.ratings = req.body.ratings
        }
        if (req.body.text) {
            new_rev.text = req.body.text
        }

        if (Object.keys(new_rev).length !== 0) {
            new_rev.userid = user_id
            prod = await Product.findByIdAndUpdate(prod_id, { $push: { reviews: new_rev } })
        }
        if (Object.keys(new_prod).length !== 0) {
            prod = await Product.findByIdAndUpdate(prod_id, { $set: new_prod }, { new: true })
        }
        res.json({ prod });

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send("Internal server error")
    }
})
// Route 3 Endpoint for fetching Product data using POST(Login required)

router.post('/api/prodminimal', authenticateToken, async (req, res) => {
    try {
        const prod_id = req.body.id;
        const prod = await Product.findOne({ _id: prod_id }).select("-stock -description -miscellaneous -reviews");
        if (!prod) {
            return res.status(404).send("Product not found");
        }
        res.send(prod)

    } catch (error) {

        res.status(500).send({ errors: "Internal Server Error" });
    }
})

// Route 4 Endpoint for fetching Product data using POST(Login required)

router.post('/api/prod', authenticateToken, async (req, res) => {
    try {
        const prod_id = req.body.id;
        const prod = await Product.findOne({ _id: prod_id });
        if (!prod) {
            return res.status(404).send("Product not found");
        }
        res.send(prod)
    } catch (error) {

        res.status(500).send({ errors: "Internal Server Error" });
    }
})

// Route 5 Endpoint for deleting Product using DELETE (login required)

router.delete('/api/removeprod', authenticateToken, async (req, res) => {
    try {
        const user_id = req.data.id;
        const prod_id = req.body.id;
        var cur_user = await User.findOne({ _id: user_id });
        var prod = await Product.findOne({ _id: prod_id });
        if (!cur_user) {
            return res.status(404).send("User not found");
        }
        if (!prod) {
            return res.status(404).send("Product not found");
        }
        prod = await Product.findByIdAndDelete(prod_id)
        res.json({ "Success": "product has been deleted", product: prod });
    }
    catch (err) {

        res.status(500).send("Internal server error")
    }
})

// Route 6 for uploading images

router.post('/api/uploadimg', upload.array("photo", 5), authenticateToken, (req, res) => {
    let urlarr = req.files.map((fl) => { return "http://localhost:5000/images/" + fl.filename });
    res.send({
        urlarray: urlarr
    })
})

module.exports = router