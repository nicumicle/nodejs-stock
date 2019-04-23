const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Define a schema
const Schema = mongoose.Schema;

const StockSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    user_id: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        trim: true,
        required: false,
        default: 1,
    },
    price: {
        type: Number,
        trim: true,
        required: false,
        default: 0.00
    },
    code : {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: false
    }
});

module.exports = mongoose.model('Stock', StockSchema);