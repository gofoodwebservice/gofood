const express = require('express')
const app = express()
const cors = require('cors')
// const port = 5000;
app.use(cors({origin: true, credentials: true}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept"
  );
  next();
})
const { mongoDB } = require("./db")
mongoDB();
app.use(express.json())
app.use('/api',require("./Routes/OrderData"))
app.use('/api',require("./Routes/MyOrdersData"))
app.use('/api',require("./Routes/AdminOrder"))
app.use('/api',require("./Routes/AdminOrderData"))
app.use('/api',require("./Routes/DeleteAdminOrder"))
app.use('/api',require("./Routes/AdminNoted"))
app.use('/api',require("./Routes/AdminDelivered"))
app.use('/api',require("./Routes/RequestDelete"))
app.use('/api',require("./Routes/AcceptRequest"))
app.use('/api',require("./Routes/AskForBill"))
app.use('/api',require("./Routes/AdminBillApproval"))
app.use('/api',require("./Routes/AdminAPI/AddCategory"))
app.use('/api',require("./Routes/AdminAPI/AdminLogin"))
app.use('/api',require("./Routes/AdminAPI/AddItems"));
app.use('/api',require("./Routes/AdminAPI/UpdateItems"));
app.use('/api',require("./Routes/AdminAPI/DeleteItems"));
app.use('/api',require("./Routes/AdminAPI/OutOfStock"));
app.use('/api',require("./Routes/AdminAPI/RequestOTP"));
app.use('/api',require("./Routes/AdminAPI/ResetPassword"));
app.use('/api',require("./Routes/Categories"));
app.use('/api',require("./Routes/MenuList"));


app.get('/', (req, res) => {
    res.send('Hello World!!!!')
})

const PORT = process.env.PORT||8000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})