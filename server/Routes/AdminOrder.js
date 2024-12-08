const express = require('express');
const router = express.Router();
const AdminOrder = require( '../model/AdminOrder');


router.get('/AdminOrderData', async (req, res) => {
    try {
        let allOrders = await AdminOrder.find({});


       
        res.status(200).json({orderData:allOrders})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;