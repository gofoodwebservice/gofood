const mongoose = require('mongoose')

const { Schema } = mongoose;

const AdminOrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    askedForBill: Boolean,
    billApproved: Boolean,
    table: {
        type: String,

    },
    order_data: {
        type: Array,
        required: true,
    },

});

module.exports = mongoose.model('adminorder', AdminOrderSchema)