const mongoose = require('mongoose')

const shopSchema= new mongoose.Schema({
    shopID:{
        type:Number,
        unique:true,
        default:1
    },
    shopStatus:Boolean,
    orderFeature:Boolean,
    showMessage:String,
    costumOpeningDate: {
        type:Date,
        default: null
    },
    costumFormattedOpeningDate: {
        type:String,
        default:null
    },
    services : {
        type : [{
            serviceID:Number,
            name:String,
            estimatedTime:Number,
            amount:Number
        }]
    },
    serviceIDCounter:{
        type:Number
    }

})

const Shop = mongoose.model('Shop',shopSchema,'Shop')

module.exports = {Shop}