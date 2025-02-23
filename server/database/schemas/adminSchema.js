const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username:String,
    password:String,
    adminAccessToken:String,
    fcm_token:{
        type:String,
        default:null
    }
})

const Admin = mongoose.model('Admin',adminSchema,'Admin')

module.exports = {Admin};