const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({

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
    count: {
        type: Number,
        required: true,
    }

});
module.exports = mongoose.model("cart", cartSchema);