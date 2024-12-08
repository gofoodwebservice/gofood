const express = require('express');
const router = express.Router();
const FoodItems = require( '../model/FoodItems');


router.get('/menulist', async (req, res) => {
    try {
        let allOrders = await FoodItems.find({});


       
        res.status(200).json({orderData:allOrders})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;