const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productNo: {
        type: String,
        required: true
    },
    skuCode: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model("PRODUCT", productSchema);

module.exports = Product;