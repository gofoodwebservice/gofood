const mongoose = require('mongoose')

const { Schema } = mongoose;

const FoodItemsSchema = new Schema({
    CategoryName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isVegan: Boolean,
    isStockAvailable: Boolean
    
    

});

module.exports = mongoose.model('food_item', FoodItemsSchema)