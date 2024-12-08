const express = require('express');
const router = express.Router();
const FoodItems = require('../../model/FoodItems');

router.post('/updateitem', async (req, res) => {
  const { id, name, category, img, description, price } = req.body;

  try {
    // Use findOneAndUpdate with upsert: true
    await FoodItems.findOneAndUpdate(
      { _id: id }, // Query to find existing document
      { 
        name: name, 
        CategoryName: category, 
        img: img, 
        description: description, 
        price: price, 
        isVegan: false,
        isStockAvailable: true
      }, // Update or insert this data
      { new: true, upsert: true } // Create a new document if it doesn't exist
    );

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
