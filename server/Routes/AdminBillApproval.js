const express = require('express');
const router = express.Router();
const AdminOrder = require( '../model/AdminOrder');
const Order = require('../model/Order');
const nodemailer = require("nodemailer");
require('dotenv').config(); // Import and configure dotenv


const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: 'gofoodwebservice@gmail.com',
        pass: 'wpckfqkoldjladcy',   // Replace with your email app password
    }
});

// Helper function to create a bill in HTML format
const generateBillHtml = (orders) => {
    let itemRows = '';
    let totalCost = 0;
const salesTax = 10;

    // Flatten all orders and generate rows
    orders.forEach(orderGroup => {
        // Skip the first item in the group as it's metadata, not an order item
        orderGroup.slice(1).forEach(item => {
            const itemTotal = item.price;
            totalCost += itemTotal;
            itemRows += `
                <tr>
                    <td bgcolor="#FFF" width="40" align="left" style="color:#5a5a5a;padding:10px 0 10px 0;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                    </td>
                    <td bgcolor="#FFFFFF" align="left" style="color:#5a5a5a;padding:10px 40px 10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:normal;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                         ${item.name} (${item.qty})
                    </td>
                    <td style="padding:10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-size:14px;">
                        ${itemTotal / item.qty} * ${item.qty}
                    </td>
                    <td bgcolor="#FFFFFF" align="right" style="color:#5a5a5a;padding:10px 40px 10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                         $${itemTotal.toFixed(2)}
                    </td>
                    <td bgcolor="#FFF" width="40" align="left" style="color:#5a5a5a;padding:10px 0 10px 0;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                    </td>
                </tr>
            `;
        });
    });

    totalCost += salesTax;

    return `
    <html lang="en">
    <head>
    <!--[if gte mso 9]>
                <xml>
                    <o:OfficeDocumentsettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentsettings>
                </xml>
            <![endif]-->
    <!--[if gt mso 15]>
         <style type="text/css" media="all">
         /* Outlook 2016 Height Fix */
         table, tr, td {border-collapse: collapse;}
         tr { font-size:0px; line-height:0px; border-collapse: collapse; }
         </style>
         <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="robots" content="noindex, nofollow">
    <title>Invoice Email</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
    body {
        margin: 0;
        padding: 0;
        mso-line-height-rule: exactly;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
       }
     body, table, td, p, a, li {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        font-family: 'Lato', Arial, Helvetica, sans-serif;
    }
     table td {
        border-collapse: collapse;
    }
     table {
        border-spacing: 0;
        border-collapse: collapse;
        border-color: #FFFFFF;
    }
     p, a, li, td, blockquote {
        mso-line-height-rule: exactly;
    }
     p, a, li, td, body, table, blockquote {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
    }
     img, a img {
        border: 0;
        outline: none;
        text-decoration: none;
    }
     img {
        -ms-interpolation-mode: bicubic;
    }
     * img[tabindex="0"] + div {
        display: none !important;
    }
     a[href^=tel],a[href^=sms],a[href^=mailto], a[href^=date] {
        color: inherit;
        cursor: default;
        text-decoration: none;
    }
     a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important}
     .logo {
        width: 220px!important;
        height: 35px!important;
    }
     .logo-footer {
        width: 129px!important;
        height: 29px!important;
    }
     .table-container .alert-icon {
        width: 120px!important;
        height: 120px!important;
    }
     .table-container .avatar-img {
        width: 64px!important;
        height: 64px!important;
    }
     .x-gmail-data-detectors, .x-gmail-data-detectors * {
        border-bottom: 0 !important;
        cursor: default !important}
     @media screen {
        body {
        font-family: 'Lato', Arial, Helvetica, sans-serif;
    }
     }
    @media only screen and (max-width: 640px) {
        body {
        margin: 0px!important;
        padding: 0px!important;
    }
    body, table, td, p, a, li, blockquote {
        -webkit-text-size-adjust: none!important;
    }
    .table-main, .table-container,.social-icons,table,.table-container td {
        width: 100%!important;
        min-width: 100%!important;
        margin: 0!important;
        float: none!important;
    }
    .table-container img {
        width: 100%!important;
        max-width: 100%!important;
        display: block;
        height: auto!important;
    }
     .table-container a {
        width: 50%!important;
        max-width: 100%!important;
    }
     .table-container .logo {
        width: 200px!important;
        height: 30px!important;
    }
     .table-container .alert-icon {
        width: 120px!important;
        height: 120px!important;
    }
     .social-icons {
        float: none!important;
        margin-left: auto!important;
        margin-right: auto!important;
        width: 220px!important;
        max-width: 220px!important;
        min-width: 220px!important;
        background: #383e56!important;
    }
    .social-icons td {
        width: auto!important;
        min-width: 1%!important;
        margin: 0!important;
        float: none!important;
        text-align: center;
    }
    .social-icons td a {
        width: auto!important;
        max-width: 100%!important;
        font-size: 10px!important;
    }
     .mobile-title {
        font-size: 34px!important;
    }
     .table-container .logo-footer {
        width: 129px!important;
        height: 29px!important;
        margin-bottom: 20px!important;
    }
     .block-img {
        width: 100%;
        height: auto;
        margin-bottom: 20px;
    }
     .info-block {
        padding: 0!important;
    }
     .video-img {
        width: 100%!important;
        height: auto!important;
    }
     .post-footer-container td {
        text-align: center!important;
        padding: 0 40px 0 40px!important;
    }
     }
    
    </style>
    </head>
    <body style="padding: 0; margin: 0; -webkit-font-smoothing:antialiased; background-color:#f1f1f1; -webkit-text-size-adjust:none;">
    <!--Main Parent Table -->
    <table width="100%" border="0" cellpadding="0" direction="ltr" bgcolor="#f1f1f1" cellspacing="0" role="presentation" style="width: 640px; min-width: 640px; margin:0 auto 0 auto;">
    <tbody>
    // <tr>
    //     <td style="display:none;font-size:0;line-height:0;color:#111111;">
    //          Sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
    //     </td>
    // </tr>
    <tr>
        <td>
            <!--Content Starts Here -->
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#f1f1f1">
            <tr>
                <td height="30" style="line-height:30px;min-height:30px;">
                </td>
            </tr>
            </table>
            <!--Top Header Starts Here -->
            <table border="0" bgcolor="#383e56" cellpadding="0" cellspacing="0" width="640" role="presentation" width="640" style="width: 640px; min-width: 640px;" align="center" class="table-container ">
            <tbody>
            <tr width="640" style="width: 640px; min-width: 640px; " align="center">
                <td>
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#383e56">
                    <tr>
                        <td height="35" style="line-height:35px;min-height:35px;">
                        </td>
                    </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" width="640" style="width: 640px; min-width: 640px;" role="presentation" align="center" bgcolor="#383e56">
                    <tr>
                        <td align="left">
                            <table cellpadding="0" cellspacing="0" border="0" role="presentation" align="center" bgcolor="#383e56">
                            <tr>
                                <td>
                                    <table cellpadding="0" cellspacing="0" border="0" align="center" role="presentation">
                                    <tr>
                                        <td align="center">
                                            <img src="https://drive.google.com/uc?export=view&id=1hrpkgmQmIc5qzZF4tJ1LJZoURdkx7sfl
                                            " alt="Logo" width="220" height="35" class="logo">
                                        </td>
                                    </tr>
                                    </table>
                                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#383e56">
                                    <tr>
                                        <td height="35" style="line-height:35px;min-height:35px;">
                                        </td>
                                    </tr>
                                    </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                    </tr>
                    </table>
                </td>
            </tr>
            </tbody>
            </table>
            <!--Top Header Ends Here -->
            <!--Welcome  Section Ends Here -->
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tr>
                <td height="60" style="line-height:60px;min-height:60px;">
                </td>
            </tr>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="640" role="presentation" bgcolor="#FFFFFF" class="table-container ">
            <tbody>
            <tr>
                <td align="center">
                    <img src="https://drive.google.com/uc?export=view&id=1eSRO71LqN8k6tadUA4aGR5LLe0-HYbZZ
                    " alt="Section Image" width="120" height="120" class="alert-icon">
                </td>
            </tr>
            </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tr>
                <td height="20" style="line-height:20px;min-height:20px;">
                </td>
            </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tbody>
            <tr>
                <td align="center" style="color:#45535C;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:800;font-size:34px;-webkit-font-smoothing:antialiased;line-height:1.2;" class="table-container mobile-title">
                     Thanks for your order!
                </td>
            </tr>
            <tr>
                <td align="center" style="color:#45535C;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:800;font-size:18px;-webkit-font-smoothing:antialiased;line-height:1.2;" class="table-container mobile-title">
                     Here’s what you ordered
                </td>
            </tr>
            <tr>
                <td align="center" style="color:#5a5a5a;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:normal;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;" class="table-container">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </td>
            </tr>
            </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tr>
                <td height="60" style="line-height:60px;min-height:60px;">
                </td>
            </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tbody>
            <tr>
                <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
                <tbody>
                <tr>
                    <td bgcolor="#FFF" width="40" align="left" style="color:#5a5a5a;padding:10px 0 10px 0;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                    </td>
                    <td bgcolor="#f9f9f9" align="left" style="color:#5a5a5a;padding:10px 40px 10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                         Order Confirmation #
                    </td>
                    <td bgcolor="#f9f9f9" align="right" style="color:#5a5a5a;padding:10px 40px 10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                         4543656
                    </td>
                    <td bgcolor="#FFF" width="40" align="left" style="color:#5a5a5a;padding:10px 0 10px 0;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                    </td>
                </tr>
                </tbody>
                </table>
                
                <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tbody>
                ${itemRows}
            </tbody>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tbody>
               
                <tr>
                    <td bgcolor="#FFF" width="40" align="left" style="color:#5a5a5a;padding:10px 0 10px 0;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                    </td>
                    <td bgcolor="#FFFFFF" align="left" style="color:#5a5a5a;padding:10px 40px 10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:normal;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                          Taxes
                    </td>
                    <td bgcolor="#FFFFFF" align="right" style="color:#5a5a5a;padding:10px 40px 10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                         $${salesTax.toFixed(2)}
                    </td>
                    <td bgcolor="#FFF" width="40" align="left" style="color:#5a5a5a;padding:10px 0 10px 0;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                    </td>
                </tr>
            </tbody>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tbody>
                <tr>
                    <td bgcolor="#FFF" width="40" align="left" style="color:#5a5a5a;padding:10px 0 10px 0;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                    </td>
                    <td bgcolor="#FFFFFF" align="left" style="border-top:2px solid #CCCCCC;border-bottom:2px solid #CCCCCC;color:#5a5a5a;padding:10px 40px 10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                         TOTAL
                    </td>
                    <td bgcolor="#FFFFFF" align="right" style="border-top:2px solid #CCCCCC;border-bottom:2px solid #CCCCCC;color:#5a5a5a;padding:10px 40px 10px 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:16px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                         $${totalCost.toFixed(2)}
                    </td>
                    <td bgcolor="#FFF" width="40" align="left" style="color:#5a5a5a;padding:10px 0 10px 0;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:bold;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;">
                    </td>
                </tr>
            </tbody>
        </table>
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
            <tr>
                <td height="60" style="line-height:60px;min-height:60px;">
                </td>
            </tr>
            </table>
            <table bgcolor="#383e56" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
            <tr>
                <td height="35" style="line-height:35px;min-height:35px;">
                </td>
            </tr>
            </table>
            <table bgcolor="#383e56" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
            <tr>
                <td height="35" style="line-height:35px;min-height:35px;">
                </td>
            </tr>
            </table>
            <table cellpadding="0" width="640" style="width: 640px; min-width: 640px;" cellspacing="0" border="0" role="presentation" align="center" bgcolor="#383e56">
            <tbody>
            <tr>
                <td>
                    <table cellpadding="0" width="220" cellspacing="0" border="0" role="presentation" align="center" bgcolor="#383e56">
                    <tbody>
                    <tr class="social-icons" >
                        <td style="padding:0 10px 0 10px; margin-bottom: 2rem;">
                            <a href="https://www.MailerSend.com/" target="_blank"><img src="https://drive.google.com/uc?export=view&id=1uviAcx0OOiFCy0jM1sSU4ikoqfVWjUco
                            " alt="Social Icons" width="30" height="30" class="social-icon"></a>
                        </td>
                        <td style="padding:0 10px 0 10px;margin-bottom: 2rem;">
                            <a href="https://www.MailerSend.com/" target="_blank"><img src="https://drive.google.com/uc?export=view&id=1PlyWONxFUVDjqmlc4uOORXjTcWhAgKwJ
                            " alt="Social Icons" width="30" height="30" class="social-icon"></a>
                        </td>
                        <td style="padding:0 10px 0 10px;margin-bottom: 2rem">
                            <a href="https://www.MailerSend.com/" target="_blank"><img src="https://drive.google.com/uc?export=view&id=1bfm3oAyL2BNRycLXeFRE2_HEPovWfPQ-
                            " alt="Social Icons" width="30" height="30" class="social-icon"></a>
                        </td>
                        <td style="padding:20px 15px 20px 15px; margin-bottom: 2rem">
                            <a href="https://www.MailerSend.com/" target="_blank"><img src="https://drive.google.com/uc?export=view&id=1QhfLK76RA678W2sPnBY_q-iUq3x3CCx_
                            " alt="Social Icons" width="30" height="30" class="social-icon"></a>
                        </td>
                    </tr>
                    </tbody>
                    </table>
                </td>
            </tr>
            </tbody>
            </table>
            
          
            <!--Bottom Section Ends Here -->
            <!--Main Td  Ends Here -->
        </td>
    </tr>
    </tbody>
    <!--Main Parent Table Ends Here -->
    </table>
    </body>
    </html>
    `;
};


router.post('/approvebill', async (req, res) => {
    const {email} = req.body;
    try {
        let eAdminId = await AdminOrder.findOne({ 'email': email });
        
       eAdminId.billApproved = true;
       await eAdminId.save();
       console.log(eAdminId);
       try{

        const filteredData = eAdminId.order_data.map(subArray => 
            subArray.filter(item => !item.isDeleted)
          );
        const billHtml = generateBillHtml(filteredData);
        
        // Send email
        const mailOptions = {
            from: 'gofoodwebservice@gmail.com', // Replace with your email
            to: email,
            subject: 'Your Order Bill',
            html: billHtml
        };
        
        await transporter.sendMail(mailOptions);
    }
    catch (error){
        console.log(error.message);
    }
       res.status(200).json({message: "Successfull"});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;