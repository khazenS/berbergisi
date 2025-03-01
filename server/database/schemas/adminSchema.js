const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username:String,
    password:String,
    adminAccessToken:String,
    subscription:{
        type:Object,
        default:null
    }
})

const Admin = mongoose.model('Admin',adminSchema,'Admin')

module.exports = {Admin};