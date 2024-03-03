const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    DOO: {
        type: Date,
        default: Date.now,
        required: true
    }

});
module.exports = mongoose.model("orders", orderSchema);