const express = require('express')
const router = express.Router()
const Orders = require('../models/Orders');
const Product = require('../models/Product');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const authenticateToken = require("../middlewares/authenticateToken");


// Route 1 for placing new Order using POST (Login required)

router.post('/api/placeorder', authenticateToken, [
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
        const neworder = await Orders.create(
            {
                userid: user_id,
                productid: prod_id,
                status: "Booked",
                qty: req.body.qty,
            }
        )
        res.status(200).send("Product Ordered sucessfully!");
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send("Internal server error")
    }
})

// Route 2 Endpoint for cancelling order using DELETE (login required)

router.delete('/api/cancelorder', authenticateToken, async (req, res) => {
    try {
        const user_id = req.data.id;
        const order_id = req.body.id;
        var cur_user = await User.findOne({ _id: user_id });
        var order = await Orders.findOne({ _id: order_id });
        if (!cur_user) {
            return res.status(404).send("User not found");
        }
        if (!order) {
            return res.status(404).send("order not found");
        }
        order = await Orders.findByIdAndDelete(order_id)
        res.json({ "Success": "order has been cancelled", order: order });
    }
    catch (err) {

        res.status(500).send("Internal server error")
    }
})

// Route 3 Endpoint for fetching Order details using POST(Login required)

router.post('/api/vieworder', authenticateToken, async (req, res) => {
    try {
        const order_id = req.body.id;
        const order = await Orders.findOne({ _id: order_id });
        if (!order) {
            return res.status(404).send("Order not found");
        }
        res.send(order)
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ errors: "Internal Server Error" });
    }
})
// Route 4 Endpoint for fetching orders based on user id using POST(Login required)
router.post('/api/viewbyuid', authenticateToken, async (req, res) => {
    try {
        const id = req.data.id;
        const orders = await Orders.find({ userid: id });
        let orderarray = orders.map((item) => { return item._id });
        res.send(orderarray);
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ errors: "Internal Server Error" });
    }
})
module.exports = router