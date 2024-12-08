const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../../model/AdminUser'); // Replace with the path to your AdminUser model
const jwtSecret = "RadheRadhe"; // Replace with your secret

// Reset Password API
router.post('/reset-password', [
    body('email').isEmail(),
    body('newPassword').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // Check if the user exists
        let user = await AdminUser.findOne({ email: req.body.email });
        console.log(user)
        if (!user) {
            return res.status(404).json({ success, message: "User not found" });
        }

        // Generate salt and hash the new password
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.newPassword, salt);

        // Update the password in the database
        user.password = securePass;
        await user.save();

        success = true;
        res.status(200).json({ success, message: "Password reset successful" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, message: "Internal server error" });
    }
});

module.exports = router;
