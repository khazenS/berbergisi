const mongoose = require('mongoose')
const mongooseSequence = require('mongoose-sequence')

const AutoIncrement = mongooseSequence(mongoose)

const userBookingSchema = new mongoose.Schema({
    userID:{
        type:Number
    },
    name: {
        type:String,
        default:''
    },
    cutType:{
        type:String
    },
    comingWith:{
        type:Number
    },
    bookingToken:{
        type:String
    },
    registerTime:{
        type:Date
    }
})

userBookingSchema.plugin(AutoIncrement,{inc_field: 'userBookingID'})

const UserBooking = mongoose.model('UserBooking',userBookingSchema,'UserBooking')

module.exports = {UserBooking};