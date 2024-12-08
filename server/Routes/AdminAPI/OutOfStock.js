const express = require('express');
const router = express.Router();
const FoodItems = require( '../../model/FoodItems.js');


router.post('/outofstock', async (req, res) => {
    const { id } = req.body.data;

    try {
        let eFoodId = await FoodItems.findOne({ _id: id });
        console.log(eFoodId)
        
       eFoodId.isStockAvailable = !eFoodId.isStockAvailable;
       await eFoodId.save();
       res.status(200).json({message: "Successfull"});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;