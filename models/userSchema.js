const mongoose = require('mongoose');
const Product = require('./productSchema')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    user_code: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    allProducts: [{
        skuCode: String,
        productName: String,
        productCode: String,
        quantity: Number,
        price: Number
    }],
});

const User = mongoose.model('USER', userSchema);

module.exports = User;