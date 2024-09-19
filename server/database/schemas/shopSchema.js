const mongoose = require('mongoose')

const shopSchema= new mongoose.Schema({
    shopID:{
        type:Number,
        unique:true,
        default:1
    },
    shopStatus:Boolean,
    cutPrice:Number,
    cutBPrice:Number,
    showMessage:String
})

const Shop = mongoose.model('Shop',shopSchema,'Shop')

module.exports = {Shop}