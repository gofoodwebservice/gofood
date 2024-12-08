const express = require('express');
const router = express.Router();
const AdminOrder = require( '../model/AdminOrder');
const Order = require('../model/Order');


router.post('/askforbill', async (req, res) => {
    const {email} = req.body;
    try {
        let eAdminId = await AdminOrder.findOne({ 'email': email });
        let eOrderId = await Order.findOne({'email': email});
        
        console.log(eAdminId, email)
       eAdminId.askedForBill = true;
       eOrderId.askedForBill = true;
       await eAdminId.save();
       await eOrderId.save();

       
       console.log(eAdminId);
       res.status(200).json({message: "Successfull"});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;