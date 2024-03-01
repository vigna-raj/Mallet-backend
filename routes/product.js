const express = require('express')
const router = express.Router()
const { Product } = require('../models/Product');
const { Review } = require('../models/Product');
const { body, validationResult } = require('express-validator');
const authenticateToken = require("../middlewares/authenticateToken");


router.post('/api/addproduct', authenticateToken, [
    body('name', "name must atlest have 3 characters").isLength({ min: 3 }),
    body('category', "category must atlest have 3 characters").isLength({ min: 3 }),
    body('stock', "Stock must be a number").isInt(),
    body('price', "price must be a number").isFloat(),
    body('description', "description must atlest have 3 characters").isLength({ min: 3 }),
    body('miscellaneous', "Specifications must be an object").isObject(),


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
            }
        )
        res.status(200).send("Product saved sucessfully!");
    }
    catch (err) {

        res.status(500).send("Internal server error")
    }
})

module.exports = router