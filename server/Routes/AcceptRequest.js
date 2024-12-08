const express = require('express');
const router = express.Router();
const AdminOrder = require( '../model/AdminOrder');


router.post('/request', async (req, res) => {
    const {email, innerIndex, outerIndex, flag} = req.body;
    try {
        let eId = await AdminOrder.findOne({ 'email': email })
        
        // console.log(eId.order_data)
        // console.log("object")
        console.log(innerIndex, outerIndex);
        console.log(eId.order_data[outerIndex][innerIndex + 1]);
        if(flag){

            eId.order_data[outerIndex][innerIndex + 1].isDeleted = true;
            // eId.order_data[outerIndex][innerIndex].isDeleted = true;
        }

        eId.order_data[outerIndex][innerIndex + 1].isRequested = false;
        // eId.order_data[outerIndex][innerIndex].isRequested = false;

        eId.markModified('order_data');
        await eId.save();
        console.log(eId.order_data[outerIndex][innerIndex + 1].isDeleted);
       
        const allOrders = await AdminOrder.find({});

        // Send the remaining orders as response
        res.status(200).json({ orderData: allOrders });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;