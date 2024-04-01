require('dotenv').config()
const express = require('express')
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router()
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const Product = require('../models/Product');

//Route 1 for checkout using POST Auth required
const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Learn React Today" }],
    [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])
router.post("/api/pay", authenticateToken, async (req, res) => {
    // try {
    // const lineitems = 

    // console.log(lineitems)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: await Promise.all(req.body.items.map(async item => {
            const storeItem = await Product.findOne({ _id: item.id });
            return {
                price: {
                    currency: "usd",
                    product_data: {
                        name: storeItem.name,
                    },
                    unit_amount: (storeItem.price * 100).toFixed(0),
                },
                quantity: item.quantity
            };

        }))
    })
    res.json({ url: session.url })
    // } catch (e) {
    //     res.status(500).json({ error: e })
    // }
})


// line_items: await Promise.all(req.body.items.map(async item => {
//     const storeItem = await Product.findOne({ _id: item.id });
//     return {
//         price: {
//             currency: "usd",
//             product_data: {
//                 name: storeItem.name,
//             },
//             unit_amount: (storeItem.price * 100).toFixed(0),
//         },
//         quantity: item.quantity
//     };

// }))
module.exports = router