const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    text: {
        type: String,
    },
    ratings: {
        type: Number,
    }

});

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number
    },
    price: {
        type: Number,
        required: true
    },
    reviews: {
        type: [reviewSchema]
    },
    description: {
        type: String,
        required: true
    },
    miscellaneous: {
        type: Object,
    }


});
const Review = mongoose.model("review", reviewSchema);
const Product = mongoose.model("product", productSchema);
module.exports = { Review: Review, Product: Product };
