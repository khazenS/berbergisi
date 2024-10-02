const mongoose = require('mongoose')

const shopSchema= new mongoose.Schema({
    shopID:{
        type:Number,
        unique:true,
        default:1
    },
    shopStatus:Boolean,
    orderFeature:Boolean,
    cutPrice:Number,
    cutBPrice:Number,
    showMessage:String,
    costumOpeningDate: {
        type:Date,
        default: null
    },
    costumFormattedOpeningDate: {
        type:String,
        default:null
    }
})

const Shop = mongoose.model('Shop',shopSchema,'Shop')

module.exports = {Shop}