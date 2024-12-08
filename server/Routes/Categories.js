const DB = require('../db')
const express = require('express');
const router = express.Router();
const CategoryItems = require( '../model/Category');


router.get("/categories", async (req,res)=>{
    try{
        let categories = await CategoryItems.find({});
        return res.status(200).send(categories);
    }
    catch(error){
        console.error(error.message);
       return res.status(400).json({message:error.message});
    }
})

module.exports = router;
