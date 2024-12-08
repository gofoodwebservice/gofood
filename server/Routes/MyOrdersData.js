const express = require('express');
const router = express.Router();
const Order = require('../model/Order');

router.post('/myOrderDatahistory', async (req, res) => {
    try {
        // Access the email from the query parameters
        const email = req.body.email;
        console.log(email + " myorderdata api");

        // Find the order using the email
        let orderData = await Order.findOne({ email: email });

        // Send the order data back as a response
        console.log(orderData)
        res.status(200).json( {orderData:orderData} );
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
