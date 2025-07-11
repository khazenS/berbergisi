const mongoose = require('mongoose')
const mongooseSequence = require('mongoose-sequence')

const AutoIncrement = mongooseSequence(mongoose)


const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    phoneNumber:{
        type:Number
    },
    userType: {
        type: String,
        enum: ['verified', 'unverified'],
        required: true
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
    createdAt:{
        type:Date
    },
    token : {
        type: String,
        default: null
    },
        
})

// This is for only there will be one user with same phone number and user type
userSchema.index(
    { phoneNumber: 1, userType: 1 }, 
    { unique: true }
)
userSchema.plugin(AutoIncrement,{ inc_field: 'userID' })

const User = mongoose.model('User',userSchema,'Users');

module.exports = {User};