const express = require("express");
const router = express.Router();
const Orders = require("../model/Order");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const AdminOrder = require("../model/AdminOrder");
require('dotenv').config(); // Import and configure dotenv

router.post("/orderData", async (req, res) => {
  const { order_data, order_time, email, name, order_date, table } = req.body;

  console.log(order_data[0].currentTime);
  console.log(order_data);
  order_data.splice(0, 0, { Order_time: order_data[0].currentTime, Order_date: order_date });

  // Add the order date to the order data
  // order_data.unshift({ Order_date: order_date });

  try {
    // Check if the user already exists in Orders and AdminOrder collections
    const userOrder = await Orders.findOne({ email });
    const adminOrder = await AdminOrder.findOne({ email });

    // If the user doesn't exist in Orders, create a new entry
    if (!userOrder) {
      await Orders.create({
        email,
        askedForBill: false,
        order_data: [order_data],
      });
    } else {
      // If the user exists, update the existing order data
      await Orders.findOneAndUpdate(
        { email },
        {
          $set: { askedForBill: false },
          $push: { order_data: order_data }
        }
      )
    }

    order_data.forEach((order) => {
      order.isNoted = false;
      order.isDelivered = false;
      order.isRequested = false;
      order.isDeleted = false;
    });
    // If the user doesn't exist in AdminOrder, create a new entry
    if (!adminOrder) {
      await AdminOrder.create({
        email,
        table,
        billApproved: false,
        askedForBill: false,
        order_data: [order_data],
      });
    }
    // } else {
    //   // If the user exists, update the existing admin order data
    //   await AdminOrder.findOneAndUpdate(
    //     { email },
    //     {
    //       $set: { askedForBill: false },
    //       $push: { order_data: order_data }
    //     }
    //   );
    // }

    await AdminOrder.findOneAndUpdate(
        { email }, {table},
        {
          $set: {
            billApproved: false,
            askedForBill: false,
          },
          $push: { order_data: order_data }
        },
        { upsert: true }
      );

    // Send email notification
    // await sendEmail(email, name, order_time);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(400).send("Server Error: " + error.message);
  }
});

// Function to send email
// const sendEmail = async (email, userName, orderDate) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: gofoodwebservice@gmail.com,
//       pass: 'wpckfqkoldjladcy', // Consider using environment variables for sensitive data
//     },
//   });

//   const templateSource = fs.readFileSync("./Routes/template.html", "utf8");
//   const template = handlebars.compile(templateSource);

//   const today = new Date();
//   const dateStr =
//     today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
//   const timeStr =
//     today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

//   const datas = {
//     email,
//     date: dateStr,
//     Time: timeStr,
//     userName,
//   };

//   const html = template(datas);

//   const emailOptions = {
//     from: gofoodwebservice@gmail.com,
//     to: email,
//     subject: "Food Delivery",
//     html,
//   };

//   // try {
//   //   await transporter.sendMail(emailOptions);
//   //   // console.log('Email sent:', emailOptions);
//   // } catch (error) {
//   //   console.error("Error sending email:", error);
//   // }
// };

module.exports = router;
