const mongoose = require('mongoose');
const { Schema } = mongoose;

const prodescSchema = new Schema({

    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    DOO: {
        type: Date,
        required: true
    }

});
module.exports = mongoose.model("prodesc", prodescSchema);