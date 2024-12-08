const mongoose = require("mongoose");
// const mongoURI = 'mongodb+srv://shivang:shivang@cluster0.51eelfu.mongodb.net/gofoods?retryWrites=true&w=majority';
const mongoURI = 'mongodb://shivang:shivang@ac-chwfz0i-shard-00-00.51eelfu.mongodb.net:27017,ac-chwfz0i-shard-00-01.51eelfu.mongodb.net:27017,ac-chwfz0i-shard-00-02.51eelfu.mongodb.net:27017/gofoods?ssl=true&replicaSet=atlas-12gmst-shard-0&authSource=admin&retryWrites=true&w=majority'

const mongoDB = async () =>{
  try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(mongoURI,{useNewUrlParser: true});
        console.log("Connected to Mongo Successfully!!!!");
       
       
      
      } catch (error) {
        console.log(error);
      }
    };

module.exports = {mongoDB};
