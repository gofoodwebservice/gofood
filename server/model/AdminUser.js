const mongoose = require('mongoose');

const {Schema} = mongoose;

const AdminSchema = new Schema({
    
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
   

  });

  module.exports = mongoose.model('admin', AdminSchema)