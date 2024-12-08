const express = require('express');
const router = express.Router();
const AdminOrder = require('../model/AdminOrder');

// Route to delete orders by email
router.delete('/requestDeleteOrder', async (req, res) => {
    try {

        const { email, innerIndex, outerIndex } = req.body

        let eId = await AdminOrder.findOne({ 'email': email });
        console.log(email)
        console.log(eId.order_data[outerIndex][innerIndex + 1]);
        console.log(eId.order_data[outerIndex][innerIndex + 1].isRequested);

        // console.log(outerIndex);
        // console.log(innerIndex);
        console.log(eId.order_data[outerIndex][innerIndex + 1].isRequested);
        eId.order_data[outerIndex][innerIndex + 1].isRequested = true;
        console.log(eId.order_data[outerIndex][innerIndex + 1].isRequested);
        eId.markModified('order_data');
        await eId.save();

        // Ensure that the email is present in the request body
        
        // Fetch all remaining orders
        const allOrders = await AdminOrder.find({});

        // Send the remaining orders as response
        res.status(200).json({ orderData: allOrders });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;