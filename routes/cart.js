const express = require('express')
const router = express.Router()
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const authenticateToken = require("../middlewares/authenticateToken");


// Route 1 for placing new cart using POST (Login required)

router.post('/api/addtocart', authenticateToken, [
    body('qty', "qty must be a number").isInt(),


], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: "Error Not saved" });
        }
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
        const neworder = await Cart.create(
            {
                userid: user_id,
                productid: prod_id,
                count: req.body.qty,
            }
        )
        res.status(200).send("Product added to cart sucessfully!");
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send("Internal server error")
    }
})

// Route 2 Endpoint for removing item from cart using DELETE (login required)

router.delete('/api/removefromcart', authenticateToken, async (req, res) => {
    try {
        const user_id = req.data.id;
        const cart_id = req.body.id;
        var cur_user = await User.findOne({ _id: user_id });
        var cart = await Cart.findOne({ _id: cart_id });
        if (!cur_user) {
            return res.status(404).send("User not found");
        }
        if (!cart) {
            return res.status(404).send("cart not found");
        }
        cart = await Cart.findByIdAndDelete(cart_id)
        res.json({ "Success": "Product has been removed from cart", cart: cart });
    }
    catch (err) {

        res.status(500).send("Internal server error")
    }
})

// Route 3 Endpoint for fetching Cart details using POST(Login required)

router.post('/api/viewcart', authenticateToken, async (req, res) => {
    try {
        const cart_id = req.body.id;
        const cart = await Cart.findOne({ _id: cart_id });
        if (!cart) {
            return res.status(404).send("cart not found");
        }
        res.send(cart)
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ errors: "Internal Server Error" });
    }
})


// Route 4 for updating cart details using PUT (Auth required)

router.put('/api/updatecart', authenticateToken, [
    body('qty', "qty must be a number").isInt(),

], async (req, res) => {
    try {
        const user_id = req.data.id;
        const cart_id = req.body.id;
        var cur_user = await User.findOne({ _id: user_id });
        var cart = await Cart.findOne({ _id: cart_id });
        if (!cur_user) {
            return res.status(404).send("user not found");
        }
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
        cart = await Cart.findByIdAndUpdate(cart_id, { $set: { count: req.body.qty } })
        res.json({ cart });

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send("Internal server error")
    }
})

// Route 5 Endpoint for fetching Cart based on user id using POST(Login required)
router.post('/api/viewbyuid', authenticateToken, async (req, res) => {
    try {
        const id = req.data.id;
        const cart = await Cart.find({ userid: id });
        let cartarray = cart.map((item) => { return item._id });
        res.send(cartarray);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ errors: "Internal Server Error" });
    }
})

module.exports = router