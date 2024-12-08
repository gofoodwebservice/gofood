const express = require('express');
const router = express.Router()
const AdminUser = require('../../model/AdminUser')
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const handlebars = require('handlebars');
const fs = require('fs');

const jwtSecret = "RadheRadhe"

router.post('/loginadmin', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await AdminUser.findOne({ email });  //{email:email} === {email}
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        const data = {
            user: {
                id: user.name
            }
        }
       
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.status(200).json({ success: true})


    } catch (error) {
        console.error(error.message)
        res.status(500).json({message: "Server Error"})
    }
});


router.post('/createadmin', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    // body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    // console.log(req.body)
    // let user = await User.findOne({email:req.body.email})
    const salt = await bcrypt.genSalt(10)
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        await AdminUser.create({
            email: req.body.email,
            // password: req.body.password,  first write this and then use bcryptjs
            password: securePass,
            
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret);
            success = true
            res.status(200).json({ success, authToken })
        })
            .catch(err => {
                console.log(err);
                res.status(400).json({ error: "Please enter a unique value." })
            })
    } catch (error) {
        res.status(400).json({message: error.message})

        console.error(error.message)
    }
    
    
})

module.exports = router;