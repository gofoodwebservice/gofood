const express = require('express');
const router = express.Router();
const AdminOrder = require( '../model/AdminOrder');


router.post('/noted', async (req, res) => {
    const {email, innerIndex, outerIndex} = req.body;
    try {
        let eId = await AdminOrder.findOne({ 'email': email })


        console.log(eId.order_data[innerIndex][outerIndex + 1]);
        eId.order_data[innerIndex][outerIndex + 1].isNoted = true;
        eId.markModified('order_data');
        await eId.save();
        console.log(eId.order_data[innerIndex][outerIndex].isNoted);
       
        const allOrders = await AdminOrder.find({});

        // Send the remaining orders as response
        res.status(200).json({ orderData: allOrders });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;