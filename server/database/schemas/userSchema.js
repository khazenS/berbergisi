const mongoose = require('mongoose')
const mongooseSequence = require('mongoose-sequence')

const AutoIncrement = mongooseSequence(mongoose)


const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    phoneNumber:{
        type:Number,
        unique:true
    },
    userCount:{
        type:[{
            serviceID:Number,
            count:Number
        }],
        default:[]
    },
    paid:{
        type:Number,
        default:0
    },
    existTime:{
        type:Date
    }    
})

userSchema.plugin(AutoIncrement,{ inc_field: 'userID' })

const User = mongoose.model('User',userSchema,'Users');

module.exports = {User};