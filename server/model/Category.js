const { Int32 } = require('mongodb');
const mongoose = require('mongoose')

const { Schema } = mongoose;

const CategorySchema = new Schema({
    CategoryName: {
        type: String,
        required: true,
    },
    Sequence:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('category_item', CategorySchema)