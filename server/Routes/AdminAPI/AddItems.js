const express = require('express');
const router = express.Router();
const FoodItems = require( '../../model/FoodItems');

router.post('/additem', async (req, res) => {

    const {name, category, img, description, price} = req.body;
    // let data = req.body.order_data
    // await data.splice(0,0,{Order_time:data.currentTime})
    // let eId = await FoodItems.findOne({ 'email': req.body.email })    
    // console.log(eId)
    
        try {
            await FoodItems.create({
                name: name,
                CategoryName: category,
                img: img,
                description: description,
                price: price,
                isVegan: false,
                isStockAvailable: true
            }).then(() => {
                res.status(200).json({ success: true })
            })
        } catch (error) {
            // res.send("Server Error", error.message)
            res.status(400).json({message: error.message});

        }
    }

   
   
            
      
      
)
module.exports = router;