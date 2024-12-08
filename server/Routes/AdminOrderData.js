const express = require('express');
const router = express.Router();
const AdminOrders =require( '../model/AdminOrder');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');




router.post('/adminData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0,0,{Order_time:data.currentTime})
    let eId = await AdminOrders.findOne({ 'email': req.body.email })    
    // console.log(eId)
    if (eId===null) {
        try {
            await AdminOrders.create({
                email: req.body.email,
                askedForBill: false,
                billApproved: false,
                order_data:[data]
            }).then(() => {
                res.status(200).json({ success: true })
            })
        } catch (error) {
            res.status(400).send("Server Error", error.message)

        }
    }

    else {
        try {
            await AdminOrders.findOneAndUpdate({email:req.body.email},
                { $push:{order_data: data} }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            // console.log(error.message)
            res.send("Server Error", error.message)
        }
    }
   
            
      
      
})
module.exports = router;