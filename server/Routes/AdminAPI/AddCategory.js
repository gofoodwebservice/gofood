const express = require('express');
const router = express.Router();
const CategoryItems = require( '../../model/Category');

router.post('/addcategory', async (req, res) => {

    const { category } = req.body;
    console.log(category)
   
    
        try {
            await CategoryItems.create({
                CategoryName: category.name,
                Sequence: category.sequence
                
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