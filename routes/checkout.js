require('dotenv').config()
const express = require('express')
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router()
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const Product = require('../models/Product');

//Route 1 for checkout using POST Auth required

router.post("/api/pay", authenticateToken, async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: await Promise.all(req.body.items.map(async item => {
                const storeItem = await Product.findOne({ _id: item.id });
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: storeItem.name,
                        },
                        unit_amount: (storeItem.price * 100).toFixed(0),
                    },
                    quantity: item.quantity
                };

            })),
            success_url: "https://google.com", //to be filled
            cancel_url: "https://google.com", // to be filled
        })
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e })
    }
})


module.exports = router