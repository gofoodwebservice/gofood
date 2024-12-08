const express = require('express');
const router = express.Router();
const AdminOrder = require('../../model/AdminOrder');
const nodemailer = require("nodemailer");
require('dotenv').config(); // Import and configure dotenv



const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: process.env.email,
        pass: process.env.email_auth,   // Replace with your email app password
    }
});

const generateOTPHTML = (OTP) => {
   

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
            .email-body {
                padding: 20px;
                text-align: center;
            }
            .otp-code {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                margin: 20px 0;
            }
            .email-footer {
                padding: 10px;
                background-color: #f4f4f4;
                color: #555;
                text-align: center;
                font-size: 12px;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>Your OTP Code</h1>
            </div>
            <div class="email-body">
                <p>Hello,</p>
                <p>Thank you for using our service. Your One-Time Password (OTP) is:</p>
                <div class="otp-code">${OTP}</div>
                <p>Please use this OTP to complete your Password.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
            <div class="email-footer">
                <p>© 2024 GoFood. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    
    `;
};





// Route to delete orders by email
router.post('/request-otp', async (req, res) => {
    try {
        const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate a 6-digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  try{
    const OTPHtml = generateOTPHTML(otp);
            
            // Send email
            const mailOptions = {
                from: process.env.email, // Replace with your email
                to: email,
                subject: 'OTP to change Password',
                html: OTPHtml
            };
            
            await transporter.sendMail(mailOptions);
            res.status(200).json({otp: otp});
  }
  catch(error){
    console.log(error.message)
    res.status(400).json({message: "Error sending mail request."})
  }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;