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
    },
    date: {
        type: Date,
        default: Date.now
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
    images: {
        type: [String]
    },
    miscellaneous: {
        type: Object,
    }


});
module.exports = mongoose.model("product", productSchema);
